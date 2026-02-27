import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate("/login");
  }

  const isEmployer = user?.role === "employer";
  const isCandidate = user?.role === "candidate";
  const isAdmin = user?.role === "admin";

  return (
    <div className="container" style={{ padding: "22px 0" }}>
      <div style={styles.top}>
        <div>
          <h1 style={{ margin: 0 }}>{title}</h1>
          <p className="muted" style={{ margin: "6px 0 0" }}>
            Logged in as <b>{user?.name}</b> ({user?.role})
          </p>
        </div>
        <button className="btn btn--ghost" onClick={onLogout}>Logout</button>
      </div>

      <div style={styles.grid}>
        <aside className="card" style={styles.sidebar}>
          <div style={styles.brand}>HireHub_</div>
          <p className="muted small" style={{ marginTop: 6 }}>
            Dashboard menu
          </p>

          <div style={styles.menu}>
            <Link className="navItem" to="/dashboard">Overview</Link>

            {isEmployer && (
              <>
                <Link className="navItem" to="/employer/post">Post Job</Link>
                <Link className="navItem" to="/employer/jobs">My Jobs</Link>
              </>
            )}

            {isCandidate && (
              <>
                <Link className="navItem" to="/candidate/jobs">Browse Jobs</Link>
                <Link className="navItem" to="/candidate/apps">My Applications</Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link className="navItem" to="/admin/users">Users</Link>
                <Link className="navItem" to="/admin/jobs">All Jobs</Link>
                <Link className="navItem" to="/admin/apps">Applications</Link>
              </>
            )}
          </div>

          <div style={styles.tip} className="muted small">
            We’re building employer → candidate → admin in order.
          </div>
        </aside>

        <main className="card" style={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}

const styles = {
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: 14,
  },
  sidebar: { padding: 16, borderRadius: 18 },
  main: { padding: 16, borderRadius: 18, minHeight: 480 },
  brand: { fontWeight: 900, letterSpacing: 1, color: "var(--accent)" },
  menu: { display: "grid", gap: 8, marginTop: 12 },
  tip: {
    marginTop: 14,
    borderTop: "1px solid rgba(255,255,255,.10)",
    paddingTop: 12,
  },
};