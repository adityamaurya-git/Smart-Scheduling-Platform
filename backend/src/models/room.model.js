const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: [true, "A unique room number is required (e.g., R101, L205)."],
        unique: true,
        trim: true,
        uppercase: true,
    },

    // ---------------------------------------------------------------------------------
    //  HARD CONSTRAINTS (Rules that CANNOT be violated)
    // ---------------------------------------------------------------------------------
    
    /**
     * @Constraint The maximum number of seats in the room. A course can only be
     * placed here if its studentCount <= capacity.
     */
    capacity: {
        type: Number,
        required: [true, "Room capacity is a mandatory constraint."],
        min: 1
    },

    /**
     * @Constraint The type of the room. This must match a course's `requiredRoomType`
     * for a valid assignment.
     */
    roomType: {
        type: String,
        required: true,
        enum: ['Lab', 'General Classroom']
    },
    
    /**
     * @Constraint Defines periods when the room is ABSOLUTELY unavailable
     * (e.g., for maintenance or other events).
     */
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

    // ---------------------------------------------------------------------------------
    //  SOFT CONSTRAINTS (Preferences for scoring schedule 'fitness')
    // ---------------------------------------------------------------------------------

    /**
     * @Preference A score indicating the quality of the room (e.g., new projector,
     * better seating). A Genetic Algorithm can reward schedules that use higher-
     * priority rooms.
     */
    // priorityScore: {
    //     type: Number,
    //     min: 1,
    //     max: 10,
    //     default: 5
    // }

}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;


// {
//   _id: ObjectId,
//   name: "R101",
//   capacity: 50,
//   type: "classroom",
//   features: ["Projector", "Whiteboard"]
// }