const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  criteria: {
    sessionsCompleted: { type: Number, required: true },
    totalStudyTime: { type: Number, required: true }
  },
  rewardType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reward', RewardSchema);