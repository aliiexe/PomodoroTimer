const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  preferences: {
    darkMode: { type: Boolean, default: false },
    defaultStudyTime: { type: Number, default: 25 },
    defaultRestTime: { type: Number, default: 5 },
    defaultCycles: { type: Number, default: 4 },
  },
  rewards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reward" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);