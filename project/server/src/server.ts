import express, { Request, Response } from "express";
import { db } from "./db.js";
import { validateTournamentCreationRequest } from "./validation";

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
  const isValid = validateTournamentCreationRequest(req.body);
  if (!isValid) {
    res.status(400).json({ error: "Invalid tournament creation request" });
    return;
  }

  res.send("Balls itch");
});

app.get("/api/get-tournaments", (req: Request, res: Response) => {
  res.json({
    tournaments: [
      { value: "tourney1", name: "Tournament 1" },
      { value: "tourney2", name: "Tournament 2" },
    ],
  });
});

// Placeholder routes for future CRUD operations
app.put("/api/update", (req: Request, res: Response) => {});
app.delete("/api/delete", (req: Request, res: Response) => {});
