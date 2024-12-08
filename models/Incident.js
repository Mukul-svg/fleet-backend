const mongoose = require('mongoose');
const IncidentSchema = new mongoose.Schema({
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
  date: { 
    type: Date, 
    default: Date.now 
  },
  description: { 
    type: String, 
    required: true 
  },
  resolutionStatus: { 
    type: String, 
    enum: ['Reported', 'Under Investigation', 'Resolved', 'Closed'], 
    default: 'Reported' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Incident', IncidentSchema);