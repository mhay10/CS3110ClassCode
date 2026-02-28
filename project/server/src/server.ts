import express, { Request, Response } from "express";
import { db } from "./db.js";

// Listen on specified port
const app = express();
const port = 3000;

app.listen(port, () => console.log(`Listening on port: ${port}`));

// Middleware
app.use(express.static("../client/build/"));
app.use(express.json());

// Page Routes
app.get("/", (request: Request, response: Response) => {
  response.sendFile("index.html");
});

app.get("/about", (request: Request, response: Response) => {
  response.sendFile("about.html");
});

// API Routes

app.get("/api/get-tournaments", (request: Request, response: Response) => {});

app.post(
  "/api/create-tournament",
  (request: Request, response: Response) => {},
);

// Placeholder routes for future CRUD operations
app.put("/api/update", (_req: Request, _res: Response) => {});
app.delete("/api/delete", (_req: Request, _res: Response) => {});
