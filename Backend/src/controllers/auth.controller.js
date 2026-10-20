const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Generar JWT firmado
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, bakeryId: user.bakeryId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// 1. Registro de usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ ok: false, message: 'Este correo ya está registrado.' });
    }

    // Por seguridad, solo permitimos registrarse libremente como customer o bakery
    const safeRole = ['customer', 'bakery'].includes(role) ? role : 'customer';

    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      role: safeRole
    });

    const token = signToken(newUser);

    res.status(201).json({
      ok: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        bakeryId: newUser.bakeryId
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al registrar usuario', error: error.message });
  }
};

// 2. Iniciar sesión (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscamos el usuario e incluimos el password para compararlo
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Credenciales incorrectas.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ ok: false, message: 'Credenciales incorrectas.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ ok: false, message: `Cuenta ${user.status}. Acceso denegado.` });
    }

    const token = signToken(user);

    res.status(200).json({
      ok: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bakeryId: user.bakeryId
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al iniciar sesión', error: error.message });
  }
};

// 3. Obtener perfil del usuario actual
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ ok: true, user });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener perfil' });
  }
};