const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const UserData = require("../models/UserData");
const User = require("../models/User");

// 🔐 Protect all routes
router.use(authMiddleware);

// Helper: get user email from userId
async function getUserEmail(userId) {
  const user = await User.findById(userId).select("email");
  return user ? user.email : null;
}

// ===============================
// GET focus items + reminders
// ===============================
router.get("/", async (req, res) => {
  try {
    const email = await getUserEmail(req.user.id);
    if (!email) return res.status(404).json({ message: "User not found" });

    let userData = await UserData.findOne({ userEmail: email });
    if (!userData) {
      userData = await UserData.create({ userEmail: email, focusItems: [], reminders: [] });
    }

    res.json({ focusItems: userData.focusItems, reminders: userData.reminders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user data", error: err.message });
  }
});

// ===============================
// SAVE focus items (full replace for today's date)
// ===============================
router.put("/focus", async (req, res) => {
  try {
    const email = await getUserEmail(req.user.id);
    if (!email) return res.status(404).json({ message: "User not found" });

    const { items, date } = req.body;
    if (!date) return res.status(400).json({ message: "Date is required" });

    let userData = await UserData.findOne({ userEmail: email });
    if (!userData) {
      userData = new UserData({ userEmail: email, focusItems: [], reminders: [] });
    }

    // Replace items for this date, keep items from other dates
    const otherDayItems = userData.focusItems.filter(i => i.date !== date);
    const todayItems = (items || []).map(i => ({ ...i, date }));
    userData.focusItems = [...otherDayItems, ...todayItems];

    await userData.save();
    res.json({ focusItems: userData.focusItems });
  } catch (err) {
    res.status(500).json({ message: "Failed to save focus items", error: err.message });
  }
});

// ===============================
// SAVE reminders (full replace)
// ===============================
router.put("/reminders", async (req, res) => {
  try {
    const email = await getUserEmail(req.user.id);
    if (!email) return res.status(404).json({ message: "User not found" });

    const { items } = req.body;

    let userData = await UserData.findOne({ userEmail: email });
    if (!userData) {
      userData = new UserData({ userEmail: email, focusItems: [], reminders: [] });
    }

    userData.reminders = items || [];
    await userData.save();
    res.json({ reminders: userData.reminders });
  } catch (err) {
    res.status(500).json({ message: "Failed to save reminders", error: err.message });
  }
});

module.exports = router;
