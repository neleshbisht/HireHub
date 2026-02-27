import { useEffect, useState } from "react";
import API from "../../api/api";
import DashboardLayout from "../../components/DashboardLayout";
import ApplyModal from "../../components/ApplyModal";

export default function CandidateJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selected, setSelected] = useState(null);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const res = await API.get("/jobs");
      setJobs(res.data.jobs || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <DashboardLayout title="Candidate">
      <h3 style={{ marginTop: 0 }}>Browse Jobs</h3>
      <p className="muted">Apply with a note and optional resume upload.</p>

      {err && <div className="bad">{err}</div>}
      {loading && <p className="muted">Loading...</p>}

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {jobs.map((j) => (
          <div key={j._id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 900 }}>{j.title}</div>
                <div className="muted small">{j.company} — {j.location} • {j.type}</div>
              </div>
              <button className="btn" onClick={() => setSelected(j)}>Apply</button>
            </div>

            <div className="muted small" style={{ marginTop: 10 }}>
              {j.description?.slice(0, 140)}...
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <ApplyModal
          job={selected}
          onClose={() => setSelected(null)}
          onApplied={() => {
            setSelected(null);
            alert("✅ Applied successfully!");
          }}
        />
      )}
    </DashboardLayout>
  );
}

const card = {
  padding: 14,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,.10)",
  background: "rgba(255,255,255,.03)",
};