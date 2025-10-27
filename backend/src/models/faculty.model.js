// const mongoose = require('mongoose');

// const facultySchema = new mongoose.Schema({
//     employeeId: {
//         type: String,
//         required: [true, "An employee ID is required."],
//         unique: true,
//         trim: true,
//     },
//     facultyName: {
//         type: String,
//         required: [true, "Faculty name is required."],
//         trim: true,
//     },
//     department:{
//         type:String,
//         required:true,
//     },
//     teachingLoad:{
//         type:String,
//         required:true,
//     },

//     // ---------------------------------------------------------------------------------
//     //  HARD CONSTRAINTS (Rules tha t CANNOT be violated)
//     // ---------------------------------------------------------------------------------

//     /**
//      * @Constraint Defines which subjects the faculty is qualified to teach.
//      * The scheduling engine will ONLY assign courses from this list to this faculty.
//      */
//     specializedSubjects: [{
//         // type: mongoose.Schema.Types.ObjectId,
//         type:Array,
//         // ref: 'Course', // Assumes you have a 'Course' model
//         required: true
//     }], 


// }, { timestamps: true });


// const Faculty = mongoose.model('Faculty', facultySchema);

// module.exports = Faculty;


// // {
// //   _id: ObjectId,
// //   name: "Dr. Jane Doe",
// //   department: "Computer Science",
// //   teachingLoad: 15, // hours per week
// //   subjects: ["Algorithms", "Data Structures"],
// //   availability: [{ day: "Mon", start: "09:00", end: "17:00" }]
// // }


const mongoose = require('mongoose');


const facultySchema = new mongoose.Schema({

    employeeId: {
        type: String,
        required: [true, "An employee ID is required."],
        unique: true,
        trim: true,
    },


    facultyName: {
        type: String,
        required: [true, "Faculty name is required."],
        trim: true,
    },

    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department', // Assumes you have a 'Department' model
        required: [true, "Department is required."],
    },


    teachingLoad: {
        type: Number,
        required: [true, "Teaching load (hours per week) is required."],
        min: [1, "Teaching load must be at least 1 hour."],
    },


    specializedSubjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject', // Assumes you have a 'Subject' model
    }],


    availability: [{
        day: {
            type: String,
            required: true,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        _id: false // Prevents Mongoose from creating an _id for each availability entry
    }],

}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});


const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;

