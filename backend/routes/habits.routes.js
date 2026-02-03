const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const Habit = require("../models/Habit");
const logger = require("../utils/logger");

logger.debug("✅ habits.routes.js LOADED");

// 🔐 Protect all habit routes
router.use(authMiddleware);

// ===============================
// Get all habits for logged-in user
// ===============================
router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find({
      userId: req.user.id,
      isDeleted: false,
    }).sort({ order: 1 }); // 👈 SORT BY ORDER
    // ⚠️ unchanged for now

    logger.debug(
      "📋 Returning habits:",
      habits.map((h) => ({ id: h._id, title: h.title }))
    );

    res.json(habits);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Failed to fetch habits" });
  }
});

// ===============================
// Create a new habit for logged-in user
// ===============================
router.post("/", async (req, res) => {
  try {
    logger.debug("📝 Create habit request received");
    logger.debug("Request body:", req.body);
    logger.debug("User from middleware:", req.user);

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // ✅ STEP 2: count existing (non-deleted) habits
    const count = await Habit.countDocuments({
      userId: req.user.id,
      isDeleted: false,
    });

    const habit = await Habit.create({
      title,
      userId: req.user.id,
      completedDates: [],
      order: count, // 👈 NEW (append at end)
    });

    logger.info("✅ Habit created:", title);
    res.status(201).json(habit);
  } catch (error) {
    logger.error("❌ Error creating habit:");
    logger.error("Error name:", error.name);
    logger.error("Error message:", error.message);
    logger.error("Error code:", error.code);
    logger.debug("Full error:", JSON.stringify(error, null, 2));

    res
      .status(500)
      .json({ message: "Failed to create habit", error: error.message });
  }
});

// ===============================
// Toggle habit completion for a specific date
// ===============================
router.patch("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    logger.debug("🔄 Toggle request - Habit ID:", id, "Date:", date);
    logger.debug("User ID from token:", req.user.id);

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const habit = await Habit.findOne({
      _id: id,
      userId: req.user.id,
      isDeleted: false,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (habit.completedDates.includes(date)) {
      habit.completedDates.pull(date);
    } else {
      habit.completedDates.push(date);
    }

    await habit.save();
    res.json(habit);
  } catch (error) {
    logger.error("❌ Toggle error:", error);
    res.status(500).json({ message: "Failed to toggle habit" });
  }
});

// ===============================
// Update habit title
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const habit = await Habit.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id,
        isDeleted: false,
      },
      {
        title: title.trim(),
      },
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json(habit);
  } catch (error) {
    logger.error("❌ Error updating habit:", error);
    res.status(500).json({ message: "Failed to update habit" });
  }
});

// ===============================
// Soft delete habit
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const habit = await Habit.findOne({
      _id: id,
      userId: req.user.id,
      isDeleted: false,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    habit.isDeleted = true;
    habit.deletedAt = new Date();
    await habit.save();

    res.json({ message: "Habit deleted (soft)" });
  } catch (error) {
    logger.error("❌ Error deleting habit:", error);
    res.status(500).json({ message: "Failed to delete habit" });
  }
});

// ===============================
// Undo delete
// ===============================
router.patch("/:id/undo", async (req, res) => {
  try {
    const { id } = req.params;

    const habit = await Habit.findOne({
      _id: id,
      userId: req.user.id,
      isDeleted: true,
    });

    if (!habit) {
      return res
        .status(404)
        .json({ message: "Habit not found or not deleted" });
    }

    habit.isDeleted = false;
    habit.deletedAt = null;
    await habit.save();

    res.json(habit);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Failed to restore habit" });
  }
});


// ===============================
// Reorder habits (persist order)
// ===============================
router.post("/reorder", async (req, res) => {
  try {
    const updates = req.body;
    // expected: [{ _id, order }]

    if (!Array.isArray(updates)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const bulkOps = updates.map((h) => ({
      updateOne: {
        filter: {
          _id: h._id,
          userId: req.user.id,
          isDeleted: false,
        },
        update: { order: h.order },
      },
    }));

    await Habit.bulkWrite(bulkOps);

    res.json({ success: true });
  } catch (error) {
    logger.error("❌ Failed to reorder habits:", error);
    res.status(500).json({ message: "Failed to reorder habits" });
  }
});


module.exports = router;
