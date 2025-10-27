const mongoose = require('mongoose');

/**
 * =====================================================================================
 * COURSE SCHEMA
 * =====================================================================================
 * Defines a course to be scheduled. It contains hard constraints that the
 * scheduling engine must satisfy.
 * =====================================================================================
 */
const subjectSchema = new mongoose.Schema({
    subjectName: { 
        type: String, 
        required: true 

    },
    subjectCode: { 
        type: String, 
        required: true, 
        unique: true 

    },
    weeklyHours: { 
        type: Number, 
        required: true 

    },
    isLab: { 
        type: Boolean, 
        default: false 
    },
    assignedFaculty: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Faculty' 
        }
    ],
    requiredBatchSize: { 
        type: Number, 
        required: true 
    }
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
