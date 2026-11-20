
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes, { UPLOAD_DIR } from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

// Middlewares
// In production set CLIENT_URL to the frontend origin(s), comma separated.
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);
app.use(
  cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined)
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/phones", searchRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/uploads", express.static(UPLOAD_DIR));

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PocketPhone Backend is running!",
  });
});

// Server
const PORT = process.env.PORT || 5000;

// Connect to DB and start server (proper async pattern)
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
