import { CreateTournamentRequest } from "./apiSchema";

export function validateTournamentCreationRequest(data: any) {
  console.log("Validating tournament creation request:", data);

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