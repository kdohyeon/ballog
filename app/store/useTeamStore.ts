import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Team {
    id: string;
    name: string;
    colors: { primary: string; secondary: string };
    logo?: string;
}

interface TeamState {
    myTeam: Team | null;
    setTeam: (team: Team) => void;
    clearTeam: () => void;
}

export const KBO_TEAMS: Team[] = [
    { id: 'kia', name: 'KIA', colors: { primary: '#EA0029', secondary: '#000000' } },
    { id: 'samsung', name: 'Samsung', colors: { primary: '#074CA1', secondary: '#FFFFFF' } },
    { id: 'lg', name: 'LG', colors: { primary: '#C30452', secondary: '#000000' } },
    { id: 'doosan', name: 'Doosan', colors: { primary: '#131230', secondary: '#ED1C24' } },
    { id: 'kt', name: 'KT', colors: { primary: '#000000', secondary: '#ED1C24' } },
    { id: 'ssg', name: 'SSG', colors: { primary: '#CE0E2D', secondary: '#000000' } },
    { id: 'lotte', name: 'Lotte', colors: { primary: '#041E42', secondary: '#D00F31' } },
    { id: 'hanwha', name: 'Hanwha', colors: { primary: '#F37321', secondary: '#000000' } },
    { id: 'nc', name: 'NC', colors: { primary: '#315288', secondary: '#AF917B' } },
    { id: 'kiwoom', name: 'Kiwoom', colors: { primary: '#570514', secondary: '#FFFFFF' } },
];

export const useTeamStore = create<TeamState>()(
    persist(
        (set) => ({
            myTeam: null,
            setTeam: (team) => set({ myTeam: team }),
            clearTeam: () => set({ myTeam: null }),
        }),
        {
            name: 'ballog-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
