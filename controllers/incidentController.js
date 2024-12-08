const Incident = require('../models/Incident');

exports.createIncident = async (req, res) => {
  try {
    const { 
      vehicle, 
      driver, 
      description, 
    } = req.body;

    const incident = new Incident({
      vehicle,
      driver,
      description,
    });

    await incident.save();
    res.status(201).json(incident);
  } catch (error) {
    res.status(400).json({ 
      message: 'Incident reporting failed', 
      error: error.message 
    });
  }
};

exports.updateIncidentStatus = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { resolutionStatus } = req.body;

    const incident = await Incident.findByIdAndUpdate(
      incidentId,
      { resolutionStatus },
      { new: true }
    );

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json(incident);
  } catch (error) {
    res.status(400).json({ 
      message: 'Incident status update failed', 
      error: error.message 
    });
  }
};

exports.getIncidentsByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const incidents = await Incident.find({ vehicle: vehicleId })
      .populate('vehicle', 'make model')
      .populate('driver', 'name');

    res.json(incidents);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving incidents', 
      error: error.message 
    });
  }
};

exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate('vehicle', 'make model')
      .populate('driver', 'name');

    res.json(incidents);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving incidents', 
      error: error.message 
    });
  }
};