import { useState } from "react";

const s = {
  page: { minHeight: "100vh", background: "#0f1a12", color: "#e8e4dc", fontFamily: "var(--sans)", padding: "0 0 60px" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: "1px solid #1e2e22" },
  logo: { fontFamily: "var(--serif)", fontSize: 15, fontWeight: 900, color: "#E85C3A" },
  login: { maxWidth: 400, margin: "120px auto 0", textAlign: "center", padding: "0 24px" },
  card: { background: "#131e16", border: "1px solid #1e2e22", borderRadius: 16, padding: 28 },
  input: { width: "100%", background: "#0d150f", border: "1px solid #2a3a2e", borderRadius: 10, padding: "12px 16px", color: "#e8e4dc", fontFamily: "var(--sans)", fontSize: 14, outline: "none", marginBottom: 14 },
  btn: { width: "100%", background: "#E85C3A", color: "#fff", border: "none", padding: "14px 0", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, padding: "32px 32px 0" },
  statCard: { background: "#131e16", border: "1px solid #1e2e22", borderRadius: 14, padding: "24px 20px" },
  statVal: { fontFamily: "var(--serif)", fontSize: 40, fontWeight: 900, lineHeight: 1 },
  statLabel: { fontSize: 12, color: "#6b8070", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 6 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#6b8070", borderBottom: "1px solid #1e2e22" },
  td: { padding: "12px 16px", borderBottom: "1px solid #0f1a12" },
};

export default function Admin() {
  const [token, setToken] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const login = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const d = await res.json();
      if (d.error) { setErr(d.error); setLoading(false); return; }
      setStats(d);
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  const refresh = () => { setStats(null); login(); };

  if (!stats) return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.logo}>VERTICAL STUDIO · ADMIN</span>
      </nav>
      <div style={s.login}>
        <div style={s.card}>
          <p style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Dashboard Admin</p>
          <p style={{ fontSize: 13, color: "#6b8070", marginBottom: 24 }}>Accès réservé</p>
          <input
            type="password"
            placeholder="Token administrateur"
            value={token}
            onChange={e => setToken(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={s.input}
          />
          {err && <p style={{ color: "#E85C3A", fontSize: 13, marginBottom: 12 }}>{err}</p>}
          <button onClick={login} disabled={loading} style={{ ...s.btn, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Chargement…" : "Accéder →"}
          </button>
        </div>
      </div>
    </div>
  );

  const mrrColor = stats.mrr > 500 ? "#4ade80" : stats.mrr > 100 ? "#facc15" : "#E85C3A";

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.logo}>VERTICAL STUDIO · ADMIN</span>
        <button onClick={refresh} style={{ background: "none", border: "1px solid #2a3a2e", color: "#6b8070", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: "var(--sans)" }}>
          ↻ Actualiser
        </button>
      </nav>

      {/* Stat cards */}
      <div style={s.grid}>
        {[
          { val: stats.total, label: "Abonnés actifs", color: "#fff" },
          { val: stats.standard, label: "Plan Standard", color: "#E85C3A" },
          { val: stats.premium, label: "Plan Premium", color: "#4e7e5a" },
          { val: `${stats.mrr.toFixed(0)} €`, label: "MRR estimé", color: mrrColor },
        ].map(({ val, label, color }) => (
          <div key={label} style={s.statCard}>
            <div style={{ ...s.statVal, color }}>{val}</div>
            <div style={s.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Table abonnés */}
      <div style={{ margin: "28px 32px 0" }}>
        <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #1e2e22" }}>
            <p style={{ fontWeight: 700, fontSize: 14 }}>Abonnés récents</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Plan</th>
                  <th style={s.th}>Montant</th>
                  <th style={s.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {(stats.abonnes || []).map((a, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                    <td style={s.td}>{a.email}</td>
                    <td style={s.td}>
                      <span style={{ background: a.plan === "premium" ? "#1a2e22" : "#2a1a12", color: a.plan === "premium" ? "#4ade80" : "#E85C3A", padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                        {a.plan === "premium" ? "🎭 Premium" : "⚡ Standard"}
                      </span>
                    </td>
                    <td style={s.td}>{a.montant.toFixed(2)} {a.currency?.toUpperCase()}</td>
                    <td style={{ ...s.td, color: "#6b8070" }}>{new Date(a.createdAt * 1000).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
