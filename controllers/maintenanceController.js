const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

exports.scheduleMaintenance = async (req, res) => {
  try {
    const { vehicle, type, description, cost, technician, nextMaintenanceDate } = req.body;

    const maintenance = new Maintenance({
      vehicle,
      type,
      description,
      cost,
      technician,
      nextMaintenanceDate
    });

    await maintenance.save();

    // Update vehicle status
    await Vehicle.findByIdAndUpdate(vehicle, { status: 'Maintenance' });

    res.status(201).json(maintenance);
  } catch (error) {
    res.status(400).json({ message: 'Maintenance scheduling failed', error: error.message });
  }
};

exports.getMaintenanceHistory = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const maintenanceRecords = await Maintenance.find({ vehicle: vehicleId })
      .populate('vehicle');
    res.json(maintenanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving maintenance history', error: error.message });
  }
};

exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { maintenanceId } = req.params;
    const { status } = req.body;

    const maintenance = await Maintenance.findByIdAndUpdate(
      maintenanceId, 
      { status },
      { new: true }
    ).populate('vehicle');

    // Update vehicle status when maintenance is completed
    if (status === 'Completed') {
      await Vehicle.findByIdAndUpdate(maintenance.vehicle._id, { status: 'Available' });
    }

    res.json(maintenance);
  } catch (error) {
    res.status(400).json({ message: 'Maintenance update failed', error: error.message });
  }
};

exports.getAllMaintenanceRecords = async (req, res) => {
  try {
    const maintenanceRecords = await Maintenance.find()
      .populate('vehicle');
    res.json(maintenanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving maintenance records', error: error.message });
  }
};