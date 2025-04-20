const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private - Seller only
exports.createProduct = async (req, res) => {
    try {
        // Check if user is a seller
        if (req.user.role !== 'seller') {
            return res.status(403).json({ msg: 'Access denied. Sellers only' });
        }

        const { title, description, price, category, image, stock } = req.body;

        // Basic validation
        if (!title || !description || !price || !category) {
            return res
                .status(400)
                .json({ msg: 'Please enter all required fields' });
        }

        const newProduct = new Product({
            seller: req.user.id,
            title,
            description,
            price,
            category,
            image: image || 'https://via.placeholder.com/150',
            stock: stock || 1,
        });

        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', [
            'name',
            'email',
        ]);
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            'seller',
            ['name', 'email']
        );

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server error');
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private - Seller only (owner)
exports.updateProduct = async (req, res) => {
    try {
        // Check if user is a seller
        if (req.user.role !== 'seller') {
            return res.status(403).json({ msg: 'Access denied. Sellers only' });
        }

        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Check if the seller owns the product
        if (product.seller.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ msg: 'Access denied. Not your product' });
        }

        const { title, description, price, category, image, stock } = req.body;

        // Update fields
        if (title) product.title = title;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) product.category = category;
        if (image) product.image = image;
        if (stock !== undefined) product.stock = stock;

        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server error');
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private - Seller only (owner)
exports.deleteProduct = async (req, res) => {
    try {
        // Check if user is a seller
        if (req.user.role !== 'seller') {
            return res.status(403).json({ msg: 'Access denied. Sellers only' });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Check if the seller owns the product
        if (product.seller.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ msg: 'Access denied. Not your product' });
        }

        await product.remove();
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server error');
    }
};

// @desc    Get seller's products
// @route   GET /api/products/seller
// @access  Private - Seller only
exports.getSellerProducts = async (req, res) => {
    try {
        // Check if user is a seller
        if (req.user.role !== 'seller') {
            return res.status(403).json({ msg: 'Access denied. Sellers only' });
        }

        const products = await Product.find({ seller: req.user.id });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
