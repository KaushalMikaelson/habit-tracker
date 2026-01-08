const cors = require("cors");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const habitsRoutes = require("./routes/habits.routes");

const app = express();

// ✅ FIXED
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use(cors({
   origin: "http://localhost:3000",
   credentials: true,
}));

// ✅ FIXED: Use fallback properly
const MONGO_URI =
   process.env.MONGO_URI || "mongodb://127.0.0.1:27017/habit-tracker";

// MongoDB Connection
mongoose.connect(MONGO_URI, { autoIndex: false })
   .then(async () => {
      console.log("MongoDB connected");
      console.log("Connected DB name:", mongoose.connection.name);

      // Drop the problematic unique index on title if it exists
      try {
         await mongoose.connection.db.collection('habits').dropIndex('title_1');
         console.log("✅ Dropped unique title index");
      } catch (err) {
         // Index doesn't exist, which is fine
         console.log("ℹ️ No title index to drop (this is good)");
      }
   })
   .catch(err => console.error("Mongo error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/habits", habitsRoutes);

app.get("/", (req, res) => {
   res.send("Backend is running 🚀");
});

// Start Server
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
