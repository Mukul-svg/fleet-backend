const mongoose = require('mongoose');
const ReportSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: [
      'Vehicle Utilization', 
      'Driver Performance', 
      'Fuel Efficiency', 
      'Maintenance Cost', 
      'Fleet Overview'
    ], 
    required: true 
  },
  generatedDate: { 
    type: Date, 
    default: Date.now 
  },
  data: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  startDate: { 
    type: Date 
  },
  endDate: { 
    type: Date 
  },
  parameters: { 
    type: mongoose.Schema.Types.Mixed 
  },
  status: { 
    type: String, 
    enum: ['Generated', 'Pending', 'Error'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);