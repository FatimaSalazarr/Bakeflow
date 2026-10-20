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

// Obtener TODAS las notificaciones del sistema (Solo Admin)
exports.getAllNotifications = async (req, res) => {
  try {
    if (req.user.role === 'customer') {
      return res.status(403).json({
        ok: false,
        message: 'No tienes permisos para ver todas las notificaciones'
      });
    }

    const notifications = await Notification.find({})
      .populate('userId', 'name email role') // Opcional: trae datos del usuario
      .sort({ createdAt: -1 });

    res.json({
      ok: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener todas las notificaciones',
      error: error.message
    });
  }
};

exports.createNotification = async (req, res) => {
  try {
    // Bloquear si el usuario logueado es un 'customer' / cliente
    if (req.user.role === 'customer') {
      return res.status(403).json({
        ok: false,
        message: 'No tienes permisos para crear notificaciones'
      });
    }

    const { userId, title, message, type } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({
        ok: false,
        message: 'userId, title y message son obligatorios'
      });
    }

    const newNotification = new Notification({
      userId,
      title,
      message,
      type: type || 'system',
      isRead: false
    });

    await newNotification.save();

    res.status(201).json({
      ok: true,
      message: 'Notificación creada exitosamente',
      notification: newNotification
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al crear la notificación',
      error: error.message
    });
  }
};