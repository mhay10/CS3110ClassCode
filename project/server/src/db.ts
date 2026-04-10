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
    modifiedBy?: string,
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

                if (modifiedBy) {
                    tournament.lastModifiedBy = modifiedBy;
                }
                tournament.lastUpdatedAt = new Date();
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
    modifiedBy?: string,
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

                if (modifiedBy) {
                    tournament.lastModifiedBy = modifiedBy;
                }
                tournament.lastUpdatedAt = new Date();
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
 * Update a tournament's name.
 * Returns a Promise resolving to updated tournament or error.
 */
export function updateTournamentName(
    oldName: string,
    newName: string,
    modifiedBy?: string,
): Promise<{ tournament?: Tournament; error?: string }> {
    return new Promise((resolve) => {
        // Find the tournament by old name
        db.find({ name: oldName }).exec(
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

                if (modifiedBy) {
                    tournament.lastModifiedBy = modifiedBy;
                    tournament.lastUpdatedAt = new Date();
                }
                // Update the tournament name
                tournament.name = newName;

                // Save updated tournament to database
                db.update(
                    { name: oldName },
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
 * Delete a tournament.
 * Returns a Promise resolving to success message or error.
 */
export function deleteTournament(
    tournamentName: string,
): Promise<{ success?: boolean; error?: string }> {
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

                // Remove the tournament from database
                db.remove(
                    { name: tournamentName },
                    {},
                    (removeErr: Error | null) => {
                        if (removeErr) {
                            resolve({ error: "Error deleting tournament" });
                            return;
                        }

                        resolve({ success: true });
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
