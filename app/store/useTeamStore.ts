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
    { id: 'a7639de1-2191-4cd6-8107-34692c572524', name: 'KIA', colors: { primary: '#EA0029', secondary: '#000000' } },
    { id: '2489cc44-0826-40d0-8cfe-f2190c0940a5', name: 'Samsung', colors: { primary: '#074CA1', secondary: '#FFFFFF' } },
    { id: '833c6a24-2465-4f8e-a9bc-c623edbe166c', name: 'LG', colors: { primary: '#C30452', secondary: '#000000' } },
    { id: '10371cb1-d5f9-42e1-879c-9e9157afb0b4', name: 'Doosan', colors: { primary: '#131230', secondary: '#ED1C24' } },
    { id: '098c3970-5175-4e08-b07b-19a123a12b45', name: 'KT', colors: { primary: '#000000', secondary: '#ED1C24' } },
    { id: 'e186c147-e777-455c-987c-98e3186cefac', name: 'SSG', colors: { primary: '#CE0E2D', secondary: '#000000' } },
    { id: '42feaad3-9b73-450d-a68d-9225779c0ad3', name: 'Lotte', colors: { primary: '#041E42', secondary: '#D00F31' } },
    { id: 'f06d6a7a-f3d3-4db4-982e-aa4f95905f71', name: 'Hanwha', colors: { primary: '#F37321', secondary: '#000000' } },
    { id: 'e9ebbea2-e0a2-483a-b124-17c0dd791dd4', name: 'NC', colors: { primary: '#315288', secondary: '#AF917B' } },
    { id: '738f924f-1e76-400b-8f48-cebd393cbbad', name: 'Kiwoom', colors: { primary: '#570514', secondary: '#FFFFFF' } },
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
