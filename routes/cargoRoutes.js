const express = require('express');
const router = express.Router();
const cargoController = require('../controllers/cargoController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', 
  authMiddleware, 
  roleMiddleware(['Customer', 'Admin', 'FleetManager']), 
  cargoController.createCargo
);

router.patch('/:cargoId/status', 
  authMiddleware, 
  roleMiddleware(['Driver', 'Admin', 'FleetManager']), 
  cargoController.updateCargoStatus
);

router.get('/customer/:customerId', 
  authMiddleware, 
  roleMiddleware(['Customer', 'Admin', 'FleetManager']), 
  cargoController.getCargoByCustomer
);

router.get('/allcargo', 
  authMiddleware, 
  roleMiddleware(['Admin', 'FleetManager']), 
  cargoController.getAllCargo
);

module.exports = router;