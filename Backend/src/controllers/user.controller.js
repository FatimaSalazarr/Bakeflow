const User = require('../models/User.model');

// Obtener todos los usuarios (Admin o Dueño de pastelería viendo sus empleados)
exports.getUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'bakery') {
      filter.bakeryId = req.user.bakeryId;
      filter.role = 'employee';
    } else if (req.query.role) {
      filter.role = req.query.role;
    }
    const users = await User.find(filter).populate('bakeryId', 'name');
    res.json({ ok: true, users });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener usuarios', error: error.message });
  }
};

// Actualizar perfil propio (Cliente, Empleado, Pastelería, Admin)
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true, runValidators: true }
    );
    res.json({ ok: true, message: 'Perfil actualizado', user });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al actualizar perfil', error: error.message });
  }
};

// Registrar tarjeta del cliente
exports.addCard = async (req, res) => {
  try {
    const { cardHolder, last4, brand, expiryDate } = req.body;
    const user = await User.findById(req.user.id);
    user.savedCards.push({ cardHolder, last4, brand, expiryDate });
    await user.save();
    res.status(201).json({ ok: true, message: 'Tarjeta registrada', savedCards: user.savedCards });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al guardar tarjeta', error: error.message });
  }
};

// Eliminar tarjeta del cliente
exports.removeCard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedCards = user.savedCards.filter(c => c._id.toString() !== req.params.cardId);
    await user.save();
    res.json({ ok: true, message: 'Tarjeta eliminada', savedCards: user.savedCards });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al eliminar tarjeta' });
  }
};

// Pastelería: Crear empleado
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const employee = await User.create({
      name,
      email,
      password,
      phone,
      role: 'employee',
      bakeryId: req.user.bakeryId
    });
    res.status(201).json({ ok: true, message: 'Empleado registrado en la pastelería', employee });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al crear empleado', error: error.message });
  }
};

// Admin: Cambiar estado de cuenta (active, suspended, blocked) o rol
exports.updateUserStatus = async (req, res) => {
  try {
    const { status, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(role && { role }) },
      { new: true }
    );
    res.json({ ok: true, message: 'Usuario actualizado por el administrador', user });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar usuario o empleado
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al eliminar usuario' });
  }
};