export interface Player {
    id: string;
    name: string;
    seed: number;
}

export interface Match {
    id: string;
    player1Id: string | null;
    player2Id: string | null;
    winnerId: string | null;
    score: any | null;
    status: string;
}

export interface Round {
    round: number;
    matches: Match[];
}

export interface Bracket {
    name: string;
    type: "singles" | "doubles";
    players: Player[];
    matches: Match[];
    rounds?: Round[];
}

export interface Tournament {
    name: string;
    createdAt: Date;
    brackets: Bracket[];
    lastModifiedBy?: string;
    lastUpdatedAt?: Date | string;
}

export interface TournamentProps {
    tournamentData: {
        tournament: Tournament;
    };
}
