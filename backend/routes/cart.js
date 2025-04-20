const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cartController = require('../controllers/cartController');

// @route   GET api/cart
// @desc    Get current user's cart
// @access  Private - Buyers only
router.get('/', auth, cartController.getCart);

// @route   POST api/cart
// @desc    Add product to cart
// @access  Private - Buyers only
router.post('/', auth, cartController.addToCart);

// @route   PUT api/cart/:productId
// @desc    Update cart item quantity
// @access  Private - Buyers only
router.put('/:productId', auth, cartController.updateCartItem);

// @route   DELETE api/cart/:productId
// @desc    Remove item from cart
// @access  Private - Buyers only
router.delete('/:productId', auth, cartController.removeCartItem);

// @route   DELETE api/cart
// @desc    Clear cart
// @access  Private - Buyers only
router.delete('/', auth, cartController.clearCart);

module.exports = router;
