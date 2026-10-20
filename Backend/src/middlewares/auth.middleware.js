const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, message: 'No autorizado. Inicia sesión.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ ok: false, message: 'El usuario ya no existe.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ ok: false, message: `Tu cuenta está ${user.status}. Contacta a soporte.` });
    }

    req.user = {
      id: user._id,
      role: user.role,
      bakeryId: user.bakeryId,
      name: user.name
    };
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: 'Token inválido o expirado.' });
  }
};

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        ok: false,
        message: `El rol '${req.user.role}' no tiene permiso para realizar esta acción.`
      });
    }
    next();
  };
};