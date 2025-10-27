const roomModel = require('../models/room.model');



async function createRoom(req,res){
    const {roomNumber , capacity , roomType, unavailability} = req.body;

    let isRoomAlreadyExist = await roomModel.findOne({roomNumber})
    if(isRoomAlreadyExist){
        return res.status(401).json({
            message:"Room Number Already Exists",
        })
    }

    const roomCreated = await roomModel.create({
        roomNumber,
        capacity,
        roomType,
        unavailability
    })

    res.status(201).json({
        message:"Room Created",
        roomCreated
    })
}

async function getAllRooms(req, res) {
    try {
        const rooms = await roomModel.find({});
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Error fetching rooms." });
    }
}

async function updateRoom(req, res) {
    try {
        const { id } = req.params;
        const { roomNumber, capacity, roomType, unavailability } = req.body;

        if (roomNumber) {
            const exists = await roomModel.findOne({ roomNumber, _id: { $ne: id } });
            if (exists) return res.status(400).json({ message: 'Room number already in use.' });
        }

        const updated = await roomModel.findByIdAndUpdate(
            id,
            { roomNumber, capacity, roomType, unavailability },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Room not found.' });
        res.status(200).json({ message: 'Room updated successfully', room: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating room.' });
    }
}

async function deleteRoom(req, res) {
    try {
        const { id } = req.params;
        const deleted = await roomModel.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Room not found.' });
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting room.' });
    }
}


module.exports = {
    createRoom,
    getAllRooms,
    updateRoom,
    deleteRoom
}