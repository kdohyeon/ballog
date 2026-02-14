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
    home_team: {
        name: string;
        code: string;
        primary_color: string;
    };
    away_team: {
        name: string;
        code: string;
        primary_color: string;
    };
    stadium_id: string;
    stadium_name: string;
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

export function useCalendarData(year?: number, month?: number) {
    const { memberId } = useAuthStore();
    const [games, setGames] = useState<CalendarGame[]>([]);
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        console.log('fetchData called, year:', year, 'month:', month, 'memberId:', memberId);
        setLoading(true);
        try {
            // 1. Fetch KBO games for specific year and month from backend
            const currentYear = year || new Date().getFullYear();
            const currentMonth = month || (new Date().getMonth() + 1);

            console.log(`Starting to fetch games for year: ${currentYear} and month: ${currentMonth}`);

            const url = `http://localhost:8080/api/v1/games/monthly?year=${currentYear}&month=${currentMonth}`;
            const res = await fetch(url);
            console.log(`Fetched ${url}, status: ${res.status}`);

            const gamesData = res.ok ? await res.json() : [];
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

            const typedGames = (gamesData as any[] || []).map(game => {
                // Defensive checks for nested objects (handles both old flat format and new nested format during transition)
                const homeTeam = game.homeTeam || { id: game.homeTeamId, name: game.homeTeamName, code: game.homeTeamCode, primaryColor: game.homeTeamPrimaryColor };
                const awayTeam = game.awayTeam || { id: game.awayTeamId, name: game.awayTeamName, code: game.awayTeamCode, primaryColor: game.awayTeamPrimaryColor };
                const stadium = game.stadium || { id: game.stadiumId, name: game.stadiumName };

                return {
                    id: game.id,
                    game_date_time: game.gameDateTime,
                    home_team_id: homeTeam?.id,
                    away_team_id: awayTeam?.id,
                    home_score: game.homeScore,
                    away_score: game.awayScore,
                    status: game.status,
                    home_team: {
                        name: homeTeam?.name || '',
                        code: homeTeam?.code || '',
                        primary_color: homeTeam?.primary_color || homeTeam?.primaryColor || ''
                    },
                    away_team: {
                        name: awayTeam?.name || '',
                        code: awayTeam?.code || '',
                        primary_color: awayTeam?.primary_color || awayTeam?.primaryColor || ''
                    },
                    stadium_id: stadium?.id,
                    stadium_name: stadium?.name || '',
                    record: attendanceMap.get(game.id)
                        ? {
                            id: attendanceMap.get(game.id).id,
                            seatInfo: attendanceMap.get(game.id).seatInfo,
                            content: attendanceMap.get(game.id).content,
                            ticketImageUrl: attendanceMap.get(game.id).ticketImageUrl,
                            supportedTeamId: attendanceMap.get(game.id).supportedTeamId,
                        }
                        : undefined
                };
            }) as CalendarGame[];

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
    }, [memberId, year, month]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { games, markedDates, loading, refresh: fetchData };
}

