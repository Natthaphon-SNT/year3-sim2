const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware.js');

router.post('/login', userController.login);
router.get('/profile', verifyToken, userController.getMyProfile);

// Admin Only
router.get('/admin/users', verifyToken, isAdmin, userController.adminGetAllUsers);
router.put('/admin/users/:id', verifyToken, isAdmin, userController.adminUpdateUser);

module.exports = router;