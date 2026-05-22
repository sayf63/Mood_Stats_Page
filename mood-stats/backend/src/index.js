import express from "express";
import cors from "cors";
import pool from "./db/pool.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "Mood Stats API" });
});

// GET /api/players — all players
app.get("/api/players", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM players ORDER BY id"
    );
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

// GET /api/players/:id — single player
app.get("/api/players/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM players WHERE id = $1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch player" });
  }
});

// GET /api/leaderboard — sorted by K/D ratio
app.get("/api/leaderboard", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT *,
        ROUND(kills::numeric / NULLIF(deaths, 0), 2) AS kd
      FROM players
      ORDER BY kd DESC NULLS LAST
    `);
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

app.listen(PORT, () => {
  console.log(`Mood Stats API running on http://localhost:${PORT}`);
});