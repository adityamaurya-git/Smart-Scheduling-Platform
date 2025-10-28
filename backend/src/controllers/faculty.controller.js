const facultyModel = require('../models/faculty.model');


const createFaculty = async (req , res) =>{
    const {employeeId , facultyName ,department,teachingLoad, specializedSubjects, availability } = req.body;

    const isFacultyAlreadyExist = await facultyModel.findOne({employeeId});
    
    if(isFacultyAlreadyExist){
        return res.status(401).json({
            message:"Faculty Already Exists."
        })
    }

    const facultyCreated = await facultyModel.create({
        employeeId,
        facultyName,
        department,
        teachingLoad,
        specializedSubjects,
        availability,
        admin:req.admin._id,
    })

    res.status(201).json({
        message:"Faculty Created.",
        facultyCreated
    })

}

const updateFaculty = async (req, res)=>{
    const update = req.body
    const facultyId = req.params.id;
    const adminId = req.admin._id;

    const updatedFaculty = await facultyModel.findByIdAndUpdate(
        facultyId,
        update,
        {
            new:true,
            runValidators:true,
        },
        adminId,
    )

    if(!updatedFaculty){
        return res.status(404).json({
            message:"Faculty Not Found",
        })
    }

    res.status(200).json({
        message:"Faculty Updated Successfully.",
        updatedFaculty
    })

}

async function getAllFaculties(req, res) {
    try {
        const Faculties = await facultyModel.find({admin:req.admin._id});
        res.status(200).json(Faculties);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Faculties." });
    }
}

const deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await facultyModel.findByIdAndDelete(id , {admin:req.admin._id});
        if (!deleted) return res.status(404).json({ message: 'Faculty Not Found' });
        res.status(200).json({ message: 'Faculty deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting faculty.' });
    }
}


module.exports = {
    createFaculty,
    updateFaculty,
    getAllFaculties,
    deleteFaculty
}