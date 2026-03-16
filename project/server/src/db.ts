import Datastore from "nestdb";
import { Tournament, createPlayer } from "./dbSchema";

export const db = new Datastore({ filename: "project.db", autoload: true });

/**
 * Add players to a bracket in a tournament.
 * Returns a Promise resolving to updated tournament or error.
 */
export function addPlayersToTournament(
    tournamentName: string,
    bracketName: string,
    players: { playerName: string; playerIndex: number; playerSeed: number }[],
): Promise<{ tournament?: Tournament; error?: string }> {
    return new Promise((resolve) => {
        // Find the tournament by name
        db.find({ name: tournamentName }).exec(
            (err: Error | null, matches: Tournament[]) => {
                if (err) {
                    // Database error
                    resolve({ error: "Error querying tournament" });
                    return;
                }

                if (matches.length === 0) {
                    // Tournament not found
                    resolve({ error: "Tournament not found" });
                    return;
                }

                const tournament = matches[0];

                // Find the bracket by name
                const bracket = tournament.brackets.find(
                    (b) => b.name === bracketName,
                );
                if (!bracket) {
                    resolve({ error: "Bracket not found" });
                    return;
                }

                // Add each player at the specified index
                for (const { playerName, playerIndex, playerSeed } of players) {
                    if (
                        playerIndex < 0 ||
                        playerIndex >= bracket.players.length
                    ) {
                        resolve({
                            error: `Player index ${playerIndex} out of range`,
                        });
                        return;
                    }
                    bracket.players[playerIndex] = createPlayer(
                        playerName,
                        playerSeed,
                    );
                }

                // Save updated tournament to database
                db.update(
                    { name: tournamentName },
                    tournament,
                    {},
                    (updateErr: Error | null) => {
                        if (updateErr) {
                            resolve({ error: "Error updating tournament" });
                            return;
                        }

                        resolve({ tournament });
                    },
                );
            },
        );
    });
}

/**
 * Remove players from a bracket in a tournament.
 * Returns a Promise resolving to updated tournament or error.
 */
export function removePlayersFromTournament(
    tournamentName: string,
    bracketName: string,
    players: { playerName: string; playerIndex: number }[],
): Promise<{ tournament?: Tournament; error?: string }> {
    return new Promise((resolve) => {
        // Find the tournament by name
        db.find({ name: tournamentName }).exec(
            (err: Error | null, matches: Tournament[]) => {
                if (err) {
                    // Database error
                    resolve({ error: "Error querying tournament" });
                    return;
                }

                if (matches.length === 0) {
                    // Tournament not found
                    resolve({ error: "Tournament not found" });
                    return;
                }

                const tournament = matches[0];

                // Find the bracket by name
                const bracket = tournament.brackets.find(
                    (b) => b.name === bracketName,
                );
                if (!bracket) {
                    resolve({ error: "Bracket not found" });
                    return;
                }

                // Clear each specified player slot
                for (const { playerName, playerIndex } of players) {
                    if (
                        playerIndex < 0 ||
                        playerIndex >= bracket.players.length
                    ) {
                        resolve({
                            error: `Player index ${playerIndex} out of range`,
                        });
                        return;
                    }

                    // Verify the player name matches before removing
                    if (bracket.players[playerIndex].name !== playerName) {
                        resolve({
                            error: `Player name does not match at index ${playerIndex}`,
                        });
                        return;
                    }

                    bracket.players[playerIndex] = createPlayer("", -1);
                }

                // Save updated tournament to database
                db.update(
                    { name: tournamentName },
                    tournament,
                    {},
                    (updateErr: Error | null) => {
                        if (updateErr) {
                            resolve({ error: "Error updating tournament" });
                            return;
                        }

                        resolve({ tournament });
                    },
                );
            },
        );
    });
}

// Find user by username
export function findUserByUsername(username: string): Promise<any> {
    return new Promise((resolve) => {
        db.find({ username }).exec((err, matches) => {
            if (err) resolve(null);
            else resolve(matches[0] || null);
        });
    });
}

// Create new user
export function createUser(user: any): Promise<any> {
    return new Promise((resolve) => {
        db.insert(user, (err, newUser) => {
            if (err) resolve(null);
            else resolve(newUser);
        });
    });
}
