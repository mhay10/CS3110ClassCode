export interface CreateTournamentRequest {
  name: string;
  brackets: [
    {
      name: string;
      type: "singles" | "doubles";
      numPlayers: number;
    },
  ];
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
