const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    completedDates: {
      type: [String],
      default: [],
    },

    // 🆕 ORDER (for drag & drop persistence)
    order: {
      type: Number,
      default: 0,
    },

    // 🆕 CATEGORIES / TAGGING
    category: {
      type: String,
      default: "General",
    },

    // 🆕 ARCHIVING (active, archived)
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },

    // 🆕 DAILY NOTES (Map of Date String 'YYYY-MM-DD' to note text)
    notes: {
      type: Map,
      of: String,
      default: {},
    },

    // 🆕 SOFT DELETE SUPPORT
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", HabitSchema);
