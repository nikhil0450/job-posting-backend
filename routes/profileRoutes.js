const express = require('express');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Get user profile
router.get('/', protect, async (req, res) => {
    res.status(200).json(req.user);
});

// Update user profile
router.put('/', protect, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        res.status(200).json({ message: 'Profile updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete user profile
router.delete('/', protect, async(req, res)=> {
    try {
        // Find and delete the user by their ID
        const deletedUser = await User.findByIdAndDelete(req.user._id);
        
        // If no user is found, return a 404 error
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with success message
        res.status(200).json({ message: 'User profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

module.exports = router;
