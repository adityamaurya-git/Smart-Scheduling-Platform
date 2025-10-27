const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
    name: {
        type: String, // e.g., 'A', 'B'
        required: true,
        trim: true,
    },
    year: {
        type: Number, // 1, 2, 3, 4
        required: true,
    },
    department: {
        type: mongoose.Schema.ObjectId,
        ref: 'Department',
        required: true,
    },
    // Subjects assigned to this section for the semester
    subjects: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
    }],
}, { timestamps: true });

// Ensure a section is unique for a given year and department
SectionSchema.index({ name: 1, year: 1, department: 1 }, { unique: true });

module.exports = mongoose.model('Section', SectionSchema);
