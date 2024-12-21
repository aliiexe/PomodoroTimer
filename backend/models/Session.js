const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studyTime: { type: Number, required: true },
  restTime: { type: Number, required: true },
  cyclesPlanned: { type: Number, required: true },
  cyclesCompleted: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  status: { type: String, enum: ["completed", "incomplete", "abandoned"], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", SessionSchema);