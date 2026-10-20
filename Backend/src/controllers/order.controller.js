const Order = require('../models/Order.model');
const Notification = require('../models/Notification.model');
const Finance = require('../models/Finance.model');

// Obtener pedidos filtrados según el rol del usuario
exports.getOrders = async (req, res) => {
  try {
    const filter = {};
    
    // Si es cliente, solo ve los suyos
    if (req.user.role === 'customer') filter.customerId = req.user.id;
    
    // Si es pastelería o empleado, ven los pedidos de su negocio
    if (req.user.role === 'bakery' || req.user.role === 'employee') {
      filter.bakeryId = req.user.bakeryId;
    }
    
    // Si es admin, ve todos por defecto (el filtro queda vacío {}), 
    // pero puede filtrar por una pastelería específica si lo envía por query
    if (req.user.role === 'admin' && req.query.bakeryId) {
      filter.bakeryId = req.query.bakeryId;
    }

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

const Product = require('../models/Product.model'); // Asegúrate de importar el modelo Product arriba

exports.createOrder = async (req, res) => {
  try {
    const { 
      bakeryId, orderType, items, customDetails, deliveryDate, 
      totalPrice, customerId, isPointOfSale, paymentMethod, deliveryMethod 
    } = req.body;
    
    // 1. Lógica dinámica para asignar el cliente
    let finalCustomerId;
    if (req.user.role === 'customer') {
      finalCustomerId = req.user.id;
    } else {
      if (!customerId) {
        return res.status(400).json({ ok: false, message: 'Falta proporcionar el customerId del cliente.' });
      }
      finalCustomerId = customerId;
    }

    const finalBakeryId = (req.user.role === 'bakery' || req.user.role === 'employee') ? req.user.bakeryId : bakeryId;

    // 2. Lógica de Estados (Auto-aprobación para ventas en local)
    let status = 'pending';
    if (orderType === 'custom') {
      // Si es personalizado pero se hizo en el local, se auto-aprueba (pasa a en preparación)
      status = isPointOfSale ? 'in_preparation' : 'pending_quote';
      if (isPointOfSale && customDetails) customDetails.isApproved = true;
    } else if (isPointOfSale) {
      // Si es un pastel de línea vendido en el momento, ya se entrega
      status = deliveryMethod === 'pickup' ? 'delivered' : 'in_preparation';
    }

    // 3. Restar Stock si es venta de mostrador de un pastel de línea
    if (isPointOfSale && orderType === 'standard' && items.length > 0) {
      for (let item of items) {
        const product = await Product.findById(item.productId);
        if (!product || product.stock < item.quantity) {
          return res.status(400).json({ 
            ok: false, 
            message: `No hay suficiente stock para el pastel: ${item.name}. Stock actual: ${product ? product.stock : 0}` 
          });
        }
        // Restar la cantidad vendida
        product.stock -= item.quantity;
        if (product.stock === 0) product.isAvailable = false; // Auto-desactivar si se acaba
        await product.save();
      }
    }

    const platformCommission = totalPrice ? +(totalPrice * 0.08).toFixed(2) : 0;

    // 4. Crear el pedido con los nuevos campos
    const order = await Order.create({
      customerId: finalCustomerId,
      bakeryId: finalBakeryId,
      assignedEmployeeId: (req.user.role === 'employee') ? req.user.id : null, // Se auto-asigna al empleado que hace la venta
      orderType,
      items,
      customDetails,
      status,
      deliveryDate,
      isPointOfSale: isPointOfSale || false,
      paymentMethod: paymentMethod || 'pending',
      deliveryMethod: deliveryMethod || 'pickup',
      totalPrice: totalPrice || 0,
      platformCommission
    });

    // 5. Registrar el ingreso financiero automáticamente si se pagó en el local
    if (isPointOfSale && status === 'delivered' && totalPrice > 0) {
      await Finance.create({
        bakeryId: finalBakeryId,
        orderId: order._id,
        type: 'income',
        concept: `Venta de mostrador #${order._id.toString().slice(-6)}`,
        amount: totalPrice,
        commissionAmount: platformCommission
      });
    }

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