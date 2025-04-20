const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const products = require('../data/productSeeds');

// MongoDB connection string - using MongoDB Atlas or local with auth
const db = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/indieHaat';

const seedDatabase = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected...');

        // Create a seller account for the products
        const seller = await User.findOneAndUpdate(
            { email: 'seller@test.com' },
            {
                name: 'Test Seller',
                email: 'seller@test.com',
                password: '$2a$10$YourHashedPasswordHere',
                role: 'seller'
            },
            { upsert: true, new: true }
        );

        // Add seller ID to each product
        const productsWithSeller = products.map(product => ({
            ...product,
            seller: seller._id
        }));

        // Clear existing products
        await Product.deleteMany({});

        // Insert new products
        await Product.insertMany(productsWithSeller);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDatabase();