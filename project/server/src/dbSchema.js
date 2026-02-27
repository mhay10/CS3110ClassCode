const { v4: uuidv4 } = require("uuid");

/**
 * Create new player object
 * For doubles, enter name as "Player1 / Player2"
 * @param {string} name
 * @param {number} seed
 */
function createPlayer(name, seed) {
  return { id: uuidv4(), name, seed };
}

/**
 * Create new bracket object
 * @param {"singles"|"doubles"} type
 */
function createBracket(type = "singles") {
  return {
    id: uuidv4(),
    type,
    status: "pending",
    players: [],
    matches: [],
  };
}

/**
 * Generate match rounds based on player count
 * @param {Object} bracket
 */
function generateMatchRounds(bracket) {
  // Get players and calculate number of rounds needed
  const players = Array.from(bracket.players);
  const numRounds = Math.ceil(Math.log2(players.length));
  const rounds = [];

  // Sort players for correct seed matchups (1 vs 8, 2 vs 7, etc.)
  let playerMatches = [];
  for (let i = 0; i < players.length; i++) {
    playerMatches.push(players[i], players[players.length - 1 - i]);
  }

  // Create rounds and matches
  for (let round = 0; round < numRounds; round++) {
    // Create matches for this round
    const matches = [];
    for (let i = 0; i < matchPlayers.length; i += 2) {
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

    // Next round slots empty until winners are determined
    playerMatches = matches.map(() => ({ id: null }));
  }

  // Add rounds to bracket
  bracket.rounds = rounds;
  return bracket;
}

/**
 * Create a new tournament object
 * @param {string} name
 */
function createTournament(name) {
  return {
    name,
    createdAt: new Date(),
    status: "upcoming",
    brackets: [],
  };
}

// Export functions for use in other modules
module.exports = {
  createTournament,
  createBracket,
  createPlayer,
  generateMatchRounds,
};
