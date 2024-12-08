const Schedule = require('../models/Schedule');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Cargo = require('../models/Cargo');

exports.createSchedule = async (req, res) => {
  try {
    const { vehicle, driver, route, startTime, endTime, cargo } = req.body;

    // Check vehicle availability
    const vehicleCheck = await Vehicle.findById(vehicle);
    if (vehicleCheck.status !== 'Available') {
      return res.status(400).json({ message: 'Vehicle is not available' });
    }

    // Check driver availability
    const driverCheck = await Driver.findById(driver);
    if (driverCheck.status !== 'Available') {
      return res.status(400).json({ message: 'Driver is not available' });
    }

    const schedule = new Schedule({
      vehicle,
      driver,
      route,
      startTime,
      endTime,
      cargo
    });

    await schedule.save();

    // Update vehicle and driver status
    await Vehicle.findByIdAndUpdate(vehicle, { status: 'In Use' });
    await Driver.findByIdAndUpdate(driver, { status: 'Assigned' });
    await Cargo.findByIdAndUpdate(cargo, { status: 'In Transit' });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ message: 'Schedule creation failed', error: error.message });
  }
};

exports.getSchedulesByDriver = async (req, res) => {
  try {
    const schedules = await Schedule.find({ driver: req.params.driverId })
      .populate('vehicle')
      .populate('route')
      .populate('cargo');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving schedules', error: error.message });
  }
};

exports.updateScheduleStatus = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { status } = req.body;

    const schedule = await Schedule.findByIdAndUpdate(
      scheduleId, 
      { status },
      { new: true }
    ).populate('vehicle').populate('driver');

    if (status === 'Completed') {
      await Vehicle.findByIdAndUpdate(schedule.vehicle._id, { status: 'Available' });
      await Driver.findByIdAndUpdate(schedule.driver._id, { status: 'Available' });
    }

    res.json(schedule);
  } catch (error) {
    res.status(400).json({ message: 'Schedule update failed', error: error.message });
  }
};

exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('vehicle')
      .populate('driver')
      .populate('route')
      .populate('cargo');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving schedules', error: error.message });
  }
};