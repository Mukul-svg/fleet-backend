const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', 
  authMiddleware, 
  roleMiddleware(['FleetManager', 'Admin']), 
  reportController.generateReport
);

router.get('/total-data', 
  authMiddleware, 
  roleMiddleware(['FleetManager', 'Admin']), 
  reportController.getTotalData
);

router.get('/:reportId', 
  authMiddleware, 
  roleMiddleware(['FleetManager', 'Admin']), 
  reportController.getReportById
);

router.get('/', 
  authMiddleware, 
  roleMiddleware(['FleetManager', 'Admin']), 
  reportController.listReports
);

module.exports = router;