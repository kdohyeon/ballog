export interface Team {
    id: string;
    name: string;
    shortName: string;
    code: string;
    logoUrl?: string;
    primaryColor?: string;
}

export interface Stadium {
    id: string;
    name: string;
    weatherKeyword?: string;
}

export enum GameStatus {
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED',
    CANCELED = 'CANCELED',
    SUSPENDED = 'SUSPENDED',
}

export interface Game {
    id: string;
    gameDateTime: string;
    gameId: string;
    homeTeam: Team;
    awayTeam: Team;
    stadium: Stadium;
    homeScore: number;
    awayScore: number;
    status: GameStatus;
}
