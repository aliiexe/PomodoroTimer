const Session = require('../models/Session');

// Create a new session
const createSession = async (req, res) => {
  try {
    console.log("Creating a new session:", req.body);
    const { userId, date, startTime, endTime, duration, isCompleted, isAbandoned } = req.body;
    const session = new Session({ userId, date, startTime, endTime, duration, isCompleted, isAbandoned });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: 'Error creating session', error });
  }
}

// Get all sessions
const getSessions = async (req, res) => {
  try {
    console.log("Fetching all sessions");
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: 'Error fetching sessions', error });
  }
};

// Get a session by ID
const getSessionById = async (req, res) => {
  try {
    console.log("Fetching session by ID:", req.params.id);
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ message: 'Error fetching session', error });
  }
};

// Update a session
const updateSession = async (req, res) => {
  try {
    console.log("Updating session:", req.params.id, req.body);
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({ message: 'Error updating session', error });
  }
};

// Delete a session
const deleteSession = async (req, res) => {
  try {
    console.log("Deleting session:", req.params.id);
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ message: 'Error deleting session', error });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
};