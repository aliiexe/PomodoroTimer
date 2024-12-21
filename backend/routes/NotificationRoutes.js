const express = require('express');
const {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
} = require('../controllers/NotificationController');

const router = express.Router();

router.post('/', createNotification);
router.get('/', getNotifications);
router.get('/:id', getNotificationById);
router.put('/:id', updateNotification);
router.delete('/:id', deleteNotification);

module.exports = router;
