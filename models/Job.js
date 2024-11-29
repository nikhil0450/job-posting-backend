const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    salary: { type: String, required: true },
    location: {type: String, required: true},
    experience: { type: String, required: true },
    contactEmail: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);
