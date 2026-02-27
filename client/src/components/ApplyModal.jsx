import { useState } from "react";
import API, { API_BASE } from "../api/api";

export default function ApplyModal({ job, onClose, onApplied }) {
  const [note, setNote] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("note", note);
      if (resume) fd.append("resume", resume);

      await API.post(`/applications/${job._id}/apply`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onApplied();
    } catch (e) {
      setErr(e?.response?.data?.message || "Apply failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div className="card" style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.head}>
          <div>
            <h3 style={{ margin: 0 }}>Apply — {job.title}</h3>
            <p className="muted" style={{ margin: "6px 0 0" }}>
              {job.company} • {job.location}
            </p>
          </div>
          <button className="btn btn--ghost" onClick={onClose}>Close</button>
        </div>

        <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <label className="label">
            Note (optional)
            <textarea className="input" rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
          </label>

          <label className="label">
            Resume (PDF/DOC/DOCX, optional)
            <input
              className="input"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
          </label>

          {err && <div className="bad">{err}</div>}

          <button className="btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>

          <p className="muted small" style={{ margin: 0 }}>
            Resume will be stored as a file and visible to employer.
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.55)",
    display: "grid",
    placeItems: "center",
    padding: 18,
    zIndex: 9999,
  },
  modal: {
    width: "min(720px, 98vw)",
    padding: 18,
    borderRadius: 18,
  },
  head: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "start",
  },
};