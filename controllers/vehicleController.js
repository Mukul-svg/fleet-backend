const Vehicle = require('../models/Vehicle');

exports.createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).send(vehicle);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateVehicleLocation = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { latitude, longitude } = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      vehicleId, 
      { 
        currentLocation: { latitude, longitude },
        status: 'In Use'
      }, 
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).send();
    }

    res.send(vehicle);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.send(vehicles);
  } catch (error) {
    res.status(500).send(error);
  }
};