const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', 
  authMiddleware, 
  roleMiddleware(['Admin', 'FleetManager']), 
  scheduleController.createSchedule
);

router.get('/driver/:driverId', 
  authMiddleware, 
  roleMiddleware(['Driver', 'Admin', 'FleetManager']), 
  scheduleController.getSchedulesByDriver
);

router.patch('/:scheduleId/status', 
  authMiddleware, 
  roleMiddleware(['Driver', 'Admin', 'FleetManager']), 
  scheduleController.updateScheduleStatus
);

router.get('/all',
  authMiddleware,
  roleMiddleware(['Admin', 'FleetManager']),
  scheduleController.getAllSchedules
);
module.exports = router;