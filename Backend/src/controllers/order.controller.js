const Order = require('../models/Order.model');
const Notification = require('../models/Notification.model');
const Finance = require('../models/Finance.model');

// Obtener pedidos filtrados según el rol del usuario
exports.getOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'customer') filter.customerId = req.user.id;
    if (req.user.role === 'bakery') filter.bakeryId = req.user.bakeryId || req.query.bakeryId;
    if (req.user.role === 'employee') filter.assignedEmployeeId = req.user.id;

    const orders = await Order.find(filter)
      .populate('customerId', 'name email phone')
      .populate('bakeryId', 'name phone')
      .populate('assignedEmployeeId', 'name email')
      .sort({ deliveryDate: 1 });

    res.json({ ok: true, orders });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener pedidos', error: error.message });
  }
};

// Cliente: Crear pedido normal o personalizado
exports.createOrder = async (req, res) => {
  try {
    const { bakeryId, orderType, items, customDetails, deliveryDate, totalPrice } = req.body;
    const status = orderType === 'custom' ? 'pending_quote' : 'pending';
    const platformCommission = totalPrice ? +(totalPrice * 0.08).toFixed(2) : 0;

    const order = await Order.create({
      customerId: req.user.id,
      bakeryId,
      orderType,
      items,
      customDetails,
      status,
      deliveryDate,
      totalPrice: totalPrice || 0,
      platformCommission
    });

    res.status(201).json({ ok: true, message: 'Pedido registrado exitosamente', order });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al crear el pedido', error: error.message });
  }
};

// Pastelería / Empleado: Cambiar estado, asignar empleado o aprobar cotización personalizada
exports.updateOrder = async (req, res) => {
  try {
    const { status, assignedEmployeeId, customDetails, totalPrice } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ ok: false, message: 'Pedido no encontrado' });

    if (status) order.status = status;
    if (assignedEmployeeId) {
      order.assignedEmployeeId = assignedEmployeeId;
      await Notification.create({
        userId: assignedEmployeeId,
        orderId: order._id,
        title: 'Nuevo pedido asignado',
        message: `Se te ha asignado un pedido para entrega el ${new Date(order.deliveryDate).toLocaleDateString()}.`
      });
    }
    if (customDetails) {
      order.customDetails = { ...order.customDetails.toObject(), ...customDetails };
    }
    if (totalPrice !== undefined) {
      order.totalPrice = totalPrice;
      order.platformCommission = +(totalPrice * 0.08).toFixed(2);
    }

    await order.save();

    // Notificar automáticamente al cliente cuando cambia el estado
    if (status) {
      const statusText = {
        pending: 'Cotización aprobada y pendiente de preparación',
        in_preparation: 'En preparación 🎂',
        ready: '¡Listo para recoger/entregar! 🎉',
        delivered: 'Entregado',
        cancelled: 'Cancelado'
      };
      await Notification.create({
        userId: order.customerId,
        orderId: order._id,
        title: 'Actualización de tu pedido',
        message: `El estado de tu pedido ahora es: ${statusText[status] || status}`
      });

      // Si se entrega, registrar el ingreso automáticamente en Finanzas
      if (status === 'delivered' && order.totalPrice > 0) {
        await Finance.create({
          bakeryId: order.bakeryId,
          orderId: order._id,
          type: 'income',
          concept: `Venta de pedido #${order._id.toString().slice(-6)}`,
          amount: order.totalPrice,
          commissionAmount: order.platformCommission
        });
      }
    }

    res.json({ ok: true, message: 'Pedido actualizado correctamente', order });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Error al actualizar pedido', error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: 'Pedido eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al eliminar pedido' });
  }
};