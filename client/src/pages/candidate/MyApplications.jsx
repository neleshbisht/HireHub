import { useEffect, useState } from "react";
import API, { API_BASE } from "../../api/api";
import DashboardLayout from "../../components/DashboardLayout";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await API.get("/applications/me/list");
        setApps(res.data);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DashboardLayout title="Candidate">
      <h3 style={{ marginTop: 0 }}>My Applications</h3>
      <p className="muted">Track what you’ve applied to.</p>

      {err && <div className="bad">{err}</div>}
      {loading && <p className="muted">Loading...</p>}

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {!loading && apps.length === 0 ? (
          <div className="muted">No applications yet.</div>
        ) : (
          apps.map((a) => (
            <div key={a._id} style={card}>
              <div style={{ fontWeight: 900 }}>{a.job?.title}</div>
              <div className="muted small">{a.job?.company} — {a.job?.location}</div>
              <div className="muted small" style={{ marginTop: 8 }}>
                Status: <b>{a.status}</b>
              </div>

              {a.resumeLink && (
                <div className="muted small" style={{ marginTop: 8 }}>
                  Resume:{" "}
                  <a
                    href={`${API_BASE}${a.resumeLink}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                </div>
              )}
            </div>
          ))
        )}
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