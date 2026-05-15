import { useState } from "react";

const DARK = "#0f1a12";
const CARD = "#131e16";
const BORDER = "#1e2e22";
const MUTED = "#6b8070";
const RED = "#E85C3A";

const s = {
  page: { minHeight: "100vh", background: DARK, color: "#e8e4dc", fontFamily: "var(--sans)", paddingBottom: 60 },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: `1px solid ${BORDER}` },
  card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 },
  input: { width: "100%", background: "#0d150f", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 16px", color: "#e8e4dc", fontFamily: "var(--sans)", fontSize: 14, outline: "none", marginBottom: 14 },
  btn: { width: "100%", background: RED, color: "#fff", border: "none", padding: "14px 0", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)" },
  th: { textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: MUTED, borderBottom: `1px solid ${BORDER}` },
  td: { padding: "11px 16px", borderBottom: `1px solid #0f1a12`, fontSize: 13 },
};

const LABEL = { bible: "Séries", script: "Scripts", episodes: "Épisodes", traduction: "Traductions", variations: "Variations", titres: "Titres viraux", poster: "Affiches IA" };
const COLOR = { bible: RED, script: "#4ade80", episodes: "#60a5fa", traduction: "#f59e0b", variations: "#c084fc", titres: "#fb7185", poster: "#e879f9" };

function MiniBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: BORDER, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width .3s" }} />
      </div>
      <span style={{ fontSize: 11, color: MUTED, width: 28, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function BarChart({ data, metric = "total" }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d[metric] || 0), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
      {data.map((d, i) => {
        const val = d[metric] || 0;
        const h = Math.round((val / max) * 72);
        const isToday = i === data.length - 1;
        const label = d.date?.slice(5); // MM-DD
        return (
          <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 9, color: val > 0 ? "#e8e4dc" : MUTED }}>{val > 0 ? val : ""}</span>
            <div style={{ width: "100%", height: h || 2, background: isToday ? RED : "#2a3a2e", borderRadius: 3, minHeight: 2, transition: "height .3s" }} />
            {(i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2)) && (
              <span style={{ fontSize: 9, color: MUTED, whiteSpace: "nowrap" }}>{label}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [days, setDays] = useState(14);
  const [chartMetric, setChartMetric] = useState("total");

  const load = async (d = days) => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, days: d }),
      });
      const data = await res.json();
      if (data.error) { setErr(data.error); setLoading(false); return; }
      setStats(data);
    } catch (e) { setErr(e.message); }
    setLoading(false);
  };

  if (!stats) return (
    <div style={s.page}>
      <nav style={s.nav}><span style={{ fontFamily: "var(--serif)", fontSize: 15, fontWeight: 900, color: RED }}>VERTICAL STUDIO · ADMIN</span></nav>
      <div style={{ maxWidth: 400, margin: "120px auto 0", padding: "0 24px" }}>
        <div style={s.card}>
          <p style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Dashboard Admin</p>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>Accès réservé</p>
          <input type="password" placeholder="Token administrateur" value={token} onChange={e => setToken(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} style={s.input} />
          {err && <p style={{ color: RED, fontSize: 13, marginBottom: 12 }}>{err}</p>}
          <button onClick={() => load()} disabled={loading} style={{ ...s.btn, opacity: loading ? 0.6 : 1 }}>{loading ? "Chargement…" : "Accéder →"}</button>
        </div>
      </div>
    </div>
  );

  const { analytics } = stats;
  const totaux = analytics?.totaux || {};
  const jours = analytics?.jours || [];
  const totalGenerations = Object.entries(totaux).filter(([k]) => k !== "activeToday").reduce((s, [, v]) => s + v, 0);
  const todayData = jours[jours.length - 1] || {};

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={{ fontFamily: "var(--serif)", fontSize: 15, fontWeight: 900, color: RED }}>VERTICAL STUDIO · ADMIN</span>
        <div style={{ display: "flex", gap: 10 }}>
          {[7, 14, 30].map(d => (
            <button key={d} onClick={() => { setDays(d); load(d); }}
              style={{ padding: "7px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, background: days === d ? BORDER : "none", color: days === d ? "#e8e4dc" : MUTED, cursor: "pointer", fontSize: 12, fontFamily: "var(--sans)" }}>
              {d}j
            </button>
          ))}
          <button onClick={() => load(days)} style={{ background: "none", border: `1px solid ${BORDER}`, color: MUTED, padding: "7px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: "var(--sans)" }}>↻</button>
        </div>
      </nav>

      {/* Stripe stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, padding: "24px 32px 0" }}>
        {[
          { val: stats.total, label: "Abonnés actifs", color: "#fff" },
          { val: stats.standard, label: "Standard", color: RED },
          { val: stats.premium, label: "Premium", color: "#4ade80" },
          { val: `${stats.mrr.toFixed(0)} €`, label: "MRR estimé", color: stats.mrr > 500 ? "#4ade80" : stats.mrr > 100 ? "#facc15" : RED },
          { val: totaux.activeToday || 0, label: "Actifs aujourd'hui", color: "#60a5fa" },
          { val: totalGenerations, label: "Générations totales", color: "#c084fc" },
        ].map(({ val, label, color }) => (
          <div key={label} style={{ ...s.card, textAlign: "center", padding: "20px 16px" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 900, color, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 6, fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Graphique activité */}
      <div style={{ margin: "20px 32px 0" }}>
        <div style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14 }}>Activité — {days} derniers jours</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["total", "bible", "script", "poster", "traduction"].map(m => (
                <button key={m} onClick={() => setChartMetric(m)}
                  style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${BORDER}`, background: chartMetric === m ? BORDER : "none", color: chartMetric === m ? "#e8e4dc" : MUTED, cursor: "pointer", fontSize: 11, fontFamily: "var(--sans)" }}>
                  {m === "total" ? "Total" : LABEL[m]}
                </button>
              ))}
            </div>
          </div>
          <BarChart data={jours} metric={chartMetric} />
        </div>
      </div>

      {/* Totaux par action */}
      <div style={{ margin: "20px 32px 0" }}>
        <div style={s.card}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Totaux par type</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {Object.entries(LABEL).map(([key, label]) => (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: 12, color: MUTED }}>auj. {todayData[key] || 0}</span>
                </div>
                <MiniBar value={totaux[key] || 0} max={Math.max(...Object.values(totaux).filter(v => typeof v === "number"), 1)} color={COLOR[key]} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* A/B Test panel */}
      {stats.ab && (() => {
        const ab = stats.ab;
        const pv = ab.page_view || 0;
        const pvA = ab.page_view_A || 0;
        const pvB = ab.page_view_B || 0;
        const cs = ab.checkout_started || 0;
        const csA = ab.checkout_started_A || 0;
        const csB = ab.checkout_started_B || 0;
        const csuc = ab.checkout_success || 0;

        const rateA = pvA > 0 ? ((csA / pvA) * 100).toFixed(1) : "—";
        const rateB = pvB > 0 ? ((csB / pvB) * 100).toFixed(1) : "—";
        const winnerColor = (rateA === "—" || rateB === "—") ? MUTED
          : parseFloat(rateA) >= parseFloat(rateB) ? "#4ade80" : "#facc15";
        const winner = (rateA === "—" || rateB === "—") ? "—"
          : parseFloat(rateA) >= parseFloat(rateB) ? "A" : "B";

        return (
          <div style={{ margin: "20px 32px 0" }}>
            <div style={s.card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <p style={{ fontWeight: 700, fontSize: 14 }}>A/B Test — Hero headline</p>
                {winner !== "—" && (
                  <span style={{ background: winnerColor + "22", color: winnerColor, border: `1px solid ${winnerColor}44`, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>
                    Variante {winner} en tête
                  </span>
                )}
              </div>

              {/* Funnel */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Vues (total)", val: pv, color: "#60a5fa" },
                  { label: "Checkout démarré", val: cs, color: "#f59e0b" },
                  { label: "Paiements", val: csuc, color: "#4ade80" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 5, fontWeight: 600 }}>{label}</div>
                    {pv > 0 && <div style={{ fontSize: 10, color: BORDER, marginTop: 3 }}>{((val / pv) * 100).toFixed(1)}% des vues</div>}
                  </div>
                ))}
              </div>

              {/* Variants comparison */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { v: "A", label: "De l'idée au cliffhanger.", views: pvA, checkouts: csA, rate: rateA },
                  { v: "B", label: "Ta série, prête à tourner.", views: pvB, checkouts: csB, rate: rateB },
                ].map(({ v, label, views, checkouts, rate }) => {
                  const isWinner = winner === v;
                  return (
                    <div key={v} style={{ borderRadius: 10, padding: "16px 18px", border: `1px solid ${isWinner ? winnerColor + "55" : BORDER}`, background: isWinner ? winnerColor + "08" : "transparent" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <span style={{ background: isWinner ? winnerColor : BORDER, color: isWinner ? "#000" : MUTED, borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>V.{v}</span>
                        <span style={{ fontSize: 12, color: MUTED, fontStyle: "italic" }}>"{label}"</span>
                      </div>
                      <div style={{ display: "flex", gap: 18 }}>
                        <div>
                          <div style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 900, color: "#60a5fa" }}>{views}</div>
                          <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>vues</div>
                        </div>
                        <div>
                          <div style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 900, color: "#f59e0b" }}>{checkouts}</div>
                          <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>clics checkout</div>
                        </div>
                        <div>
                          <div style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 900, color: isWinner ? winnerColor : "#e8e4dc" }}>{rate}%</div>
                          <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>conversion</div>
                        </div>
                      </div>
                      {views > 0 && (
                        <div style={{ marginTop: 10, height: 4, background: BORDER, borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.min(100, checkouts / views * 100 * 10)}%`, background: isWinner ? winnerColor : MUTED, borderRadius: 2, transition: "width .5s" }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Table abonnés */}
      <div style={{ margin: "20px 32px 0" }}>
        <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
            <p style={{ fontWeight: 700, fontSize: 14 }}>Abonnés récents</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Email", "Plan", "Montant", "Date"].map(h => <th key={h} style={s.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {(stats.abonnes || []).map((a, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                    <td style={s.td}>{a.email}</td>
                    <td style={s.td}>
                      <span style={{ background: a.plan === "premium" ? "#1a2e22" : "#2a1a12", color: a.plan === "premium" ? "#4ade80" : RED, padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                        {a.plan === "premium" ? "🎭 Premium" : "⚡ Standard"}
                      </span>
                    </td>
                    <td style={s.td}>{a.montant.toFixed(2)} {a.currency?.toUpperCase()}</td>
                    <td style={{ ...s.td, color: MUTED }}>{new Date(a.createdAt * 1000).toLocaleDateString("fr-FR")}</td>
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
