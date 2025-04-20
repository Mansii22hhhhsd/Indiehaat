const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// @route   POST api/orders
// @desc    Create a new order
// @access  Private - Buyers only
router.post('/', auth, orderController.createOrder);

// @route   GET api/orders/buyer
// @desc    Get buyer's orders
// @access  Private - Buyers only
router.get('/buyer', auth, orderController.getBuyerOrders);

// @route   GET api/orders/seller
// @desc    Get seller's orders
// @access  Private - Sellers only
router.get('/seller', auth, orderController.getSellerOrders);

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private - Buyer/Seller involved in the order
router.get('/:id', auth, orderController.getOrderById);

// @route   PUT api/orders/:id/status
// @desc    Update order status
// @access  Private - Seller of the order
router.put('/:id/status', auth, orderController.updateOrderStatus);

module.exports = router;
