import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

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
    const [games, setGames] = useState<CalendarGame[]>([]);
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch ALL KBO games for the year (not filtered by team)
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

            const typedGames = (gamesData as any[] || []) as CalendarGame[];
            setGames(typedGames);

            // Combine data for markedDates — group multiple games per date
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
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { games, markedDates, loading, refresh: fetchData };
}
