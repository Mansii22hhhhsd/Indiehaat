const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },
});

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [CartItemSchema],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Calculate total cart price
CartSchema.methods.calculateTotal = function () {
    return this.items.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);
};

module.exports = mongoose.model('Cart', CartSchema);
