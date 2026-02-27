import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <div className="container" style={styles.grid}>
        <div style={styles.left}>
          <div style={styles.brandRow}>
            <span style={styles.dot} />
            <span style={styles.brandText}>HireHub</span>
          </div>

          <h1 style={styles.h1}>
            Welcome back, <span style={{ color: "var(--accent)" }}>Nelesh</span>.
          </h1>

          <p className="muted" style={styles.lead}>
            Log in to manage jobs, apply faster, and view dashboards. This UI is designed like a modern product.
          </p>

          <div style={styles.bullets}>
            <div style={styles.bullet}>
              <span style={styles.bulletIcon}>✓</span>
              <div>
                <div style={styles.bulletTitle}>JWT Auth + Roles</div>
                <div className="muted small">Candidate / Employer ready</div>
              </div>
            </div>

            <div style={styles.bullet}>
              <span style={styles.bulletIcon}>✓</span>
              <div>
                <div style={styles.bulletTitle}>Dashboards</div>
                <div className="muted small">Role-based pages after login</div>
              </div>
            </div>

            <div style={styles.bullet}>
              <span style={styles.bulletIcon}>✓</span>
              <div>
                <div style={styles.bulletTitle}>Real-world Project</div>
                <div className="muted small">Filters, applications, admin tools</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={styles.card}>
          <h2 style={{ margin: 0 }}>Login</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            Use your registered email & password.
          </p>

          <form onSubmit={onSubmit} style={styles.form}>
            <label className="label">
              Email
              <input
                className="input"
                type="email"
                placeholder="emp@test.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>

            <label className="label">
              Password
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </label>

            {err && <div className="bad">{err}</div>}

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div style={styles.rowBetween}>
              <span className="muted small">No account?</span>
              <Link className="small" to="/register">Create one →</Link>
            </div>

            <div className="muted small" style={{ marginTop: 10 }}>
              Demo employer: <b>emp@test.com</b> / <b>123456</b>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px 0" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.1fr .9fr",
    gap: 18,
    alignItems: "start"
  },
  left: { padding: 18 },
  brandRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  dot: { width: 10, height: 10, borderRadius: 999, background: "var(--accent)" },
  brandText: { fontWeight: 900, letterSpacing: 1 },
  h1: { margin: "0 0 10px", fontSize: 42, lineHeight: 1.1 },
  lead: { margin: 0, maxWidth: 520 },
  bullets: { marginTop: 18, display: "grid", gap: 12, maxWidth: 520 },
  bullet: {
    display: "flex", gap: 12, alignItems: "flex-start",
    padding: 12, borderRadius: 16,
    border: "1px solid rgba(255,255,255,.10)",
    background: "rgba(255,255,255,.03)"
  },
  bulletIcon: {
    width: 26, height: 26, borderRadius: 8,
    display: "grid", placeItems: "center",
    background: "rgba(0,255,136,.12)",
    color: "var(--accent)",
    fontWeight: 900
  },
  bulletTitle: { fontWeight: 900 },
  card: { padding: 18 },
  form: { marginTop: 14, display: "grid", gap: 12 },
  rowBetween: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }
};