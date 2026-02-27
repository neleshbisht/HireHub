import express from "express";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = express.Router();

/**
 * ADMIN ONLY
 * base: /api/admin
 */

// Users list
router.get("/users", authRequired, requireRole("admin"), async (req, res) => {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  res.json(users);
});

// Delete a user (also removes their jobs/applications)
router.delete("/users/:id", authRequired, requireRole("admin"), async (req, res) => {
  const id = req.params.id;

  await Application.deleteMany({ candidate: id });
  await Job.deleteMany({ createdBy: id });
  await User.deleteOne({ _id: id });

  res.json({ ok: true });
});

// Jobs list (all)
router.get("/jobs", authRequired, requireRole("admin"), async (req, res) => {
  const jobs = await Job.find()
    .sort({ createdAt: -1 })
    .populate("createdBy", "name email role");
  res.json(jobs);
});

// Delete any job
router.delete("/jobs/:id", authRequired, requireRole("admin"), async (req, res) => {
  const id = req.params.id;
  await Application.deleteMany({ job: id });
  await Job.deleteOne({ _id: id });
  res.json({ ok: true });
});

// Applications list (all)
router.get("/applications", authRequired, requireRole("admin"), async (req, res) => {
  const apps = await Application.find()
    .sort({ createdAt: -1 })
    .populate("job")
    .populate("candidate", "name email role");
  res.json(apps);
});

export default router;