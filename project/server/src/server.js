const express = require("express");

// Listen on specified port
const app = express();
const port = 3000;

app.listen(port, () => console.log("Listening on port: " + port));

// Middleware
app.use(express.static("../client/build/"));
app.use(express.json());

// Page Routes
app.get("/", (request, response) => {
  response.sendFile("index.html");
});

app.get("/about", (request, response) => {
  response.sendFile("about.html");
});

// API Routes
app.post("/api/echo", (request, response) => {
  console.log("Received data: ", request.body);
  response.json({ message: "Data received successfully!", data: request.body });
});

// Placeholder routes for future CRUD operations
app.put("/api/update", () => {});
app.delete("/api/delete", () => {});
