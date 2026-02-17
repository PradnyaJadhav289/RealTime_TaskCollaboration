import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

// ─────────────────────────────────────────────
// BUILD ALLOWED ORIGINS LIST
// Strips trailing slashes to prevent CORS mismatch
// ─────────────────────────────────────────────
const rawClientUrl = (process.env.CLIENT_URL || "").replace(/\/$/, "");

const allowedOrigins = [
  rawClientUrl,                          // Your Vercel frontend (from .env)
  "http://localhost:5173",               // Local Vite dev
  "http://localhost:3000",               // Local CRA dev (if any)
].filter(Boolean);

console.log("✅ Allowed CORS origins:", allowedOrigins);

// ─────────────────────────────────────────────
// CORS — handles Vercel preview URLs too
// ─────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / curl / mobile (no origin header)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, "");

      // Allow exact matches
      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      // Allow ALL Vercel preview deployment URLs for your project
      // e.g. your-app-git-main-username.vercel.app
      if (cleanOrigin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      console.warn(`❌ CORS blocked: ${origin}`);
      callback(new Error(`CORS policy blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─────────────────────────────────────────────
// BODY PARSERS
// ─────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
// REQUEST LOGGER
// ─────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} — origin: ${req.headers.origin || "none"}`);
  next();
});

// ─────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Task Collaboration API is running!",
    version: "1.0.0",
    status: "healthy",
    environment: process.env.NODE_ENV || "development",
  });
});

// ─────────────────────────────────────────────
// API ROUTES — no /api prefix, matches frontend
// ─────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/boards", boardRoutes);
app.use("/lists", listRoutes);
app.use("/tasks", taskRoutes);

// ─────────────────────────────────────────────
// 404 HANDLER
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

// ─────────────────────────────────────────────
// GLOBAL ERROR HANDLER
// ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;