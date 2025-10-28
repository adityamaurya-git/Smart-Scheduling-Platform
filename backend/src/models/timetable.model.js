const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    name: { 
        type: String,
         required: true 
    },
    generatedAt: { 
        type: Date, 
        default: Date.now 
    },
    score: { 
        type: Number 
    },
    classes: [{
        subject: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Subject' 
        },
        faculty: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Faculty' 
        },
        room: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Room' 
        },
        day: { 
            type: String 
            
        },
        timeSlot: { 
            type: String 
            
        }
    }],
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'admin',
        required:true,
    }
});

module.exports = mongoose.model('Timetable', timetableSchema);