const Bakery = require('../models/Bakery.model');
const User = require('../models/User.model');

// Listar todas las pastelerías (Clientes ven las activas, Admin ve todas)
exports.getBakeries = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { status: 'active' };
    const bakeries = await Bakery.find(filter).populate('ownerId', 'name email phone');
    res.json({ ok: true, bakeries });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener pastelerías', error: error.message });
  }
};

// Obtener una pastelería por ID
exports.getBakeryById = async (req, res) => {
  try {
    const bakery = await Bakery.findById(req.params.id).populate('ownerId', 'name email');
    if (!bakery) return res.status(404).json({ ok: false, message: 'Pastelería no encontrada' });
    res.json({ ok: true, bakery });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener pastelería' });
  }
};

// Crear pastelería y vincularla al usuario dueño
exports.createBakery = async (req, res) => {
  try {
    const { name, description, address, phone, logoUrl } = req.body;
    const bakery = await Bakery.create({
      name,
      description,
      address,
      phone,
      logoUrl,
      ownerId: req.user.id
    });

    await User.findByIdAndUpdate(req.user.id, { bakeryId: bakery._id });
    res.status(201).json({ ok: true, message: 'Pastelería creada exitosamente', bakery });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al crear pastelería', error: error.message });
  }
};

// Actualizar datos, estado o suscripción de la pastelería
exports.updateBakery = async (req, res) => {
  try {
    const bakery = await Bakery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ok: true, message: 'Pastelería actualizada', bakery });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al actualizar pastelería', error: error.message });
  }
};

// Eliminar pastelería (Admin)
exports.deleteBakery = async (req, res) => {
  try {
    await Bakery.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: 'Pastelería eliminada' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al eliminar pastelería' });
  }
};