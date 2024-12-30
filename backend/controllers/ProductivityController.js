const Productivity = require('../models/Productivity');

// Create a new productivity entry
const createProductivity = async (req, res) => {
  try {
    console.log("Creating a new productivity entry:", req.body);
    const { userId, totalStudyTime, totalRestTime, sessionsCompleted, sessionsAbandoned, streak, bestStreak } = req.body;
    const productivity = new Productivity({ userId, totalStudyTime, totalRestTime, sessionsCompleted, sessionsAbandoned, streak, bestStreak });
    await productivity.save();
    res.status(201).json(productivity);
  } catch (error) {
    console.error("Error creating productivity entry:", error);
    res.status(500).json({ message: 'Error creating productivity entry', error });
  }
};

// Get all productivity entries
const getProductivityEntries = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("Fetching all productivity entries for user:", userId);
    const productivityEntries = await Productivity.find({ userId });
    res.status(200).json(productivityEntries);
  } catch (error) {
    console.error("Error fetching productivity entries:", error);
    res.status(500).json({ message: 'Error fetching productivity entries', error });
  }
};

// Get a productivity entry by ID
const getProductivityById = async (req, res) => {
  try {
    console.log("Fetching productivity entry by ID:", req.params.id);
    const productivity = await Productivity.findById(req.params.id);
    if (!productivity) {
      return res.status(404).json({ message: 'Productivity entry not found' });
    }
    res.status(200).json(productivity);
  } catch (error) {
    console.error("Error fetching productivity entry:", error);
    res.status(500).json({ message: 'Error fetching productivity entry', error });
  }
};

// Update a productivity entry
const updateProductivity = async (req, res) => {
  try {
    console.log("Updating productivity entry:", req.params.id, req.body);
    const productivity = await Productivity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!productivity) {
      return res.status(404).json({ message: 'Productivity entry not found' });
    }
    res.status(200).json(productivity);
  } catch (error) {
    console.error("Error updating productivity entry:", error);
    res.status(500).json({ message: 'Error updating productivity entry', error });
  }
};

// Delete a productivity entry
const deleteProductivity = async (req, res) => {
  try {
    console.log("Deleting productivity entry:", req.params.id);
    const productivity = await Productivity.findByIdAndDelete(req.params.id);
    if (!productivity) {
      return res.status(404).json({ message: 'Productivity entry not found' });
    }
    res.status(200).json({ message: 'Productivity entry deleted successfully' });
  } catch (error) {
    console.error("Error deleting productivity entry:", error);
    res.status(500).json({ message: 'Error deleting productivity entry', error });
  }
};

module.exports = {
  createProductivity,
  getProductivityEntries,
  getProductivityById,
  updateProductivity,
  deleteProductivity,
};