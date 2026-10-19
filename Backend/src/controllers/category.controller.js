const Category = require('../models/Category.model');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ ok: true, categories });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener categorías' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ ok: true, message: 'Categoría creada', category });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al crear categoría', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ok: true, message: 'Categoría actualizada', category });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al actualizar categoría' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al eliminar categoría' });
  }
};