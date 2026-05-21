import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { resolve } from "path";

const app = express();
const port = 4000;

// Read data from the project root inside the container (/app/data.json).
const dataPath = resolve(process.cwd(), "data.json");
const { players } = JSON.parse(readFileSync(dataPath, "utf-8"));

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("Server is healthy");
});

app.get("/api/players", (req, res) => {
  res.json({ data: players });
});

app.get("/api/players/:id", (req, res) => {
  const player = players.find((p) => p.id === Number(req.params.id));

  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  return res.json({ data: player });
});

app.get("/api/leaderboard", (req, res) => {
  const ranked = [...players]
    .map((p) => ({
      ...p,
      kd: (p.kills / p.deaths).toFixed(2),
    }))
    .sort((a, b) => Number(b.kd) - Number(a.kd));

  res.json({ data: ranked });
});

app.listen(port, () => {
  console.log(`Mood Stats API Server is running on http://localhost:${port}`);
});
