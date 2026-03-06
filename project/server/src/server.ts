import express, { Request, Response } from "express";
import { validateTournamentCreationRequest } from "./validation";
import { CreateTournamentRequest } from "./apiSchema";
import { createBracket, createTournament, Tournament } from "./dbSchema";
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

// ====== API ROUTES ======

app.post("/api/create-tournament", (req: Request, res: Response) => {
  // Validate request body
  const isValid = validateTournamentCreationRequest(req.body);
  if (!isValid) {
    res.status(400).json({ error: "Invalid tournament creation request" });
    return;
  }

  // Insert tournament into database
  const { name, brackets } = req.body as CreateTournamentRequest;
  const tournament = createTournament(name);
  tournament.brackets = brackets.map((b) => {
    const tmpBracket = createBracket(b.name, b.type);
    tmpBracket.players = Array(b.numPlayers).fill(null);
    return tmpBracket;
  });

  db.insert(tournament, (err) => {
    if (err) console.error("Error inserting tournament into database:", err);
  });
  console.log("Created tournament:", tournament);

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

// Placeholder routes for future CRUD operations
app.put("/api/update", (req: Request, res: Response) => {});
app.delete("/api/delete", (req: Request, res: Response) => {});
