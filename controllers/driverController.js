const Driver = require('../models/Driver');
const User = require('../models/User');

exports.getTotalDrivers = async (req, res) => {
  try {
    // Count all documents in the Driver collection
    const totalDrivers = await Driver.countDocuments();

    res.status(200).json({ totalDrivers });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving total drivers count', error: error.message });
  }
};

exports.createDriver = async (req, res) => {
  try {
    const { name, licenseNumber, contactInfo, licenseExpiry, userId } = req.body;

    // Verify user exists and is not already a driver
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingDriver = await Driver.findOne({ user: userId });
    if (existingDriver) {
      return res.status(400).json({ message: 'User is already registered as a driver' });
    }

    const driver = new Driver({
      name,
      licenseNumber,
      contactInfo,
      licenseExpiry,
      user: userId
    });

    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ message: 'Driver registration failed', error: error.message });
  }
};

exports.updateDriverRating = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { rating } = req.body;

    const driver = await Driver.findByIdAndUpdate(
      driverId, 
      { rating }, 
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    res.status(400).json({ message: 'Driver rating update failed', error: error.message });
  }
};

exports.getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id })
      .populate('user', '-password');

    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving driver profile', error: error.message });
  }
};

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find()
      .populate('user', '-password');

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving drivers', error: error.message });
  }
};