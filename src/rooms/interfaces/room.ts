export interface Room {
    id: string;
    isPrivate: boolean;
    roomCode?: string;
    playersUsernames: string[];
    playersSelected: { [userId: string]: string[] };
    maxPlayers: number;
    pointsInGame: number;
    status: 'waiting' | 'selecting' | 'playing' | 'finished';
    winner?: string;
}