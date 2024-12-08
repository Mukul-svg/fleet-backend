// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public Routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected Routes
router.get('/profile', 
  authMiddleware, 
  userController.getUserProfile
);

router.patch('/profile', 
  authMiddleware, 
  userController.updateUserProfile
);

// Admin-only Routes
router.patch('/:userId/status', 
  authMiddleware, 
  roleMiddleware(['Admin']), 
  userController.updateUserStatus
);

router.get('/drivers', 
  authMiddleware, 
  roleMiddleware(['Admin']), 
  userController.getAllDrivers
);

router.get('/allusers', 
  authMiddleware, 
  roleMiddleware(['Admin', 'FleetManager']), 
  userController.getAllUsers
);

module.exports = router;