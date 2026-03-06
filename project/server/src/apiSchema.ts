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
