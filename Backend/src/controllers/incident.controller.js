const Incident = require('../models/Incident.model');

exports.getIncidents = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { reportedBy: req.user.id };
    const incidents = await Incident.find(filter)
      .populate('reportedBy', 'name email role')
      .populate('bakeryId', 'name')
      .sort({ createdAt: -1 });
    res.json({ ok: true, incidents });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener incidencias' });
  }
};

exports.createIncident = async (req, res) => {
  try {
    const incident = await Incident.create({
      ...req.body,
      reportedBy: req.user.id
    });
    res.status(201).json({ ok: true, message: 'Incidencia reportada', incident });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al crear incidencia', error: error.message });
  }
};

exports.updateIncident = async (req, res) => {
  try {
    const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ok: true, message: 'Incidencia actualizada', incident });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al actualizar incidencia' });
  }
};

exports.deleteIncident = async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: 'Incidencia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al eliminar incidencia' });
  }
};