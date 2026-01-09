const cors = require("cors");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const logger = require("./utils/logger");

const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const habitsRoutes = require("./routes/habits.routes");

const app = express();

// ✅ PORT for Render / Local
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// ✅ UPDATED CORS (local-safe, production-ready)
app.use(
  cors({
    origin: [
      "http://localhost:3000", // React (CRA)
      "https://habit-tracker-kappa-two.vercel.app",

    ],
    credentials: true,
  })
);

// ✅ MongoDB URI (Atlas OR local fallback)
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/habit-tracker";

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { autoIndex: false })
  .then(async () => {
    logger.info("MongoDB connected");
    logger.info("Connected DB name:", mongoose.connection.name);

    // Drop old unique index if exists
    try {
      await mongoose.connection.db
        .collection("habits")
        .dropIndex("title_1");
      logger.debug("✅ Dropped unique title index");
    } catch (err) {
      logger.debug("ℹ️ No title index to drop");
    }
  })
  .catch((err) => logger.error("Mongo error:", err));

// Routes - ✅ FIXED: Added /api prefix to match frontend
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/habits", habitsRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Start server
app.listen(PORT, () => {
  logger.always(`Server running on port ${PORT}`);
});
