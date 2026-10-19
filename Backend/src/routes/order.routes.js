const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', orderController.getOrders);
router.post('/', authorizeRoles('customer', 'admin'), orderController.createOrder);
router.put('/:id', authorizeRoles('bakery', 'employee', 'admin'), orderController.updateOrder);
router.delete('/:id', authorizeRoles('bakery', 'admin'), orderController.deleteOrder);

module.exports = router;