const Notification = require('../models/Notification.model');

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ ok: true, notifications });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener notificaciones' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );
    res.json({ ok: true, notification });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al actualizar notificación' });
  }
};