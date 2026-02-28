export interface CreateTournamentRequest {
  name: string;
  brackets: [{ type: "singles" | "doubles"; numPlayers: number }];
}
