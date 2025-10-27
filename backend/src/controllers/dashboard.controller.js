const Department = require('../models/department.model');
const Subject = require('../models/subject.model');
const Faculty = require('../models/faculty.model');
const Room = require('../models/room.model');

const getStats = async (req, res) => {
    try {
        const departments = await Department.countDocuments();
        const subjects = await Subject.countDocuments();
        const faculties = await Faculty.countDocuments();
        const rooms = await Room.countDocuments();

        res.status(200).json({ departments, subjects, faculties, rooms });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

module.exports = { getStats };