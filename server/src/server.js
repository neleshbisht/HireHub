import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import applicationRoutes from "./routes/application.routes.js";

dotenv.config();

const app = express();

/* ==============================
   Basic Middleware
============================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hire-hub-eight-alpha.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

/* ==============================
   Serve Uploads Folder
============================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded resumes at:
// http://localhost:5000/uploads/filename.pdf
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* ==============================
   Test Route
============================== */
app.get("/", (req, res) => {
  res.json({ ok: true, name: "HireHub API Running" });
});

/* ==============================
   API Routes
============================== */
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

/* ==============================
   Start Server
============================== */
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });