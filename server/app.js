import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";


// ==========================
// Routes
// ==========================
import authRoutes from "./routes/authRoutes.js";


dotenv.config();

const app = express();


// ==========================
// DATABASE CONNECTION
// ==========================
connectDB();


// ==========================
// MIDDLEWARES
// ==========================
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);


// ==========================
// HEALTH CHECK
// ==========================
app.get("/", (req, res) => {
  res.send("API is running...");
});



export default app;
