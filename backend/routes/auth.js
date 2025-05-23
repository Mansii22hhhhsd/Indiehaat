const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
    // Check if req.body exists
    if (!req.body) {
        return res.status(400).json({ msg: 'Request body is missing' });
    }

    const { name, email, password, role } = req.body;

    // Check if required fields are provided
    if (!name || !email || !password || !role) {
        return res
            .status(400)
            .json({ msg: 'Please enter all required fields' });
    }

    // Validate role
    if (role !== 'buyer' && role !== 'seller') {
        return res
            .status(400)
            .json({ msg: 'Role must be either buyer or seller' });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
            role,
        });

        await user.save();

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        // Generate JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }, // Token expires in 7 days
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    // Check if req.body exists
    if (!req.body) {
        return res.status(400).json({ msg: 'Request body is missing' });
    }

    const { email, password } = req.body;

    // Check if required fields are provided
    if (!email || !password) {
        return res
            .status(400)
            .json({ msg: 'Please provide email and password' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        // Generate JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/user
// @desc    Get authenticated user
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
