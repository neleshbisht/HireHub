import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { authRequired, requireRole } from "../middleware/auth.js";
import { uploadResume } from "../middleware/upload.js";

const router = express.Router();

// Candidate: apply with optional resume file upload
router.post(
  "/:jobId/apply",
  authRequired,
  requireRole("candidate"),
  uploadResume.single("resume"),
  async (req, res) => {
    const { jobId } = req.params;
    const { note = "" } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const resumeLink = req.file ? `/uploads/${req.file.filename}` : "";

    try {
      const app = await Application.create({
        job: jobId,
        candidate: req.user.id,
        resumeLink,
        note,
      });
      return res.json(app);
    } catch {
      return res.status(409).json({ message: "Already applied" });
    }
  }
);

// Candidate: my applications
router.get("/me/list", authRequired, requireRole("candidate"), async (req, res) => {
  const apps = await Application.find({ candidate: req.user.id })
    .sort({ createdAt: -1 })
    .populate("job");
  res.json(apps);
});

// Employer/Admin: list applications for a job (only owner or admin)
router.get("/:jobId", authRequired, requireRole("employer", "admin"), async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  if (req.user.role !== "admin" && job.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const apps = await Application.find({ job: jobId })
    .sort({ createdAt: -1 })
    .populate("candidate", "name email role");

  res.json(apps);
});

export default router;