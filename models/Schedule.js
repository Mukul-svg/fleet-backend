const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
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
  route: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Route', 
    required: true 
  },
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'], 
    default: 'Scheduled' 
  },
  cargo: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cargo' 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Schedule', ScheduleSchema);