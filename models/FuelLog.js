const mongoose = require('mongoose');

const FuelLogSchema = new mongoose.Schema({
  vehicle: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vehicle', 
    required: true 
  },
  driver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Driver', 
    required: true 
  },
  fuelType: { 
    type: String, 
    enum: ['Diesel', 'Petrol', 'Electric', 'Hybrid'], 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  cost: { 
    type: Number, 
    required: true 
  },
  location: { 
    type: String 
  },
  odometer: { 
    type: Number 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('FuelLog', FuelLogSchema);