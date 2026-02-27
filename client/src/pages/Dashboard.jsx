import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <DashboardLayout title="Dashboard">
      <h3 style={{ marginTop: 0 }}>Overview</h3>
      <p className="muted">
        You are logged in as <b>{user?.name}</b>. Role: <b>{role}</b>.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <div style={box}>
          <div style={kpi}>✓</div>
          <div className="muted small">Auth + Protected Routes</div>
        </div>
        <div style={box}>
          <div style={kpi}>Next</div>
          <div className="muted small">Employer Post Job</div>
        </div>
        <div style={box}>
          <div style={kpi}>Soon</div>
          <div className="muted small">Applications + Admin</div>
        </div>
      </div>

      <div className="muted small" style={{ marginTop: 14 }}>
        Use the left menu to open pages.
      </div>
    </DashboardLayout>
  );
}

const box = {
  padding: 12,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,.10)",
  background: "rgba(255,255,255,.03)",
};
const kpi = { fontWeight: 900, marginBottom: 6, color: "var(--accent)" };