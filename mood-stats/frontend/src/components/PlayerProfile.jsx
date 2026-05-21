import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function PlayerProfile({ playerId }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!playerId) return;

    setLoading(true);
    fetch(`/api/players/${playerId}`)
      .then((res) => res.json())
      .then((json) => setPlayer(json.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [playerId]);

  if (!playerId) return <EmptyState />;
  if (loading) return <div style={s.panel}><div style={s.empty}>Loading...</div></div>;
  if (!player) return null;

  const kd = (player.kills / player.deaths).toFixed(2);
  const kdColor = kd >= 2.5 ? "var(--green)" : kd >= 1.0 ? "var(--yellow)" : "var(--red)";

 const chartData = [
  { name: "Kills", value: player.kills, fill: "#c9a84c" },
  { name: "Deaths", value: player.deaths, fill: "#8b0000" },
];

  const daysSinceActive = Math.floor(
    (new Date() - new Date(player.last_played)) / (1000 * 60 * 60 * 24)
  );

  return (
    <div style={s.panel} className="fade-in">
      <div style={s.panelHeader}>
        <span style={s.panelTitle}>PLAYER PROFILE</span>
      </div>

      <div style={s.body}>

        {/* Username + KD hero */}
        <div style={s.hero}>
          <div style={s.username}>{player.username}</div>
          <div style={{ ...s.kd, color: kdColor }}>
            {kd}
            <span style={s.kdLabel}>K/D RATIO</span>
          </div>
        </div>

        {/* Stat cards */}
        <div style={s.statGrid}>
          <StatCard label="KILLS" value={player.kills.toLocaleString()} color="var(--accent)" />
          <StatCard label="DEATHS" value={player.deaths.toLocaleString()} color="var(--red)" />
          <StatCard label="JOINED" value={formatDate(player.joined)} color="var(--text-muted)" />
          <StatCard
            label="LAST ACTIVE"
            value={`${daysSinceActive}d ago`}
            color={daysSinceActive < 7 ? "var(--green)" : "var(--yellow)"}
          />
        </div>

        {/* Bar chart */}
        <div style={s.chartWrap}>
          <div style={s.chartTitle}>KILLS VS DEATHS</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barCategoryGap="40%">
                <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2a2415"
                vertical={false}
                />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontFamily: "Rajdhani", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontFamily: "Rajdhani", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <rect key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────

function StatCard({ label, value, color }) {
  return (
    <div style={s.statCard}>
      <div style={s.statLabel}>{label}</div>
      <div style={{ ...s.statValue, color }}>{value}</div>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={s.tooltip}>
      <div style={s.tooltipLabel}>{payload[0].payload.name}</div>
      <div style={s.tooltipValue}>{payload[0].value.toLocaleString()}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ ...s.panel, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={s.emptyState}>
        <div style={s.emptyIcon}>◈</div>
        <div style={s.emptyText}>Select a player to view their profile</div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Styles ───────────────────────────────────────

const s = {
  panel: {
    background: "var(--panel)",
    border: "1px solid var(--border)",
    borderRadius: 4,
    overflow: "hidden",
    minHeight: 400,
    boxShadow: "0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,168,76,0.05)",
  },
  panelHeader: {
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
  body: { padding: "28px 24px", display: "flex", flexDirection: "column", gap: 24 },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 20,
    borderBottom: "1px solid var(--border)",
  },
  username: {
    fontFamily: "var(--font-display)",
    fontSize: 28,
    fontWeight: 900,
    color: "var(--text)",
    letterSpacing: "0.08em",
    textShadow: "0 0 20px rgba(201,168,76,0.15)",
  },
  kd: {
    fontFamily: "var(--font-display)",
    fontSize: 36,
    fontWeight: 900,
    textAlign: "right",
    lineHeight: 1,
    textShadow: "0 0 20px currentColor",
  },
  kdLabel: {
    display: "block",
    fontSize: 7,
    color: "var(--text-muted)",
    letterSpacing: "0.2em",
    marginTop: 5,
    textAlign: "right",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  statCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 4,
    padding: "16px 18px",
  },
  statLabel: {
    fontFamily: "var(--font-display)",
    fontSize: 8,
    color: "var(--text-muted)",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  statValue: {
    fontFamily: "var(--font-display)",
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "0.05em",
  },
  chartWrap: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 4,
    padding: "18px",
  },
  chartTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 8,
    color: "var(--text-muted)",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    marginBottom: 16,
  },
  tooltip: {
    background: "var(--panel)",
    border: "1px solid var(--border)",
    borderRadius: 4,
    padding: "8px 14px",
  },
  tooltipLabel: {
    fontFamily: "var(--font-display)",
    fontSize: 9,
    color: "var(--text-muted)",
    letterSpacing: "0.15em",
    marginBottom: 4,
  },
  tooltipValue: {
    fontFamily: "var(--font-display)",
    fontSize: 18,
    fontWeight: 700,
    color: "var(--accent)",
  },
  empty: { padding: 40, textAlign: "center", color: "var(--text-muted)" },
  emptyState: { textAlign: "center" },
  emptyIcon: { fontSize: 32, color: "var(--text-dim)", marginBottom: 12 },
  emptyText: {
    color: "var(--text-muted)",
    fontFamily: "var(--font-display)",
    fontSize: 12,
    letterSpacing: "0.1em",
  },
};