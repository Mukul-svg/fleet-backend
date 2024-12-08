const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  make: { 
    type: String, 
    required: true 
  },
  model: { 
    type: String, 
    required: true 
  },
  licensePlate: { 
    type: String, 
    required: true, 
    unique: true 
  },
  status: { 
    type: String, 
    enum: ['Available', 'In Use', 'Maintenance', 'Unavailable'], 
    default: 'Available' 
  },
  currentLocation: {
    latitude: Number,
    longitude: Number
  },
  year: Number,
  fuelType: String,
  capacity: Number
});

module.exports = mongoose.model('Vehicle', VehicleSchema);