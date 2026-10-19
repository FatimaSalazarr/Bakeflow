const Product = require('../models/Product.model');

exports.getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.bakeryId) filter.bakeryId = req.query.bakeryId;
    if (req.query.categoryId) filter.categoryId = req.query.categoryId;

    const products = await Product.find(filter)
      .populate('bakeryId', 'name')
      .populate('categoryId', 'name');
    res.json({ ok: true, products });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener el menú de pasteles' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const bakeryId = req.body.bakeryId || req.user.bakeryId;
    const product = await Product.create({ ...req.body, bakeryId });
    res.status(201).json({ ok: true, message: 'Pastel agregado al menú', product });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al crear producto', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ok: true, message: 'Pastel actualizado', product });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al actualizar producto' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: 'Pastel eliminado del menú' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al eliminar producto' });
  }
};