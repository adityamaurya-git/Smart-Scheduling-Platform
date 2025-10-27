const sectionModel = require('../models/section.model');

async function createSection(req ,res){
    console.log(req.body)
    const {name , year , department , subjects} = req.body;

    const isSectionAlreadyExists = await sectionModel.findOne({name});

    if(isSectionAlreadyExists){
        return res.status(400).json({
            message:"Section Already Exists",
        });
    }

    const section = await sectionModel.create({
        name,
        year,
        department,
        subjects
    })

    res.status(201).json({
        message:"Section Created Successfully",
        section,
    })
}

async function getAllSections(req, res) {
    try {
        const sections = await sectionModel.find({});
        res.status(200).json(sections);
    } catch (error) {
        res.status(500).json({ message: "Error fetching sections." });
    }
}

async function updateSection(req, res) {
    try {
        const { id } = req.params;
        const { name, year, department, subjects } = req.body;

        if (name) {
            const exists = await sectionModel.findOne({ name, _id: { $ne: id } });
            if (exists) return res.status(400).json({ message: 'Section name already in use.' });
        }

        const updated = await sectionModel.findByIdAndUpdate(
            id,
            { name, year, department, subjects },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Section not found.' });
        res.status(200).json({ message: 'Section updated successfully', section: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating section.' });
    }
}

async function deleteSection(req, res) {
    try {
        const { id } = req.params;
        const deleted = await sectionModel.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Section not found.' });
        res.status(200).json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting section.' });
    }
}


module.exports = {
    createSection,
    getAllSections,
    updateSection,
    deleteSection
}