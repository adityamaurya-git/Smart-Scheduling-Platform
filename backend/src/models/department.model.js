const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a department name'],
        unique: true,
        trim: true,
    },
    code: {
        type: String,
        required: [true, 'Please add a department code'],
        unique: true,
        trim: true,
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'admin',
        required:true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);
