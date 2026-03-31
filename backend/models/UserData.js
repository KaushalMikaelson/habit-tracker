const mongoose = require("mongoose");

const focusItemSchema = new mongoose.Schema({
  id: Number,
  text: String,
  done: { type: Boolean, default: false },
  date: String, // YYYY-MM-DD
});

const reminderSchema = new mongoose.Schema({
  id: Number,
  text: String,
  done: { type: Boolean, default: false },
});

const userDataSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  focusItems: { type: [focusItemSchema], default: [] },
  reminders: { type: [reminderSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("UserData", userDataSchema);
