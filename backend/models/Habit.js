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
