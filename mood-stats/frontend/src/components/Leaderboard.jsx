import { useState, useEffect } from "react";

export default function Leaderboard({ onSelect, selectedId }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((json) => setPlayers(json.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getKdColor = (kd) => {
    if (kd >= 2.5) return "var(--green)";
    if (kd >= 1.0) return "var(--yellow)";
    return "var(--red)";
  };

  return (
    <div style={s.panel}>
      <div style={s.panelHeader}>
        <span style={s.panelTitle}>LEADERBOARD</span>
        <span style={s.count}>{players.length} PLAYERS</span>
      </div>

      {loading ? (
        <div style={s.empty}>Loading...</div>
      ) : (
        <div style={s.list}>
          {players.map((player, index) => (
            <div
              key={player.id}
              style={{
                ...s.row,
                ...(selectedId === player.id ? s.rowActive : {}),
              }}
              onClick={() => onSelect(player.id)}
            >
              <span style={s.rank}>#{index + 1}</span>

              <div style={s.info}>
                <div style={s.username}>{player.username}</div>
                <div style={s.meta}>
                  {player.kills.toLocaleString()} K &nbsp;·&nbsp;{" "}
                  {player.deaths.toLocaleString()} D
                </div>
              </div>

              <div style={{ ...s.kd, color: getKdColor(parseFloat(player.kd)) }}>
                {player.kd}
                <span style={s.kdLabel}>K/D</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  panel: {
    background: "var(--panel)",
    border: "1px solid var(--border)",
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,168,76,0.05)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 20px",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
  },
  panelTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 11,
    color: "var(--accent)",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
  },
  count: {
    fontFamily: "var(--font-display)",
    fontSize: 9,
    color: "var(--text-muted)",
    letterSpacing: "0.15em",
  },
  list: { display: "flex", flexDirection: "column" },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "13px 20px",
    borderBottom: "1px solid var(--border)",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  rowActive: {
    background: "rgba(201,168,76,0.06)",
    borderLeft: "2px solid var(--accent)",
    paddingLeft: 18,
  },
  rank: {
    fontFamily: "var(--font-display)",
    fontSize: 10,
    color: "var(--text-dim)",
    width: 28,
    flexShrink: 0,
  },
  info: { flex: 1 },
  username: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: "var(--text)",
    marginBottom: 3,
    letterSpacing: "0.05em",
  },
  meta: {
    fontSize: 12,
    color: "var(--text-muted)",
    letterSpacing: "0.05em",
  },
  kd: {
    fontFamily: "var(--font-display)",
    fontSize: 20,
    fontWeight: 900,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    lineHeight: 1,
  },
  kdLabel: {
    fontSize: 7,
    color: "var(--text-muted)",
    letterSpacing: "0.2em",
    marginTop: 4,
  },
  empty: {
    padding: 40,
    textAlign: "center",
    color: "var(--text-muted)",
    fontFamily: "var(--font-display)",
    fontSize: 12,
    letterSpacing: "0.1em",
  },
};