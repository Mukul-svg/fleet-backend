const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', 
  authMiddleware, 
  notificationController.getUserNotifications
);

router.patch('/:notificationId', 
  authMiddleware, 
  notificationController.updateNotificationStatus
);

module.exports = router;