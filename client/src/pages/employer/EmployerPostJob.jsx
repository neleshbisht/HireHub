import { useState } from "react";
import API from "../../api/api";
import DashboardLayout from "../../components/DashboardLayout";

export default function EmployerPostJob() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "full-time",
    salaryRange: "",
    tags: "",
    description: "",
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await API.post("/jobs", payload);
      setMsg("✅ Job posted successfully!");
      setForm({
        title: "",
        company: "",
        location: "",
        type: "full-time",
        salaryRange: "",
        tags: "",
        description: "",
      });
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout title="Employer">
      <h3 style={{ marginTop: 0 }}>Post a Job</h3>
      <p className="muted">Create a new job listing. Tags are comma-separated.</p>

      <form onSubmit={submit} style={styles.form}>
        <div style={styles.row2}>
          <label className="label">
            Job Title
            <input className="input" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} required />
          </label>

          <label className="label">
            Company
            <input className="input" value={form.company} onChange={(e)=>setForm({...form, company:e.target.value})} required />
          </label>
        </div>

        <div style={styles.row3}>
          <label className="label">
            Location
            <input className="input" value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})} required />
          </label>

          <label className="label">
            Type
            <select className="input" value={form.type} onChange={(e)=>setForm({...form, type:e.target.value})}>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
          </label>

          <label className="label">
            Salary Range
            <input className="input" value={form.salaryRange} onChange={(e)=>setForm({...form, salaryRange:e.target.value})} placeholder="5-8 LPA" />
          </label>
        </div>

        <label className="label">
          Tags (comma separated)
          <input className="input" value={form.tags} onChange={(e)=>setForm({...form, tags:e.target.value})} placeholder="React, Node, MongoDB" />
        </label>

        <label className="label">
          Description
          <textarea className="input" rows={6} value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} required />
        </label>

        {err && <div className="bad">{err}</div>}
        {msg && <div style={{ color: "var(--accent)", fontWeight: 900 }}>{msg}</div>}

        <button className="btn" disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </DashboardLayout>
  );
}

const styles = {
  form: { display: "grid", gap: 12, marginTop: 12 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  row3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
};