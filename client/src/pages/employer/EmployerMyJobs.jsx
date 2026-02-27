import { useEffect, useState } from "react";
import API from "../../api/api";
import DashboardLayout from "../../components/DashboardLayout";
import { Link } from "react-router-dom";

export default function EmployerMyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const res = await API.get("/jobs/me/list");
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
      await API.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <DashboardLayout title="Employer">
      <h3 style={{ marginTop: 0 }}>My Jobs</h3>
      <p className="muted">Jobs you posted. You can delete or view applications.</p>

      {err && <div className="bad">{err}</div>}
      {loading && <p className="muted">Loading...</p>}

      {!loading && jobs.length === 0 && (
        <div className="muted">No jobs yet. Post one from the menu.</div>
      )}

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {jobs.map((j) => (
          <div key={j._id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 900 }}>{j.title}</div>
                <div className="muted small">{j.company} — {j.location} • {j.type}</div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link className="btn btn--ghost" to={`/employer/apps/${j._id}`}>Applications</Link>
                <button className="btn btn--ghost" onClick={() => remove(j._id)}>Delete</button>
              </div>
            </div>

            <div className="muted small" style={{ marginTop: 10 }}>
              {j.description?.slice(0, 120)}...
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

const card = {
  padding: 14,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,.10)",
  background: "rgba(255,255,255,.03)",
};