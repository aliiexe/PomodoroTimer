const Notification = require('../models/Notification');

// Create a new notification
const createNotification = async (req, res) => {
  try {
    console.log("Creating a new notification:", req.body);
    const { userId, title, description, isRead } = req.body;
    const notification = new Notification({ userId, title, description, isRead });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: 'Error creating notification', error });
  }
}

// Get all notifications
const getNotifications = async (req, res) => {
  try {
    console.log("Fetching all notifications");
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

// Get a notification by ID
const getNotificationById = async (req, res) => {
  try {
    console.log("Fetching notification by ID:", req.params.id);
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ message: 'Error fetching notification', error });
  }
};

// Update a notification
const updateNotification = async (req, res) => {
  try {
    console.log("Updating notification:", req.params.id, req.body);
    const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: 'Error updating notification', error });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    console.log("Deleting notification:", req.params.id);
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: 'Error deleting notification', error });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
};