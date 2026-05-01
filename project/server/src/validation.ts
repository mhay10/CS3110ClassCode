import {
    BulkPlayerRequest,
    CreateTournamentRequest,
    UpdateScoresRequest,
} from "./apiSchema";

export function validateTournamentCreationRequest(data: any) {
    const hasValidName =
        data && typeof data.name === "string" && data.name.trim().length > 0;
    const hasValidBrackets =
        data &&
        Array.isArray(data.brackets) &&
        data.brackets.every(
            (b: any) =>
                (b.type === "singles" || b.type === "doubles") &&
                typeof b.numPlayers === "number",
        );

    return hasValidName && hasValidBrackets;
}

export function validateBulkPlayerRequest(
    data: any,
): data is BulkPlayerRequest {
    return (
        data &&
        typeof data.tournamentName === "string" &&
        data.tournamentName.trim().length > 0 &&
        typeof data.bracketName === "string" &&
        data.bracketName.trim().length > 0 &&
        Array.isArray(data.players) &&
        data.players.every(
            (p: any) =>
                typeof p.playerName === "string" &&
                typeof p.playerIndex === "number" &&
                typeof p.playerSeed === "number",
        )
    );
}

export function validateUpdateScoresRequest(
    data: any,
): data is UpdateScoresRequest {
    return (
        data &&
        typeof data.tournamentName === "string" &&
        data.tournamentName.trim().length > 0 &&
        typeof data.bracketName === "string" &&
        data.bracketName.trim().length > 0 &&
        Array.isArray(data.scores) &&
        data.scores.every(
            (s: any) =>
                typeof s.matchId === "string" &&
                s.score &&
                typeof s.score.p1 === "string" &&
                typeof s.score.p2 === "string",
        )
    );
}

// Validate login input
export function validateLoginInput(data: any) {
    return (
        data &&
        typeof data.username === "string" &&
        data.username.trim().length > 0 &&
        typeof data.password === "string" &&
        data.password.length >= 4
    );
}

// Validate account creation input
export function validateAccountInput(data: any) {
    return (
        data &&
        typeof data.username === "string" &&
        data.username.trim().length > 0 &&
        typeof data.email === "string" &&
        data.email.includes("@") &&
        typeof data.password === "string" &&
        data.password.length >= 4
    );
}
