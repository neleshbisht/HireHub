import { useEffect, useState } from "react";
import API from "../../api/api";
import DashboardLayout from "../../components/DashboardLayout";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const res = await API.get("/admin/jobs");
      setJobs(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this job?")) return;
    try {
      await API.delete(`/admin/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <DashboardLayout title="Admin Panel">
      <h3 style={{ marginTop: 0 }}>Jobs</h3>
      <p className="muted">View and moderate all job posts.</p>

      {err && <div className="bad">{err}</div>}
      {loading && <p className="muted">Loading...</p>}

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        {jobs.map((j) => (
          <div key={j._id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 900 }}>{j.title}</div>
                <div className="muted small">
                  {j.company} — {j.location} • {j.type}
                </div>
                <div className="muted small" style={{ marginTop: 6 }}>
                  Posted by: <b>{j.createdBy?.name}</b> ({j.createdBy?.email})
                </div>
              </div>

              <button className="btn btn--ghost" onClick={() => remove(j._id)}>
                Delete
              </button>
            </div>

            <div className="muted small" style={{ marginTop: 10 }}>
              {j.description?.slice(0, 140)}...
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

const card = {
  padding: 12,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,.10)",
  background: "rgba(255,255,255,.03)",
};