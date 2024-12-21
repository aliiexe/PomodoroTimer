const mongoose = require("mongoose");

const ProductivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalStudyTime: { type: Number, default: 0 },
  totalRestTime: { type: Number, default: 0 },
  sessionsCompleted: { type: Number, default: 0 },
  sessionsAbandoned: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Productivity", ProductivitySchema);