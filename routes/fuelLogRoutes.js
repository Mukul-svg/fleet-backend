const express = require('express');
const router = express.Router();
const fuelLogController = require('../controllers/fuelLogController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', 
  authMiddleware, 
  roleMiddleware(['Driver', 'Admin', 'FleetManager']), 
  fuelLogController.createFuelLog
);

router.get('/vehicle/:vehicleId', 
  authMiddleware, 
  roleMiddleware(['Admin', 'FleetManager', 'Driver']), 
  fuelLogController.getFuelLogsByVehicle
);

router.get('/efficiency/:vehicleId', 
  authMiddleware, 
  roleMiddleware(['Admin', 'FleetManager']), 
  fuelLogController.calculateFuelEfficiency
);

router.post('/report', 
  authMiddleware, 
  roleMiddleware(['Admin', 'FleetManager']), 
  fuelLogController.generateFuelConsumptionReport
);

router.get('/all',
  authMiddleware,
  roleMiddleware(['Admin', 'FleetManager', 'Driver']),
  fuelLogController.getAllFuelLogs
);
module.exports = router;