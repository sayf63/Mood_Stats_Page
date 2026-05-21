import { useState } from "react";
import Leaderboard from "./components/Leaderboard.jsx";
import PlayerProfile from "./components/PlayerProfile.jsx";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div style={s.app}>
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logo}>
            <span style={s.logoAccent}>MOOD</span>
            <span style={s.logoSub}>PLAYER STATS</span>
          </div>
          <div style={s.live}>
            <span style={s.liveDot} />
            LIVE
          </div>
        </div>
      </header>

      <main style={s.main}>
        <div style={s.grid}>
          <Leaderboard onSelect={setSelectedId} selectedId={selectedId} />
          <PlayerProfile playerId={selectedId} />
        </div>
      </main>
    </div>
  );
}

const s = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
    padding: "0 32px",
    boxShadow: "0 2px 20px rgba(0,0,0,0.6)",
  },
  headerInner: {
    maxWidth: 1200,
    margin: "0 auto",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "baseline",
    gap: 14,
  },
  logoAccent: {
    fontFamily: "var(--font-display)",
    fontSize: 24,
    fontWeight: 900,
    color: "var(--accent)",
    letterSpacing: "0.2em",
    textShadow: "0 0 30px rgba(201,168,76,0.35)",
    animation: "flicker 8s infinite",
  },
  logoSub: {
    fontFamily: "var(--font-display)",
    fontSize: 9,
    color: "var(--text-muted)",
    letterSpacing: "0.3em",
    textTransform: "uppercase",
  },
  live: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 10,
    fontFamily: "var(--font-display)",
    color: "var(--accent)",
    letterSpacing: "0.2em",
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "var(--accent)",
    animation: "pulse 2s infinite",
    display: "inline-block",
  },
  main: {
    flex: 1,
    padding: "32px 32px",
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: 24,
    alignItems: "start",
  },
};