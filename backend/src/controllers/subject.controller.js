
const subjectModel = require('../models/subject.model');

async function createSubject(req, res){
    const {subjectName,subjectCode,weeklyHours,isLab,assignedFaculty,requiredBatchSize} = req.body;
    const isSubjectAlreadyExists = await subjectModel.findOne({subjectName});

    if(isSubjectAlreadyExists){
        return res.status(401).json({
            message:"Subject Already Exist."
        })
    }

    const subject = await subjectModel.create({
        subjectName,
        subjectCode,
        weeklyHours,
        isLab,
        assignedFaculty,
        requiredBatchSize,
        admin:req.admin._id,
    })
    await subject.save();
    res.status(201).json({
        message:"Course created successfully.",
        subject
    })
}

async function getAllSubjects(req, res) {
    try {
        const subjects = await subjectModel.find({admin:req.admin._id});
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subjects." });
    }
}

async function updateSubject(req, res) {
    try {
        const { id } = req.params;
        const { subjectName, subjectCode, weeklyHours, isLab, assignedFaculty, requiredBatchSize } = req.body;

        if (subjectName) {
            const exists = await subjectModel.findOne({ admin:req.admin._id, subjectName, _id: { $ne: id } });
            if (exists) return res.status(400).json({ message: 'Subject name already in use.' });
        }

        const updated = await subjectModel.findByIdAndUpdate(
            id,
            { subjectName, subjectCode, weeklyHours, isLab, assignedFaculty, requiredBatchSize },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Subject not found.' });
        res.status(200).json({ message: 'Subject updated successfully.', subject: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating subject.' });
    }
}

async function deleteSubject(req, res) {
    try {
        const { id } = req.params;
        const deleted = await subjectModel.findByIdAndDelete(id, {admin:req.admin._id});
        if (!deleted) return res.status(404).json({ message: 'Subject not found.' });
        res.status(200).json({ message: 'Subject deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subject.' });
    }
}

module.exports = {
    createSubject,
    getAllSubjects,
    updateSubject,
    deleteSubject
}