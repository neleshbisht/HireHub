import { useEffect, useState } from "react";
import API from "../api/api";

function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("/jobs").then((res) => {
      setJobs(res.data.jobs);
    });
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Available Jobs</h1>
      {jobs.map((job) => (
        <div key={job._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h3>{job.title}</h3>
          <p>{job.company} — {job.location}</p>
          <p>{job.type}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;