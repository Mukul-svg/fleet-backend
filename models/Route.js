const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  RouteId: {
    type: String,
    required: true,
    unique: true,
  },
  Source: {
    type: String,
    required: true,
  },
  Destination: {
    type: String,
    required: true,
  },
  Distance: {
    type: Number, // in kilometers
    required: true,
  },
  EstimatedTime: {
    type: Number, // in minutes
    required: true,
  },
  VehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
});

module.exports = mongoose.model('Route', RouteSchema);
