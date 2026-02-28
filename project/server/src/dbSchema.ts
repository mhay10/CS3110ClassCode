import { v4 as uuidv4 } from "uuid";

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
  id: string;
  type: "singles" | "doubles";
  status: string;
  players: Player[];
  matches: Match[];
  rounds?: Round[];
}

export interface Tournament {
  name: string;
  createdAt: Date;
  status: string;
  brackets: Bracket[];
}

export function createPlayer(name: string, seed: number): Player {
  return { id: uuidv4(), name, seed };
}

export function createBracket(
  type: "singles" | "doubles" = "singles",
): Bracket {
  return {
    id: uuidv4(),
    type,
    status: "pending",
    players: [],
    matches: [],
  };
}

export function generateMatchRounds(bracket: Bracket): Bracket {
  const players = Array.from(bracket.players);
  const numRounds = Math.ceil(Math.log2(players.length));
  const rounds: Round[] = [];

  let playerMatches: Player[] = [];
  for (let i = 0; i < players.length; i++) {
    playerMatches.push(players[i], players[players.length - 1 - i]);
  }

  for (let round = 0; round < numRounds; round++) {
    const matches: Match[] = [];
    for (let i = 0; i < playerMatches.length; i += 2) {
      matches.push({
        id: uuidv4(),
        player1Id: playerMatches[i] ? playerMatches[i].id : null,
        player2Id: playerMatches[i + 1] ? playerMatches[i + 1].id : null,
        winnerId: null,
        score: null,
        status: "pending",
      });
    }
    rounds.push({ round: round + 1, matches });
    // use a loose cast for placeholder since real Player objects will be filled later
    playerMatches = matches.map(
      () => ({ id: null, name: "", seed: 0 }) as unknown as Player,
    );
  }

  bracket.rounds = rounds;
  return bracket;
}

export function createTournamentObj(name: string): Tournament {
  return {
    name,
    createdAt: new Date(),
    status: "upcoming",
    brackets: [],
  };
}
