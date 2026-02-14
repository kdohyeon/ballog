import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Team {
    id: string;
    name: string;
    shortName: string;
    code: string;
    colors: { primary: string };
    logo?: string;
}

interface TeamState {
    myTeam: Team | null;
    teams: Team[];
    setTeam: (team: Team) => void;
    clearTeam: () => void;
    fetchTeams: () => Promise<void>;
}

export const useTeamStore = create<TeamState>()(
    persist(
        (set, get) => ({
            myTeam: null,
            teams: [],
            setTeam: (team) => set({ myTeam: team }),
            clearTeam: () => set({ myTeam: null }),
            fetchTeams: async () => {
                // Return if already fetched (simple local cache)
                if (get().teams.length > 0) return;

                try {
                    const response = await fetch('http://localhost:8080/api/v1/teams');
                    if (!response.ok) throw new Error('Failed to fetch teams');

                    const data = await response.json();
                    const mappedTeams: Team[] = data.map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        shortName: t.shortName,
                        code: t.code,
                        colors: {
                            primary: t.primaryColor || '#000000'
                        },
                        logo: t.logoUrl
                    }));

                    set({ teams: mappedTeams });
                } catch (error) {
                    console.error('Error fetching teams:', error);
                }
            },
        }),
        {
            name: 'ballog-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
