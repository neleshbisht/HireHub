import { useEffect, useState } from "react";
import API from "../../api/api";
import DashboardLayout from "../../components/DashboardLayout";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <DashboardLayout title="Admin Panel">
      <h3 style={{ marginTop: 0 }}>Users</h3>
      <p className="muted">Manage all users of the platform.</p>

      {err && <div className="bad">{err}</div>}
      {loading && <p className="muted">Loading...</p>}

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        {users.map((u) => (
          <div key={u._id} style={row}>
            <div>
              <div style={{ fontWeight: 900 }}>{u.name}</div>
              <div className="muted small">{u.email}</div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={pill(u.role)}>{u.role}</span>
              <button className="btn btn--ghost" onClick={() => remove(u._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

const row = {
  padding: 12,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,.10)",
  background: "rgba(255,255,255,.03)",
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center",
};

const pill = (role) => ({
  padding: "6px 10px",
  borderRadius: 999,
  fontWeight: 900,
  border: "1px solid rgba(255,255,255,.10)",
  background:
    role === "admin"
      ? "rgba(0,255,136,.12)"
      : role === "employer"
      ? "rgba(108,92,231,.15)"
      : "rgba(255,255,255,.06)",
});