import { v4 as uuidv4 } from "uuid";

export interface User {
    id: string;
    username: string;
    passwordHash: string;
    email?: string;
    tournaments: Tournament[];
}

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
    id: string;
    name: string;
    createdAt: Date;
    brackets: Bracket[];
    ownerId: string; // references User.id
    lastModifiedBy?: string; // Used to identify who last modified this tournament
    lastUpdatedAt?: Date;
}

export function createPlayer(name: string, seed: number): Player {
    return { id: uuidv4(), name, seed };
}

export function createBracket(
    name: string,
    type: "singles" | "doubles" = "singles",
): Bracket {
    return {
        name,
        type,
        players: [],
        matches: [],
    };
}

export function createTournament(name: string, ownerId: string): Tournament {
    return {
        id: uuidv4(),
        name,
        createdAt: new Date(),
        brackets: [],
        ownerId,
    };
}

export function generateSeededFirstRound(bracket: Bracket): Match[] {
    // Filter out empty players (seed -1 indicates empty slot)
    const activePlayers = bracket.players.filter((p) => p.seed >= 0);

    // Sort players by seed number
    const sortedPlayers = activePlayers.sort((a, b) => a.seed - b.seed);

    const matches: Match[] = [];

    // Pair seed 1 with highest seed, seed 2 with second-highest, etc.
    for (let i = 0; i < sortedPlayers.length; i += 2) {
        const player1 = sortedPlayers[i];
        const player2 = sortedPlayers[sortedPlayers.length - 1 - i];

        // Avoid pairing same player if odd number of players
        if (player1.id === player2.id) {
            matches.push({
                id: uuidv4(),
                player1Id: player1.id,
                player2Id: null,
                winnerId: null,
                score: null,
                status: "pending",
            });
        } else {
            matches.push({
                id: uuidv4(),
                player1Id: player1.id,
                player2Id: player2.id,
                winnerId: null,
                score: null,
                status: "pending",
            });
        }
    }

    return matches;
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
                player2Id: playerMatches[i + 1]
                    ? playerMatches[i + 1].id
                    : null,
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
