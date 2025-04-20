const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    try {
        if (req.user.role !== 'buyer') {
            return res.status(403).json({ msg: 'Access denied. Buyers only' });
        }

        const { productId, quantity, shippingAddress } = req.body;
        if (!productId || !quantity || !shippingAddress) {
            return res
                .status(400)
                .json({ msg: 'Please provide all required fields' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ msg: 'Not enough stock available' });
        }
        const totalPrice = product.price * quantity;
        const order = new Order({
            buyer: req.user.id,
            seller: product.seller,
            product: productId,
            quantity,
            totalPrice,
            shippingAddress,
            status: 'pending',
            paymentInfo: {
                method: 'credit card',
                transactionId: Math.random().toString(36).substring(2, 15),
            },
        });
        await order.save();
        product.stock -= quantity;
        await product.save();

        res.status(201).json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getBuyerOrders = async (req, res) => {
    try {
        if (req.user.role !== 'buyer') {
            return res.status(403).json({ msg: 'Access denied. Buyers only' });
        }

        const orders = await Order.find({ buyer: req.user.id })
            .populate('product', ['title', 'description', 'price', 'image'])
            .populate('seller', ['name', 'email']);

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.getSellerOrders = async (req, res) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({ msg: 'Access denied. Sellers only' });
        }

        const orders = await Order.find({ seller: req.user.id })
            .populate('product', ['title', 'description', 'price', 'image'])
            .populate('buyer', ['name', 'email']);

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('product', ['title', 'description', 'price', 'image'])
            .populate('buyer', ['name', 'email'])
            .populate('seller', ['name', 'email']);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        if (
            order.buyer.toString() !== req.user.id &&
            order.seller.toString() !== req.user.id
        ) {
            return res
                .status(403)
                .json({ msg: 'Access denied. Not your order' });
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.status(500).send('Server error');
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (
            !status ||
            !['pending', 'completed', 'cancelled'].includes(status)
        ) {
            return res.status(400).json({ msg: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        if (order.seller.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ msg: 'Access denied. Not your order to update' });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.status(500).send('Server error');
    }
};
