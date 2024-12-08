const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  licenseNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  contactInfo: { 
    phone: String, 
    email: String 
  },
  rating: { 
    type: Number, 
    min: 0, 
    max: 5, 
    default: 3 
  },
  status: { 
    type: String, 
    enum: ['Available', 'Assigned', 'On Leave', 'Suspended'], 
    default: 'Available' 
  },
  licenseExpiry: { 
    type: Date, 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
});

module.exports = mongoose.model('Driver', DriverSchema);