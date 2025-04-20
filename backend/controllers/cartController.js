const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private - Buyers only
exports.getCart = async (req, res) => {
    try {
        // Check if user is a buyer
        if (req.user.role !== 'buyer') {
            return res.status(403).json({ msg: 'Access denied. Buyers only' });
        }

        // Find cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ user: req.user.id }).populate({
            path: 'items.product',
            select: 'title price image stock',
        });

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
            await cart.save();
        }

        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private - Buyers only
exports.addToCart = async (req, res) => {
    try {
        // Check if user is a buyer
        if (req.user.role !== 'buyer') {
            return res.status(403).json({ msg: 'Access denied. Buyers only' });
        }

        const { productId, quantity } = req.body;

        // Validate required fields
        if (!productId) {
            return res.status(400).json({ msg: 'Product ID is required' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Check if product is in stock
        if (product.stock < (quantity || 1)) {
            return res.status(400).json({ msg: 'Not enough stock available' });
        }

        // Find user's cart or create a new one
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        // Check if product already in cart
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            // Product exists in cart, update quantity
            cart.items[itemIndex].quantity += quantity || 1;
        } else {
            // Product not in cart, add new item
            cart.items.push({
                product: productId,
                quantity: quantity || 1,
            });
        }

        cart.updatedAt = Date.now();
        await cart.save();

        // Return updated cart with product details
        cart = await Cart.findOne({ user: req.user.id }).populate({
            path: 'items.product',
            select: 'title price image stock',
        });

        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private - Buyers only
exports.updateCartItem = async (req, res) => {
    try {
        // Check if user is a buyer
        if (req.user.role !== 'buyer') {
            return res.status(403).json({ msg: 'Access denied. Buyers only' });
        }

        const { quantity } = req.body;
        const productId = req.params.productId;

        // Validate quantity
        if (!quantity || quantity < 1) {
            return res.status(400).json({ msg: 'Quantity must be at least 1' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Check if product is in stock
        if (product.stock < quantity) {
            return res.status(400).json({ msg: 'Not enough stock available' });
        }

        // Find cart
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ msg: 'Item not found in cart' });
        }

        // Update quantity
        cart.items[itemIndex].quantity = quantity;
        cart.updatedAt = Date.now();

        await cart.save();

        // Return updated cart with product details
        cart = await Cart.findOne({ user: req.user.id }).populate({
            path: 'items.product',
            select: 'title price image stock',
        });

        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private - Buyers only
exports.removeCartItem = async (req, res) => {
    try {
        // Check if user is a buyer
        if (req.user.role !== 'buyer') {
            return res.status(403).json({ msg: 'Access denied. Buyers only' });
        }

        const productId = req.params.productId;

        // Find cart
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        // Remove item
        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );
        cart.updatedAt = Date.now();

        await cart.save();

        // Return updated cart with product details
        cart = await Cart.findOne({ user: req.user.id }).populate({
            path: 'items.product',
            select: 'title price image stock',
        });

        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private - Buyers only
exports.clearCart = async (req, res) => {
    try {
        // Check if user is a buyer
        if (req.user.role !== 'buyer') {
            return res.status(403).json({ msg: 'Access denied. Buyers only' });
        }

        // Find cart
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        // Clear items
        cart.items = [];
        cart.updatedAt = Date.now();

        await cart.save();

        res.json({ msg: 'Cart cleared', cart });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
