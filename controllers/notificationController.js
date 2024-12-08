const Notification = require('../models/Notification');

exports.createNotification = async (userId, message, type, relatedEntity = null, priority = 'Low') => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      type,
      relatedEntity,
      priority
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Notification creation failed', error);
    return null;
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const { status, type, priority } = req.query;
    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    const notifications = await Notification.find(filter)
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving notifications', 
      error: error.message 
    });
  }
};

exports.updateNotificationStatus = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { status } = req.body;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.user._id },
      { status },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(400).json({ 
      message: 'Notification update failed', 
      error: error.message 
    });
  }
};