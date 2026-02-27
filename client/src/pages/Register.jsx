import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (e) {
      setErr(e?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <div className="container" style={styles.grid}>
        <div style={{ padding: 18 }}>
          <div style={styles.brandRow}>
            <span style={styles.dot} />
            <span style={styles.brandText}>HireHub</span>
          </div>
          <h1 style={styles.h1}>Create your account</h1>
          <p className="muted" style={{ margin: 0, maxWidth: 520 }}>
            Choose your role. Candidate can apply; Employer can post jobs.
          </p>
        </div>

        <div className="card" style={styles.card}>
          <h2 style={{ margin: 0 }}>Register</h2>
          <p className="muted" style={{ marginTop: 6 }}>It takes less than a minute.</p>

          <form onSubmit={onSubmit} style={styles.form}>
            <label className="label">
              Name
              <input className="input" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required />
            </label>

            <label className="label">
              Email
              <input className="input" type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required />
            </label>

            <label className="label">
              Password
              <input className="input" type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} required />
            </label>

            <label className="label">
              Role
              <select
                className="input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="candidate">Candidate</option>
                <option value="employer">Employer</option>
              </select>
            </label>

            {err && <div className="bad">{err}</div>}

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>

            <div style={styles.rowBetween}>
              <span className="muted small">Already have account?</span>
              <Link className="small" to="/login">Login →</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px 0" },
  grid: { display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 18, alignItems: "start" },
  brandRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  dot: { width: 10, height: 10, borderRadius: 999, background: "var(--accent)" },
  brandText: { fontWeight: 900, letterSpacing: 1 },
  h1: { margin: "0 0 10px", fontSize: 42, lineHeight: 1.1 },
  card: { padding: 18 },
  form: { marginTop: 14, display: "grid", gap: 12 },
  rowBetween: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
};