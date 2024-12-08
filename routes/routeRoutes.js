const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Create a new route
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['Admin', 'FleetManager']),
  routeController.createRoute
);
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['Admin', 'FleetManager']),
  routeController.getAllRoutes
)
// Optimize a route
router.get(
  '/:routeId/optimize',
  authMiddleware,
  roleMiddleware(['Admin', 'FleetManager']),
  routeController.optimizeRoute
);

// Real-time adjustments
router.get(
  '/:routeId/adjust',
  authMiddleware,
  roleMiddleware(['Admin', 'FleetManager']),
  routeController.adjustRoute
);

module.exports = router;
