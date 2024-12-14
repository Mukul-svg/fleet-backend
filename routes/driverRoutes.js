const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', 
  authMiddleware, 
  roleMiddleware(['Admin']), 
  driverController.createDriver
);

router.get('/', 
  authMiddleware, 
  roleMiddleware(['Admin', 'FleetManager','Driver']), 
  driverController.getAllDrivers
);

router.get('/assigned-cargo',
  authMiddleware,
  roleMiddleware(['Driver']),
  driverController.getAssignedCargo
);

router.patch('/:driverId/rating', 
  authMiddleware, 
  roleMiddleware(['Admin', 'FleetManager']), 
  driverController.updateDriverRating
);

router.get('/profile', 
  authMiddleware, 
  roleMiddleware(['Driver']), 
  driverController.getDriverProfile
);

router.get('/total',
  authMiddleware,
  roleMiddleware(['Admin','FleetManager']),
  driverController.getTotalDrivers
);

module.exports = router;