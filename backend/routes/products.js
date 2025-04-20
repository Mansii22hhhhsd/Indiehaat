const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const productController = require('../controllers/productController');

// @route   POST api/products
// @desc    Create a new product
// @access  Private - Seller only
router.post('/', auth, productController.createProduct);

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getProducts);

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   PUT api/products/:id
// @desc    Update product
// @access  Private - Seller only (owner)
router.put('/:id', auth, productController.updateProduct);

// @route   DELETE api/products/:id
// @desc    Delete product
// @access  Private - Seller only (owner)
router.delete('/:id', auth, productController.deleteProduct);

// @route   GET api/products/seller/me
// @desc    Get seller's products
// @access  Private - Seller only
router.get('/seller/me', auth, productController.getSellerProducts);

module.exports = router;
