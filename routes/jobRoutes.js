const express = require('express');
const Job = require('../models/Job');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Create a job post
router.post('/', protect, async (req, res) => {
    const { company, role, salary, experience, contactEmail, location } = req.body; 

    // Check for all required fields
    if (!company || !role || !salary || !experience || !contactEmail || !location) {
        return res.status(400).json({ message: 'All fields are required, including location.' });
    }

    try {
        const job = await Job.create({
            company,
            role,
            salary,
            experience,
            contactEmail,
            location, 
            postedBy: req.user._id, 
        });
        res.status(201).json({ message: 'Job posted successfully', job });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});


// Get all job posts
router.get('/', protect, async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'username email');
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Fetch jobs posted by the authenticated user
router.get('/my', protect, async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id }).populate('postedBy', 'username email');
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


// Update a job post
router.put('/:id', protect, async (req, res) => {
    const { id } = req.params;
    const { company, role, salary, experience, contactEmail, location } = req.body;

    try {
        const job = await Job.findOneAndUpdate(
            { _id: id, postedBy: req.user._id },
            { company, role, salary, experience, contactEmail, location },
            { new: true } 
        );

        if (!job) {
            return res.status(404).json({ message: 'Job not found or not authorized' });
        }

        res.status(200).json({ message: 'Job updated successfully', job });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


// Delete a job post
router.delete('/:id', protect, async (req, res) => {
    const { id } = req.params;

    try {
        const job = await Job.findById(id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.postedBy.toString() !== req.user._id.toString())
            return res.status(403).json({ message: 'Unauthorized' });

        await Job.findByIdAndDelete(id);
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
