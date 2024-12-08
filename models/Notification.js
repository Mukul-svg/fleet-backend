const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: [
      'Schedule Update', 
      'Maintenance Reminder', 
      'Delivery Delay', 
      'Incident', 
      'System Alert'
    ], 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['Unread', 'Read', 'Archived'], 
    default: 'Unread' 
  },
  relatedEntity: {
    entityType: { 
      type: String 
    },
    entityId: { 
      type: mongoose.Schema.Types.ObjectId 
    }
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Low' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);