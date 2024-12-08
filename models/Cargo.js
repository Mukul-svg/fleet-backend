const mongoose = require('mongoose');

const CargoSchema = new mongoose.Schema({
  description: { 
    type: String, 
    required: true 
  },
  weight: { 
    type: Number, 
    required: true 
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  type: { 
    type: String, 
    enum: ['Fragile', 'Hazardous', 'Standard', 'Refrigerated'], 
    default: 'Standard' 
  },
  destination: { 
    type: String, 
    required: true 
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  deliveryStatus: { 
    type: String, 
    enum: ['Pending', 'In Transit', 'Delivered', 'Delayed'], 
    default: 'Pending' 
  },
  specialInstructions: { 
    type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model('Cargo', CargoSchema);