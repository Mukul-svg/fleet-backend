const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', 
  authMiddleware, 
  roleMiddleware(['Driver', 'FleetManager', 'Admin']), 
  incidentController.createIncident
);

router.patch('/:incidentId/status', 
  authMiddleware, 
  roleMiddleware(['FleetManager', 'Admin']), 
  incidentController.updateIncidentStatus
);

router.get('/vehicle/:vehicleId', 
  authMiddleware, 
  roleMiddleware(['FleetManager', 'Admin', 'Maintenance']), 
  incidentController.getIncidentsByVehicle
);
router.get('/all', 
  authMiddleware, 
  roleMiddleware(['FleetManager', 'Admin', 'Maintenance', 'Driver']), 
  incidentController.getAllIncidents
);

module.exports = router;