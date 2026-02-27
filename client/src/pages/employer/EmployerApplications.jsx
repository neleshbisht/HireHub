import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";
import DashboardLayout from "../../components/DashboardLayout";

export default function EmployerApplications() {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);
  const [job, setJob] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const j = await API.get(`/jobs/${jobId}`);
        setJob(j.data);
        const res = await API.get(`/applications/${jobId}`);
        setApps(res.data);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load applications");
      }
    })();
  }, [jobId]);

  return (
    <DashboardLayout title="Employer">
      <h3 style={{ marginTop: 0 }}>Applications</h3>
      {job && (
        <p className="muted">
          For: <b>{job.title}</b> — {job.company}
        </p>
      )}
      {err && <div className="bad">{err}</div>}

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {apps.length === 0 ? (
          <div className="muted">No applications yet.</div>
        ) : (
          apps.map((a) => (
            <div key={a._id} style={card}>
              <div style={{ fontWeight: 900 }}>{a.candidate?.name}</div>
              <div className="muted small">{a.candidate?.email}</div>
              <div className="muted small" style={{ marginTop: 10 }}>
                Status: <b>{a.status}</b>
              </div>
              {a.note && <div className="muted small" style={{ marginTop: 8 }}>Note: {a.note}</div>}
              {a.resumeLink && (
                <div className="muted small" style={{ marginTop: 8 }}>
                  Resume: <a href={a.resumeLink} target="_blank" rel="noreferrer">Open</a>
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