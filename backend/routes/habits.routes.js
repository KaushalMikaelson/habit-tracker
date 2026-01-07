console.log("✅ habits.routes.js LOADED");

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const Habit = require("../models/Habit");

// Get all habits for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch habits" });
  }
});

// Create a new habit for logged-in user
router.post("/", authMiddleware, async (req, res) => {
  console.log("🔥 POST /habits HIT");
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const habit = await Habit.create({
      title,
      userId: req.userId,
      completedDates: [],
    });
    res.status(201).json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create habit" });
  }
})

// Toggle habit completion for logged-in user for specific habit and date
router.patch("/:id/toggle", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    if (habit.userId.toString() !== req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const today = new Date().toISOString().split("T")[0];
    if (habit.completedDates.includes(today)) {
      habit.completedDates.pull(today);
    } else {
      habit.completedDates.push(today);
    }
    await habit.save();
    res.json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to toggle habit" });
  }
})

//delete a habit for logged-in user
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (habit.userId.toString() != req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await habit.deleteOne();

    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete habit" });
  }
})
module.exports = router;
