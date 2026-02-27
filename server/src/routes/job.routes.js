import express from "express";
import Job from "../models/Job.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public: list jobs with search/filter/pagination
router.get("/", async (req, res) => {
  const { q = "", type = "", tag = "", page = 1, limit = 6 } = req.query;
  const p = Math.max(parseInt(page), 1);
  const l = Math.min(Math.max(parseInt(limit), 1), 50);

  const filter = {};
  if (type) filter.type = type;
  if (tag) filter.tags = tag;
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { company: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } }
    ];
  }

  const total = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .skip((p - 1) * l)
    .limit(l)
    .populate("createdBy", "name email role");

  res.json({ total, page: p, limit: l, jobs });
});

// Public: job detail
router.get("/:id", async (req, res) => {
  const job = await Job.findById(req.params.id).populate("createdBy", "name email role");
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
});

// Employer/Admin: create job
router.post("/", authRequired, requireRole("employer", "admin"), async (req, res) => {
  const { title, company, location, type, salaryRange, tags = [], description } = req.body;
  if (!title || !company || !location || !description) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const job = await Job.create({
    title, company, location, type, salaryRange,
    tags: Array.isArray(tags) ? tags : [],
    description,
    createdBy: req.user.id
  });

  res.json(job);
});

// Employer/Admin: list my jobs
router.get("/me/list", authRequired, requireRole("employer", "admin"), async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
  res.json(jobs);
});

// Employer/Admin: delete a job (only owner or admin)
router.delete("/:id", authRequired, requireRole("employer", "admin"), async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });

  if (req.user.role !== "admin" && job.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await Job.deleteOne({ _id: req.params.id });
  res.json({ ok: true });
});

export default router;