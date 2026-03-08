import express, { Request, Response } from "express";
import {
  validateTournamentCreationRequest,
  validateBulkPlayerRequest,
} from "./validation";
import { BulkPlayerRequest, CreateTournamentRequest } from "./apiSchema";
import {
  createBracket,
  createPlayer,
  createTournament,
  Tournament,
} from "./dbSchema";
import { db } from "./db";

// Serve static files from client build directory
const root = "../client/build/";

// Listen on specified port
const app = express();
const port = 3000;

app.listen(port, () => console.log(`Listening on port: ${port}`));

// Middleware
app.use(express.static(root));
app.use(express.json());

// ====== PAGE ROUTES ======

app.get("/", (req: Request, res: Response) => {
  res.sendFile("./index.html", { root });
});

app.get("/about", (req: Request, res: Response) => {
  res.sendFile("./about.html", { root });
});

app.get("/select-tournament", (req: Request, res: Response) => {
  res.sendFile("./select-tournament.html", { root });
});

app.get("/manage-tournament", (req: Request, res: Response) => {
  res.sendFile("./manage-tournament.html", { root });
});

// ====== API ROUTES ======

app.post("/api/create-tournament", (req: Request, res: Response) => {
  // Validate request body
  const isValid = validateTournamentCreationRequest(req.body);
  if (!isValid) {
    res.status(400).json({ error: "Invalid tournament creation request" });
    return;
  }

  // Build tournament and bracket objects from request
  const { name, brackets } = req.body as CreateTournamentRequest;
  const tournament = createTournament(name);
  tournament.brackets = brackets.map((b) => {
    const tmpBracket = createBracket(b.name, b.type);
    tmpBracket.players = Array(b.numPlayers).fill(createPlayer("", -1));
    return tmpBracket;
  });

  // Insert tournament into database
  db.insert(tournament, (err) => {
    if (err) console.error("Error inserting tournament into database:", err);
  });
  console.log("Created tournament:", tournament);

  // Return created tournament
  res
    .status(200)
    .json({ message: "Tournament created successfully", tournament });
});

app.get("/api/get-tournaments", (req: Request, res: Response) => {
  const tournaments = db.getAllData() as Tournament[];
  if (!tournaments || tournaments.length === 0) {
    res.status(200).json({ tournaments: [] });
    return;
  }

  const listItems = tournaments.map((t) => ({
    value: t.name,
    name: t.name,
  }));
  res.status(200).json({ tournaments: listItems });
});

app.get("/api/tournament-data", (req: Request, res: Response) => {
  // Make sure query parameter is provided
  const tournamentName = req.query.tournament;
  if (!tournamentName) {
    res.status(400).json({ error: "Missing tournamentName query parameter" });
    return;
  }

  // Query tournament data from database
  db.find({ name: tournamentName }).exec((err, matches) => {
    if (err) console.error("Error querying tournament from database:", err);

    if (matches.length === 0) {
      res.status(404).json({ error: "Tournament not found" });
    } else {
      res.status(200).json({ tournament: matches[0] });
    }
  });
});

app.put("/api/add-players", (req: Request, res: Response) => {
  // Validate request body
  if (!validateBulkPlayerRequest(req.body)) {
    res.status(400).json({ error: "Missing or invalid fields" });
    return;
  }

  const { tournamentName, bracketName, players } =
    req.body as BulkPlayerRequest;

  // Find the tournament by name
  db.find({ name: tournamentName }).exec(
    (err: Error | null, matches: Tournament[]) => {
      if (err) {
        console.error("Error querying tournament:", err);
        return;
      }
      if (matches.length === 0) {
        res.status(404).json({ error: "Tournament not found" });
        return;
      }

      // Find the bracket by name
      const tournament = matches[0];
      const bracket = tournament.brackets.find((b) => b.name === bracketName);
      if (!bracket) {
        res.status(404).json({ error: "Bracket not found" });
        return;
      }

      // Add each player at the specified index
      for (const { playerName, playerIndex, playerSeed } of players) {
        if (playerIndex < 0 || playerIndex >= bracket.players.length) {
          res
            .status(400)
            .json({ error: `Player index ${playerIndex} out of range` });
          return;
        }
        bracket.players[playerIndex] = createPlayer(playerName, playerSeed);
      }

      // Save updated tournament to database
      db.update(
        { name: tournamentName },
        tournament,
        {},
        (updateErr: Error | null) => {
          if (updateErr) {
            console.error("Error updating tournament:", updateErr);
            return;
          }
          res
            .status(200)
            .json({ message: "Players added successfully", tournament });
        },
      );
    },
  );
});

app.delete("/api/remove-players", (req: Request, res: Response) => {
  // Validate request body
  if (!validateBulkPlayerRequest(req.body)) {
    res.status(400).json({ error: "Missing or invalid fields" });
    return;
  }

  const { tournamentName, bracketName, players } =
    req.body as BulkPlayerRequest;

  // Find the tournament by name
  db.find({ name: tournamentName }).exec(
    (err: Error | null, matches: Tournament[]) => {
      if (err) {
        console.error("Error querying tournament:", err);
        return;
      }
      if (matches.length === 0) {
        res.status(404).json({ error: "Tournament not found" });
        return;
      }

      // Find the bracket by name
      const tournament = matches[0];
      const bracket = tournament.brackets.find((b) => b.name === bracketName);
      if (!bracket) {
        res.status(404).json({ error: "Bracket not found" });
        return;
      }

      // Clear each specified player slot
      for (const { playerName, playerIndex } of players) {
        if (playerIndex < 0 || playerIndex >= bracket.players.length) {
          res
            .status(400)
            .json({ error: `Player index ${playerIndex} out of range` });
          return;
        }

        // Verify the player name matches before removing
        if (bracket.players[playerIndex].name !== playerName) {
          res.status(400).json({
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
            console.error("Error updating tournament:", updateErr);
            return;
          }
          res
            .status(200)
            .json({ message: "Players removed successfully", tournament });
        },
      );
    },
  );
});
