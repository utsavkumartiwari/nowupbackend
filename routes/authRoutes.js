const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyAdmin } = require('../middleware/auth');

// 1. Register Route (Ab 'verifyAdmin' ke sath secure hai)
router.post('/register', verifyAdmin, async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Email check karein ki pehle se toh nahi hai
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'author'
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User nahi mila" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Galat password" });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '1d' }
        );

        res.json({ 
            token, 
            role: user.role, 
            name: user.name,
            message: "Login Successful" 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Delete Author Route (Naya functionality)
router.delete('/delete-author/:id', verifyAdmin, async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
        
        if (!userToDelete) return res.status(404).json({ message: "Author nahi mila" });
        if (userToDelete.role === 'admin') return res.status(403).json({ message: "Admin ko delete nahi kiya ja sakta" });

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Author successfully delete ho gaya" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;