const Finance = require('../models/Finance.model');

exports.getFinances = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'bakery') filter.bakeryId = req.user.bakeryId || req.query.bakeryId;
    else if (req.query.bakeryId) filter.bakeryId = req.query.bakeryId;

    const records = await Finance.find(filter).populate('bakeryId', 'name').sort({ date: -1 });

    // Calcular resumen de ganancias y gastos
    const summary = records.reduce(
      (acc, item) => {
        if (item.type === 'income') {
          acc.totalIncome += item.amount;
          acc.totalCommissions += item.commissionAmount || 0;
        } else {
          acc.totalExpense += item.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, totalCommissions: 0 }
    );
    summary.netProfit = summary.totalIncome - summary.totalExpense - summary.totalCommissions;

    res.json({ ok: true, summary, records });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener finanzas', error: error.message });
  }
};

exports.createFinanceRecord = async (req, res) => {
  try {
    const bakeryId = req.body.bakeryId || req.user.bakeryId;
    const record = await Finance.create({ ...req.body, bakeryId });
    res.status(201).json({ ok: true, message: 'Movimiento financiero registrado', record });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al registrar movimiento', error: error.message });
  }
};

exports.deleteFinanceRecord = async (req, res) => {
  try {
    await Finance.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: 'Registro financiero eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al eliminar registro' });
  }
};