const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', authorizeRoles('admin', 'bakery'), userController.getUsers);
router.put('/profile', userController.updateProfile);
router.post('/cards', authorizeRoles('customer'), userController.addCard);
router.delete('/cards/:cardId', authorizeRoles('customer'), userController.removeCard);
router.post('/employees', authorizeRoles('bakery', 'admin'), userController.createEmployee);
router.patch('/:id/status', authorizeRoles('admin'), userController.updateUserStatus);
router.delete('/:id', authorizeRoles('admin', 'bakery'), userController.deleteUser);

module.exports = router;