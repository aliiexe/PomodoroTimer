const Goal = require('../models/Goal');

// const GoalSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   title: { type: String, required: true },
//   description: { type: String },
//   targetStudyTime: { type: Number, required: true },
//   progress: { type: Number, default: 0 },
//   status: { type: String, enum: ["in progress", "completed", "abandoned"], default: "in progress" },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// Create a new goal
const createGoal = async (req, res) => {
  try {
    console.log("Creating a new goal:", req.body);
    const { userId, title, description, targetStudyTime } = req.body;
    const goal = new Goal({ userId, title, description, targetStudyTime });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ message: 'Error creating goal', error });
  }
}


// Get all goals
const getGoals = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("Fetching all goals for user:", userId);
    const goals = await Goal.find({ userId });
    res.status(200).json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ message: 'Error fetching goals', error });
  }
};

// Get a single goal by ID
const getGoalById = async (req, res) => {
  try {
    console.log("Fetching goal by ID:", req.params.id);
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(200).json(goal);
  } catch (error) {
    console.error("Error fetching goal:", error);
    res.status(500).json({ message: 'Error fetching goal', error });
  }
};

// Update a goal
const updateGoal = async (req, res) => {
  try {
    console.log("Updating goal:", req.params.id, req.body);
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(200).json(goal);
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ message: 'Error updating goal', error });
  }
};

// Delete a goal
const deleteGoal = async (req, res) => {
  try {
    console.log("Deleting goal:", req.params.id);
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ message: 'Error deleting goal', error });
  }
};

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};