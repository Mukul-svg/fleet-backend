const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', 
  authMiddleware, 
  roleMiddleware(['Admin', 'MaintenanceStaff']), 
  maintenanceController.scheduleMaintenance
);

router.get('/vehicle/:vehicleId', 
  authMiddleware, 
  roleMiddleware(['Admin', 'MaintenanceStaff', 'FleetManager']), 
  maintenanceController.getMaintenanceHistory
);

router.patch('/:maintenanceId/status', 
  authMiddleware, 
  roleMiddleware(['Admin', 'MaintenanceStaff']), 
  maintenanceController.updateMaintenanceStatus
);

router.get('/all',
  authMiddleware,
  roleMiddleware(['Admin', 'FleetManager', 'MaintenanceStaff']),
  maintenanceController.getAllMaintenanceRecords
);
module.exports = router;