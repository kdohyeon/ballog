export interface Team {
    id: string;
    name: string;
    shortName: string;
    primaryColor: string;
}

export const TEAMS: Team[] = [
    { id: '1', name: 'LG Twins', shortName: 'LG', primaryColor: '#C30452' },
    { id: '2', name: 'KT Wiz', shortName: 'KT', primaryColor: '#000000' },
    { id: '3', name: 'SSG Landers', shortName: 'SSG', primaryColor: '#CE0E2D' },
    { id: '4', name: 'NC Dinos', shortName: 'NC', primaryColor: '#315288' },
    { id: '5', name: 'Doosan Bears', shortName: 'Doosan', primaryColor: '#131230' },
    { id: '6', name: 'KIA Tigers', shortName: 'KIA', primaryColor: '#EA0029' },
    { id: '7', name: 'Lotte Giants', shortName: 'Lotte', primaryColor: '#041E42' },
    { id: '8', name: 'Samsung Lions', shortName: 'Samsung', primaryColor: '#074CA1' },
    { id: '9', name: 'Hanwha Eagles', shortName: 'Hanwha', primaryColor: '#F37321' },
    { id: '10', name: 'Kiwoom Heroes', shortName: 'Kiwoom', primaryColor: '#820024' },
];
