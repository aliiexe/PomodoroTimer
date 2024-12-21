const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  targetStudyTime: { type: Number, required: true },
  progress: { type: Number, default: 0 },
  status: { type: String, enum: ["in progress", "completed", "abandoned"], default: "in progress" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Goal", GoalSchema);
