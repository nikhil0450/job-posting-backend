const express = require('express');
const Notification = require('../models/Notification');

const router = express.Router();

// Get notifications
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ timestamp: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
