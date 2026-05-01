import type {
    Bracket,
    Player,
    Match,
    Round,
} from "$lib/types/manageTournament";

function generateId() {
    return "m_" + Math.random().toString(36).slice(2, 9);
}

function nextPow2(n: number) {
    let p = 1;
    while (p < n) p *= 2;
    return p;
}

function seedOrder(n: number): number[] {
    if (n === 1) return [1];
    const prev = seedOrder(n / 2);
    const out: number[] = [];
    for (const v of prev) {
        out.push(v);
        out.push(n + 1 - v);
    }
    return out;
}

/**
 * Generate a full round tree for a bracket based on seeded players.
 * This will create placeholder matches for future rounds until the final.
 */
export function generateBracketRounds(bracket: Bracket): Round[] {
    const activePlayers = bracket.players.filter((p) => p.seed >= 0);
    if (activePlayers.length === 0) return [];

    const players = activePlayers.slice().sort((a, b) => a.seed - b.seed);
    const totalSlots = nextPow2(players.length);
    const order = seedOrder(totalSlots);

    // place players into bracket slots according to seed order
    const slots: (Player | null)[] = new Array(totalSlots).fill(null);
    for (const p of players) {
        const idx = order.indexOf(p.seed);
        if (idx >= 0 && !slots[idx]) slots[idx] = p;
    }

    // fill any remaining empty slots with remaining players sequentially
    let pi = 0;
    for (let i = 0; i < slots.length; i++) {
        if (!slots[i]) {
            while (
                pi < players.length &&
                slots.some((s) => s?.id === players[pi].id)
            )
                pi++;
            if (pi < players.length) {
                slots[i] = players[pi];
                pi++;
            }
        }
    }

    const rounds: Round[] = [];

    // first round: adjacent pairs in slots (0/1, 2/3, ...)
    const firstRoundMatches: Match[] = [];
    for (let i = 0; i < slots.length; i += 2) {
        const p1 = slots[i] ? slots[i]!.id : null;
        const p2 = slots[i + 1] ? slots[i + 1]!.id : null;
        firstRoundMatches.push({
            id: generateId(),
            player1Id: p1,
            player2Id: p2,
            winnerId: null,
            score: null,
            status: "pending",
        });
    }

    rounds.push({ round: 1, matches: firstRoundMatches });

    // subsequent rounds: placeholders that will be filled by winners
    let prevMatches = firstRoundMatches;
    while (prevMatches.length > 1) {
        const nextMatches: Match[] = [];
        for (let i = 0; i < prevMatches.length; i += 2) {
            nextMatches.push({
                id: generateId(),
                player1Id: null,
                player2Id: null,
                winnerId: null,
                score: null,
                status: "pending",
            });
        }
        rounds.push({ round: rounds.length + 1, matches: nextMatches });
        prevMatches = nextMatches;
    }

    return rounds;
}

/**
 * If the bracket already contains saved matches (usually first round), map
 * those match objects into the generated rounds so their ids/scores are preserved.
 */
export function mapExistingMatchesToRounds(
    bracket: Bracket,
    rounds: Round[],
): Round[] {
    if (!bracket.matches || bracket.matches.length === 0) return rounds;

    const existing = bracket.matches;
    if (rounds.length === 0) return rounds;

    const first = rounds[0];
    for (const genMatch of first.matches) {
        const found = existing.find((m) => {
            // match by exact player ids (order-insensitive)
            if (
                m.player1Id === genMatch.player1Id &&
                m.player2Id === genMatch.player2Id
            )
                return true;
            if (
                m.player1Id === genMatch.player2Id &&
                m.player2Id === genMatch.player1Id
            )
                return true;
            // handle single-player byes where one side is null
            if (
                m.player1Id === genMatch.player1Id &&
                m.player2Id == null &&
                genMatch.player2Id == null
            )
                return true;
            if (
                m.player2Id === genMatch.player2Id &&
                m.player1Id == null &&
                genMatch.player1Id == null
            )
                return true;
            return false;
        });

        if (found) {
            genMatch.id = found.id;
            genMatch.score = found.score;
            genMatch.winnerId = found.winnerId;
            genMatch.status = found.status;
        }
    }

    return rounds;
}
