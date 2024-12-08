const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post(
  '/', 
  authMiddleware.authMiddleware, 
  roleMiddleware(['Admin', 'FleetManager']), 
  vehicleController.createVehicle
);

router.patch(
  '/:vehicleId/location', 
  authMiddleware.authMiddleware, 
  roleMiddleware(['Driver']), 
  vehicleController.updateVehicleLocation
);

router.get(
  '/', 
  authMiddleware.authMiddleware, 
  roleMiddleware(['Admin', 'FleetManager', 'Driver','MaintenanceStaff']), 
  vehicleController.getAllVehicles
);

module.exports = router;