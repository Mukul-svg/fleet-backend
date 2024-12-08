const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  vehicle: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vehicle', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['Routine', 'Repair', 'Inspection'], 
    required: true 
  },
  description: { 
    type: String 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  cost: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'], 
    default: 'Scheduled' 
  },
  technician: { 
    type: String 
  },
  nextMaintenanceDate: { 
    type: Date 
  }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);