const Department = require('../models/department.model');
const Subject = require('../models/subject.model');
const Faculty = require('../models/faculty.model');
const Room = require('../models/room.model');
const Section = require('../models/section.model');
const Timetable = require('../models/timetable.model');

const getStats = async (req, res) => {
    try {
        // Scope all counts to the current admin (multi-tenant isolation)
        const filter = { admin: req.admin?._id };

        const [departments, subjects, faculties, rooms, sections, timetables] = await Promise.all([
            Department.countDocuments(filter),
            Subject.countDocuments(filter),
            Faculty.countDocuments(filter),
            Room.countDocuments(filter),
            Section.countDocuments(filter),
            Timetable.countDocuments(filter),
        ]);

        res.status(200).json({ departments, subjects, faculties, rooms, sections, timetables });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

module.exports = { getStats };