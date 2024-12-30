const Reward = require('../models/Reward');

// Create a new reward
const createReward = async (req, res) => {
  try {
    console.log("Creating a new reward:", req.body);
    const { name, description, criteria, rewardType } = req.body;

    // Validate required fields
    if (!name || !criteria || !criteria.totalStudyTime || !criteria.sessionsCompleted || !rewardType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const reward = new Reward({ name, description, criteria, rewardType });
    await reward.save();
    res.status(201).json(reward);
  } catch (error) {
    console.error("Error creating reward:", error);
    res.status(500).json({ message: 'Error creating reward', error });
  }
};

// Get all rewards
const getRewards = async (req, res) => {
  try {
    console.log("Fetching all rewards");
    const rewards = await Reward.find();
    res.status(200).json(rewards);
  } catch (error) {
    console.error("Error fetching rewards:", error);
    res.status(500).json({ message: 'Error fetching rewards', error });
  }
}

// Get a reward by ID
const getRewardById = async (req, res) => {
  try {
    console.log("Fetching reward by ID:", req.params.id);
    const reward = await Reward.findById(req.params.id);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    res.status(200).json(reward);
  } catch (error) {
    console.error("Error fetching reward:", error);
    res.status(500).json({ message: 'Error fetching reward', error });
  }
};

// Update a reward
const updateReward = async (req, res) => {
  try {
    console.log("Updating reward:", req.params.id, req.body);
    const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    res.status(200).json(reward);
  } catch (error) {
    console.error("Error updating reward:", error);
    res.status(500).json({ message: 'Error updating reward', error });
  }
};

// Delete a reward
const deleteReward = async (req, res) => {
  try {
    console.log("Deleting reward:", req.params.id);
    const reward = await Reward.findByIdAndDelete(req.params.id);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    res.status(200).json({ message: 'Reward deleted successfully' });
  } catch (error) {
    console.error("Error deleting reward:", error);
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