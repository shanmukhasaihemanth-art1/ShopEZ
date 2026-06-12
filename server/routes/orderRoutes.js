const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// User routes
router.post('/', protect, placeOrder);
router.get('/myorders', protect, getUserOrders);

// Admin only routes
router.get('/all', protect, isAdmin, getAllOrders);
router.put('/:id', protect, isAdmin, updateOrderStatus);

module.exports = router;