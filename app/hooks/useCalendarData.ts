import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { useAuthStore } from '../store/useAuthStore';

export interface CalendarGame {
    id: string;
    game_date_time: string;
    home_team_id: string;
    away_team_id: string;
    home_score: number | null;
    away_score: number | null;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELED' | 'SUSPENDED';
    home_team: { name: string };
    away_team: { name: string };
    stadium_id: string;
    record?: {
        id: string;
        seatInfo: string | null;
        content: string | null;
        ticketImageUrl: string | null;
        supportedTeamId: string | null;
    };
}

export type MarkedDateDetails = {
    customStyles?: {
        container: {
            backgroundColor: string;
        };
        text: {
            color: string;
            fontWeight: 'bold';
        };
    };
    marked?: boolean;
    dotColor?: string;
    games: CalendarGame[];
};

export type MarkedDates = {
    [date: string]: MarkedDateDetails;
};

export function useCalendarData() {
    const { memberId } = useAuthStore();
    const [games, setGames] = useState<CalendarGame[]>([]);
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Fetch ALL KBO games for the year
            const startOfYear = '2026-01-01T00:00:00+09:00';
            const endOfYear = '2026-12-31T23:59:59+09:00';

            const { data: gamesData, error: gamesError } = await supabase
                .from('games')
                .select(`
                    *,
                    home_team:teams!home_team_id(name),
                    away_team:teams!away_team_id(name)
                `)
                .gte('game_date_time', startOfYear)
                .lte('game_date_time', endOfYear);

            if (gamesError) throw gamesError;

            // 2. Fetch User Records to identify attended games
            let attendanceMap: Map<string, any> = new Map();
            if (memberId) {
                try {
                    const res = await fetch(`http://localhost:8080/api/v1/records?memberId=${memberId}`);
                    if (res.ok) {
                        const records = await res.json();
                        records.forEach((r: any) => attendanceMap.set(r.gameId, r));
                    }
                } catch (e) {
                    console.error('Error fetching records for calendar:', e);
                }
            }

            const typedGames = (gamesData as any[] || []).map(game => ({
                ...game,
                record: attendanceMap.get(game.id)
                    ? {
                        id: attendanceMap.get(game.id).id,
                        seatInfo: attendanceMap.get(game.id).seatInfo,
                        content: attendanceMap.get(game.id).content,
                        ticketImageUrl: attendanceMap.get(game.id).ticketImageUrl,
                        supportedTeamId: attendanceMap.get(game.id).supportedTeamId,
                    }
                    : undefined
            })) as CalendarGame[];

            setGames(typedGames);

            // 3. Combine data for markedDates
            const newMarkedDates: MarkedDates = {};

            typedGames.forEach((game) => {
                const dateKey = format(new Date(game.game_date_time), 'yyyy-MM-dd');

                if (!newMarkedDates[dateKey]) {
                    newMarkedDates[dateKey] = {
                        marked: true,
                        dotColor: '#FF7E67',
                        games: [],
                    };
                }

                newMarkedDates[dateKey].games.push(game);
            });

            setMarkedDates(newMarkedDates);

        } catch (e) {
            console.error('Error fetching calendar data:', e);
        } finally {
            setLoading(false);
        }
    }, [memberId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { games, markedDates, loading, refresh: fetchData };
}

