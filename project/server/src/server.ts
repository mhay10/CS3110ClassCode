import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import sha from "sha.js";
import { v4 as uuidv4 } from "uuid";
import { validateLoginInput, validateAccountInput } from "./validation";
import { findUserByUsername, createUser } from "./db";
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
import {
    addPlayersToTournament,
    removePlayersFromTournament,
    updateTournamentName,
    deleteTournament,
} from "./db";

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

app.get("/login", (req: Request, res: Response) => {
    res.sendFile("./login.html", { root });
});

// ====== API ROUTES ======

const SECRET = "publicly available secret key bc i like sharing";

app.post("/api/login", async (req: Request, res: Response) => {
    // Validate input
    const { username, password } = req.body;
    if (!validateLoginInput(req.body)) {
        res.status(400).json({ error: "Invalid input" });
        return;
    }
    // Find user
    const user = await findUserByUsername(username);
    if (!user) {
        res.status(401).json({ error: "User not found" });
        return;
    }
    // Check password (simple hash demo)
    const hash = sha("sha256").update(password).digest("hex");
    if (user.passwordHash !== hash) {
        res.status(401).json({ error: "Incorrect password" });
        return;
    }
    // Issue JWT
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET);
    res.status(200).json({ token });
});

app.post("/api/logout", (req: Request, res: Response) => {
    // Client clears token
    res.status(200).json({ message: "Logged out" });
});

app.post("/api/create-account", async (req: Request, res: Response) => {
    // Validate input
    const { username, email, password } = req.body;
    if (!validateAccountInput(req.body)) {
        res.status(400).json({ error: "Invalid input" });
        return;
    }
    // Check if user exists
    const existing = await findUserByUsername(username);
    if (existing) {
        res.status(400).json({ error: "Username taken" });
        return;
    }
    // Hash password
    const hash = sha("sha256").update(password).digest("hex");
    // Create user
    const user = {
        id: uuidv4(),
        username,
        email,
        passwordHash: hash,
        tournaments: [],
    };
    const newUser = await createUser(user);
    if (!newUser) {
        res.status(500).json({ error: "Error creating user" });
        return;
    }
    // Issue JWT
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET);
    res.status(200).json({ token });
});

app.post("/api/create-tournament", (req: Request, res: Response) => {
    // Verify user authentication
    const auth = req.headers.authorization;
    if (!auth) {
        res.status(401).json({ error: "No token" });
        return;
    }
    try {
        const decoded = jwt.verify(auth.split(" ")[1], SECRET) as {
            id: string;
            username: string;
        };
        const userId = decoded.id;

        // Validate request body
        const isValid = validateTournamentCreationRequest(req.body);
        if (!isValid) {
            res.status(400).json({
                error: "Invalid tournament creation request",
            });
            return;
        }

        // Build tournament and bracket objects from request
        const { name, brackets } = req.body as CreateTournamentRequest;
        const tournament = createTournament(name, userId);
        tournament.brackets = brackets.map((b) => {
            const tmpBracket = createBracket(b.name, b.type);
            tmpBracket.players = Array(b.numPlayers).fill(createPlayer("", -1));
            return tmpBracket;
        });

        // Insert tournament into database
        db.insert(tournament, (err) => {
            if (err)
                console.error("Error inserting tournament into database:", err);
        });
        console.log("Created tournament:", tournament);

        // Return created tournament
        res.status(200).json({
            message: "Tournament created successfully",
            tournament,
        });
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
});

app.get("/api/get-tournaments", (req: Request, res: Response) => {
    // Verify user authentication
    const auth = req.headers.authorization;
    if (!auth) {
        res.status(401).json({ error: "No token" });
        return;
    }
    try {
        // Decode token to get user ID
        const decoded = jwt.verify(auth.split(" ")[1], SECRET) as {
            id: string;
            username: string;
        };
        const userId = decoded.id;

        // Get all tournaments and filter by owner
        const tournaments = db.getAllData() as Tournament[];
        if (!tournaments || tournaments.length === 0) {
            res.status(200).json({ tournaments: [] });
            return;
        }

        // Filter tournaments owned by user and return list
        const userTournaments = tournaments.filter((t) => t.ownerId === userId);
        const listItems = userTournaments
            .map((t) => ({
                value: t.name,
                name: t.name,
            }))
            .filter((t) => t.value && t.name); // Filter out invalid entries
        res.status(200).json({ tournaments: listItems });
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
});

app.get("/api/user", (req: Request, res: Response) => {
    const auth = req.headers.authorization;
    if (!auth) {
        res.status(401).json({ error: "No token" });
        return;
    }
    try {
        const decoded = jwt.verify(auth.split(" ")[1], SECRET);
        res.status(200).json({ user: decoded });
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
});

app.get("/api/tournament-data", (req: Request, res: Response) => {
    // Make sure query parameter is provided
    const tournamentName = req.query.tournament;
    if (!tournamentName) {
        res.status(400).json({
            error: "Missing tournamentName query parameter",
        });
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

app.put("/api/add-players", async (req: Request, res: Response) => {
    // Validate request body
    if (!validateBulkPlayerRequest(req.body)) {
        res.status(400).json({ error: "Missing or invalid fields" });
        return;
    }
    const { tournamentName, bracketName, players } =
        req.body as BulkPlayerRequest;

    // Get result of db operation
    const result = await addPlayersToTournament(
        tournamentName,
        bracketName,
        players,
    );

    // Handle errors and return response
    if (result.error) {
        if (result.error.includes("not found")) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(400).json({ error: result.error });
        }
        return;
    }
    res.status(200).json({
        message: "Players added successfully",
        tournament: result.tournament,
    });
});

app.delete("/api/remove-players", async (req: Request, res: Response) => {
    // Validate request body
    if (!validateBulkPlayerRequest(req.body)) {
        res.status(400).json({ error: "Missing or invalid fields" });
        return;
    }
    const { tournamentName, bracketName, players } =
        req.body as BulkPlayerRequest;

    // Get result of db operation
    const result = await removePlayersFromTournament(
        tournamentName,
        bracketName,
        players,
    );

    // Handle errors and return response
    if (result.error) {
        if (result.error.includes("not found")) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(400).json({ error: result.error });
        }
        return;
    }
    res.status(200).json({
        message: "Players removed successfully",
        tournament: result.tournament,
    });
});

app.put("/api/update-tournament", async (req: Request, res: Response) => {
    // Validate request body
    if (!req.body.oldName || !req.body.newName) {
        res.status(400).json({ error: "Missing oldName or newName" });
        return;
    }
    const { oldName, newName } = req.body;

    // Get result of db operation
    const result = await updateTournamentName(oldName, newName);

    // Handle errors and return response
    if (result.error) {
        if (result.error.includes("not found")) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(400).json({ error: result.error });
        }
        return;
    }
    res.status(200).json({
        message: "Tournament updated successfully",
        tournament: result.tournament,
    });
});

app.delete("/api/delete-tournament", async (req: Request, res: Response) => {
    // Validate request body
    if (!req.body.tournamentName) {
        res.status(400).json({ error: "Missing tournamentName" });
        return;
    }
    const { tournamentName } = req.body;

    // Get result of db operation
    const result = await deleteTournament(tournamentName);

    // Handle errors and return response
    if (result.error) {
        if (result.error.includes("not found")) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(400).json({ error: result.error });
        }
        return;
    }
    res.status(200).json({
        message: "Tournament deleted successfully",
    });
});
