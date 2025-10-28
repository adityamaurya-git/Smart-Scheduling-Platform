const departmentModel = require('../models/department.model');

async function createDepartment(req ,res){

    const {name , code} = req.body;

    const isDepartmentAlreadyExists = await departmentModel.findOne({admin:req.admin._id , code});

    if(isDepartmentAlreadyExists){
        return res.status(400).json({
            message:"Department Already Exists",
        });
    }

    const department = await departmentModel.create({
        name,
        code,
        admin:req.admin._id
    })

    res.status(201).json({
        message:"Department Created Successfully",
        department,
    })
}

async function getAllDepartments(req, res) {
    try {
        const departments = await departmentModel.find({admin:req.admin._id});
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching departments." });
    }
}

async function updateDepartment(req, res) {
    try {
        const { id } = req.params;
        const { name, code } = req.body;

        // Check if code is taken by another department
        if (code) {
            const exists = await departmentModel.findOne({ admin:req.admin._id, code, _id: { $ne: id } });
            if (exists) {
                return res.status(400).json({ message: 'Department code already in use.' });
            }
        }

        const updated = await departmentModel.findByIdAndUpdate(
            id,
            { name, code },
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ message: 'Department not found.' });

        res.status(200).json({ message: 'Department updated successfully', department: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating department.' });
    }
}

async function deleteDepartment(req, res) {
    try {
        const { id } = req.params;
        const deleted = await departmentModel.findByIdAndDelete(id , {admin:req.admin._id});
        if (!deleted) return res.status(404).json({ message: 'Department not found.' });
        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting department.' });
    }
}

module.exports = {
    createDepartment,
    getAllDepartments,
    updateDepartment,
    deleteDepartment,
}