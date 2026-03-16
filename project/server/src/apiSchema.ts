export interface BracketRequest {
    name: string;
    type: "singles" | "doubles";
    numPlayers: number;
}

export interface CreateTournamentRequest {
    ownerId?: string;
    name: string;
    brackets: BracketRequest[];
}

export interface BulkPlayerEntry {
    playerName: string;
    playerIndex: number;
    playerSeed: number;
}

export interface BulkPlayerRequest {
    tournamentName: string;
    bracketName: string;
    players: BulkPlayerEntry[];
}
