import { BulkPlayerRequest, CreateTournamentRequest } from "./apiSchema";

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
