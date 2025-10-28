const mongoose = require('mongoose');

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
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'admin',
        required:true,
    }
}, { timestamps: true
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
