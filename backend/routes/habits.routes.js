console.log("✅ habits.routes.js LOADED");

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const Habit = require("../models/Habit");

// 🔐 Protect all habit routes
router.use(authMiddleware);

// Get all habits for logged-in user
router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find({
      userId: req.user.id,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    console.log("📋 Returning habits:", habits.map(h => ({ id: h._id, title: h.title })));
    res.json(habits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch habits" });
  }
});

// Create a new habit for logged-in user
router.post("/", async (req, res) => {
  try {
    console.log("📝 Create habit request received");
    console.log("Request body:", req.body);
    console.log("User from middleware:", req.user);

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const habit = await Habit.create({
      title,
      userId: req.user.id,
      completedDates: [],
    });

    console.log("✅ Habit created successfully:", habit);
    res.status(201).json(habit);
  } catch (error) {
    console.error("❌ Error creating habit:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "Failed to create habit", error: error.message });
  }
});

// Toggle habit completion for a specific date
router.patch("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    console.log("🔄 Toggle request - Habit ID:", id, "Date:", date);
    console.log("User ID from token:", req.user.id);

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const habit = await Habit.findOne({
      _id: id,
      userId: req.user.id,
      isDeleted: false,
    });

    console.log("Found habit:", habit ? "YES" : "NO");
    if (habit) {
      console.log("Habit userId:", habit.userId);
    }

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // Use the date from the request body, not today's date
    if (habit.completedDates.includes(date)) {
      habit.completedDates.pull(date);
    } else {
      habit.completedDates.push(date);
    }

    await habit.save();
    res.json(habit);
  } catch (error) {
    console.error("❌ Toggle error:", error);
    res.status(500).json({ message: "Failed to toggle habit" });
  }
});

// Soft delete habit
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑️ Delete request for habit ID:", id);
    console.log("User ID:", req.user.id);

    const habit = await Habit.findOne({
      _id: id,
      userId: req.user.id,
      isDeleted: false,
    });

    if (!habit) {
      console.log("❌ Habit not found or already deleted");
      return res.status(404).json({ message: "Habit not found" });
    }

    habit.isDeleted = true;
    habit.deletedAt = new Date();
    await habit.save();

    console.log("✅ Habit soft deleted successfully");
    res.json({ message: "Habit deleted (soft)" });
  } catch (error) {
    console.error("❌ Error deleting habit:", error);
    res.status(500).json({ message: "Failed to delete habit" });
  }
});

// Undo delete
router.patch("/:id/undo", async (req, res) => {
  try {
    const { id } = req.params;

    const habit = await Habit.findOne({
      _id: id,
      userId: req.user.id,
      isDeleted: true,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found or not deleted" });
    }

    habit.isDeleted = false;
    habit.deletedAt = null;
    await habit.save();

    res.json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to restore habit" });
  }
});

module.exports = router;
