import React, { useState, useEffect } from 'react';
import { createRoom, getAllRooms, updateRoom, deleteRoom } from '../services/api';
import { Sidebar } from '../Components/Sidebar';

function ManageRoomsPage() {
    // Form state
    const [roomNumber, setRoomNumber] = useState('');
    const [capacity, setCapacity] = useState('');
    const [roomType, setRoomType] = useState('General Classroom');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingRoomId, setEditingRoomId] = useState(null);
    const [editRoomNumber, setEditRoomNumber] = useState('');
    const [editCapacity, setEditCapacity] = useState('');
    const [editRoomType, setEditRoomType] = useState('General Classroom');

    // List state
    const [rooms, setRooms] = useState([]);

    const fetchRooms = async () => {
        try {
            const response = await getAllRooms();
            setRooms(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await createRoom({ roomNumber, capacity: Number(capacity), roomType });
            setSuccess(`Room "${roomNumber}" created successfully!`);
            fetchRooms(); // Refresh list
            setRoomNumber(''); setCapacity('');
            setRoomType('General Classroom');
            setShowModal(false); // Close modal on success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create room.');
        }
    };

    const openEdit = (room) => {
        setEditingRoomId(room._id);
        setEditRoomNumber(room.roomNumber || '');
        setEditCapacity(String(room.capacity ?? ''));
        setEditRoomType(room.roomType || 'General Classroom');
        setError(''); setSuccess('');
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await updateRoom(editingRoomId, {
                roomNumber: editRoomNumber,
                capacity: Number(editCapacity),
                roomType: editRoomType,
            });
            setSuccess('Room updated successfully.');
            setShowEditModal(false);
            setEditingRoomId(null);
            fetchRooms();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update room.');
        }
    };

    const handleDelete = async (room) => {
        const ok = window.confirm(`Delete room "${room.roomNumber}"? This cannot be undone.`);
        if (!ok) return;
        try {
            await deleteRoom(room._id);
            fetchRooms();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete room.');
        }
    };

    return (
        <div className='w-full h-screen flex'>
            <Sidebar />
            <section className='w-full h-[87%] p-2 pl-1 rounded-lg drop-shadow-xl'>
                <div className="w-full h-full grid grid-cols-1 gap-8 overflow-auto">
                   
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Existing Rooms</h2>
                                <button
                                    onClick={() => { setError(''); setSuccess(''); setRoomNumber(''); setCapacity(''); setRoomType('General Classroom'); setShowModal(true); }}
                                    className="bg-[#89B0FF] text-black font-semibold px-4 py-2 rounded cursor-pointer"
                                >
                                    Add
                                </button>
                            </div>

                            <table className="min-w-full divide-y divide-gray-200">
                                {/* Table Head */}
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                {/* Table Body */}
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rooms.map((room) => (
                                        <tr key={room._id}>
                                            <td className="px-6 py-4">{room.roomNumber}</td>
                                            <td className="px-6 py-4">{room.capacity}</td>
                                            <td className="px-6 py-4">{room.roomType}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        className="px-3 py-1 text-sm rounded  font-semibold border cursor-pointer"
                                                        onClick={() => openEdit(room)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 text-sm rounded border font-semibold text-red-600 cursor-pointer"
                                                        onClick={() => handleDelete(room)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-lg bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                        <div className="relative z-10 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Add New Room</h3>
                                <button
                                    className="w-7 h-7 rounded-lg flex justify-center items-center font-semibold cursor-pointer bg-red-400"
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Room Number</label>
                                    <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className="w-full px-3 py-2 border rounded" required autoFocus />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Capacity</label>
                                    <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Room Type</label>
                                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="w-full px-3 py-2 border rounded">
                                        <option value="General Classroom">General Classroom</option>
                                        <option value="Lab">Lab</option>
                                    </select>
                                </div>
                                {error && <p className="text-red-500 mb-3">{error}</p>}
                                <div className="flex justify-end gap-3">
                                    <button type="button" className="px-4 py-2 rounded font-semibold border cursor-pointer" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="bg-[#89B0FF] text-black font-semibold px-4 py-2 rounded cursor-pointer">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-lg bg-black/30 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
                        <div className="relative z-10 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Edit Room</h3>
                                <button
                                    className="w-7 h-7 rounded-lg flex justify-center items-center font-semibold cursor-pointer bg-red-400"
                                    onClick={() => setShowEditModal(false)}
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleUpdate}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Room Number</label>
                                    <input type="text" value={editRoomNumber} onChange={(e) => setEditRoomNumber(e.target.value)} className="w-full px-3 py-2 border rounded" required autoFocus />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Capacity</label>
                                    <input type="number" value={editCapacity} onChange={(e) => setEditCapacity(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Room Type</label>
                                    <select value={editRoomType} onChange={(e) => setEditRoomType(e.target.value)} className="w-full px-3 py-2 border rounded">
                                        <option value="General Classroom">General Classroom</option>
                                        <option value="Lab">Lab</option>
                                    </select>
                                </div>
                                {error && <p className="text-red-500 mb-3">{error}</p>}
                                <div className="flex justify-end gap-3">
                                    <button type="button" className="px-4 py-2 rounded font-semibold border cursor-pointer" onClick={() => setShowEditModal(false)}>Cancel</button>
                                    <button type="submit" className="bg-[#89B0FF] text-black font-semibold px-4 py-2 rounded cursor-pointer">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default ManageRoomsPage;