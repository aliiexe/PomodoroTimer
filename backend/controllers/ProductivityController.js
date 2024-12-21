const Productivity = require('../models/Productivity');

// Create a new productivity entry
const createProductivity = async (req, res) => {
  try {
    const { userId, task, duration, date } = req.body;
    const productivity = new Productivity({ userId, task, duration, date });
    await productivity.save();
    res.status(201).json(productivity);
  } catch (error) {
    res.status(500).json({ message: 'Error creating productivity entry', error });
  }
};

// Get all productivity entries
const getProductivityEntries = async (req, res) => {
  try {
    const productivityEntries = await Productivity.find();
    res.status(200).json(productivityEntries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching productivity entries', error });
  }
};

// Get a productivity entry by ID
const getProductivityById = async (req, res) => {
  try {
    const productivity = await Productivity.findById(req.params.id);
    if (!productivity) {
      return res.status(404).json({ message: 'Productivity entry not found' });
    }
    res.status(200).json(productivity);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching productivity entry', error });
  }
};

// Update a productivity entry
const updateProductivity = async (req, res) => {
  try {
    const productivity = await Productivity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!productivity) {
      return res.status(404).json({ message: 'Productivity entry not found' });
    }
    res.status(200).json(productivity);
  } catch (error) {
    res.status(500).json({ message: 'Error updating productivity entry', error });
  }
};

// Delete a productivity entry
const deleteProductivity = async (req, res) => {
  try {
    const productivity = await Productivity.findByIdAndDelete(req.params.id);
    if (!productivity) {
      return res.status(404).json({ message: 'Productivity entry not found' });
    }
    res.status(200).json({ message: 'Productivity entry deleted successfully' });
  } catch (error) {
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
