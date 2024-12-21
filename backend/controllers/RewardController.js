const Reward = require('../models/Reward');

// Create a new reward
const createReward = async (req, res) => {
  try {
    const { userId, title, points } = req.body;
    const reward = new Reward({ userId, title, points });
    await reward.save();
    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reward', error });
  }
};

// Get all rewards
const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rewards', error });
  }
};

// Get a reward by ID
const getRewardById = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    res.status(200).json(reward);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reward', error });
  }
};

// Update a reward
const updateReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    res.status(200).json(reward);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reward', error });
  }
};

// Delete a reward
const deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndDelete(req.params.id);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    res.status(200).json({ message: 'Reward deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reward', error });
  }
};

module.exports = {
  createReward,
  getRewards,
  getRewardById,
  updateReward,
  deleteReward,
};
