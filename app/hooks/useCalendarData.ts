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
        console.log('fetchData called, memberId:', memberId);
        setLoading(true);
        try {
            // 1. Fetch KBO games for 2025 and 2026 (March to October) from backend
            const years = [2025, 2026];
            const months = [3, 4, 5, 6, 7, 8, 9, 10];

            console.log(`Starting to fetch games for years: ${years} and months: ${months}`);

            const fetchPromises: Promise<any[]>[] = [];
            years.forEach(year => {
                months.forEach(month => {
                    const url = `http://localhost:8080/api/v1/games/monthly?year=${year}&month=${month}`;
                    fetchPromises.push(
                        fetch(url)
                            .then(res => {
                                console.log(`Fetched ${url}, status: ${res.status}`);
                                return res.ok ? res.json() : [];
                            })
                            .catch(err => {
                                console.error(`Error fetching ${url}:`, err);
                                return [];
                            })
                    );
                });
            });

            const allResults = await Promise.all(fetchPromises);
            const gamesData = allResults.flat();
            console.log(`Total games fetched from backend: ${gamesData.length}`);

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
                id: game.id,
                game_date_time: game.gameDateTime,
                home_team_id: game.homeTeamId,
                away_team_id: game.awayTeamId,
                home_score: game.homeScore,
                away_score: game.awayScore,
                status: game.status,
                home_team: { name: game.homeTeamName },
                away_team: { name: game.awayTeamName },
                stadium_id: game.stadiumId,
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
            console.log(`Marked ${Object.keys(newMarkedDates).length} dates on calendar.`);


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

