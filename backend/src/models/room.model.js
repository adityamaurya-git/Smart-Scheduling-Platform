const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: [true, "A unique room number is required (e.g., R101, L205)."],
        unique: true,
        trim: true,
        uppercase: true,
    },

    capacity: {
        type: Number,
        required: [true, "Room capacity is a mandatory constraint."],
        min: 1
    },

    roomType: {
        type: String,
        required: true,
        enum: ['Lab', 'General Classroom','Library','Seminar Hall']
    },
    
    unavailability: [{
        dayOfWeek: {
            type: String,
            required: true,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        },
        slots: [{
            type: String, // e.g., "12:00-13:00"
            required: true
        }]
    }],

    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'admin',
        required:true,
    }

}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

