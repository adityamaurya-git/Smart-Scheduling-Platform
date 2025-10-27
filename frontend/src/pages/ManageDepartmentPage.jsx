import React, { useState, useEffect } from 'react';
import { createDepartment, getAllDepartments, updateDepartment, deleteDepartment } from '../services/api';
import { Sidebar } from '../Components/Sidebar';

function ManageDepartmentsPage() {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [departments, setDepartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editId, setEditId] = useState('');
    const [editName, setEditName] = useState('');
    const [editCode, setEditCode] = useState('');

    const fetchDepartments = async () => {
        try {
            const response = await getAllDepartments();
            setDepartments(response.data);
        } catch (err) {
            setError('Failed to fetch departments.');
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            const response = await createDepartment({ name, code });
            setSuccess(`Department "${response.data.department.name}" created!`);
            setName(''); setCode('');
            fetchDepartments();
            // Close the modal on successful submit
            setShowModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create department.');
        }
    };

    const openEdit = (dept) => {
        setError(''); setSuccess('');
        setEditId(dept._id);
        setEditName(dept.name);
        setEditCode(dept.code);
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            const resp = await updateDepartment(editId, { name: editName, code: editCode });
            setSuccess(`Department "${resp.data.department.name}" updated!`);
            setShowEditModal(false);
            setEditId(''); setEditName(''); setEditCode('');
            fetchDepartments();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update department.');
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm('Are you sure you want to delete this department?');
        if (!confirm) return;
        setError(''); setSuccess('');
        try {
            await deleteDepartment(id);
            setSuccess('Department deleted successfully.');
            fetchDepartments();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete department.');
        }
    };

    return (<>
        <div className='w-full h-screen flex'>
            <Sidebar />
            <section className='w-full h-[87%] p-2 rounded-lg drop-shadow-xl'>
                <div className="w-full h-full grid grid-cols-1 gap-8 overflow-auto">

                  
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Existing Departments</h2>
                                <button
                                    onClick={() => { setError(''); setSuccess(''); setName(''); setCode(''); setShowModal(true); }}
                                    className="bg-[#89B0FF] text-black px-4 py-2 rounded font-semibold cursor-pointer">
                                    Add
                                </button>
                            </div>

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {departments.map((dept) => (
                                        <tr key={dept._id}>
                                            <td className="px-6 py-4">{dept.name}</td>
                                            <td className="px-6 py-4">{dept.code}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEdit(dept)}
                                                        className="px-3 py-1 text-sm rounded border text-black font-semibold cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(dept._id)}
                                                        className="px-3 py-1 text-sm rounded border border-red-600 text-red-600 font-semibold hover:bg-red-600 cursor-pointer"
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
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-lg" onClick={() => setShowModal(false)}></div>
                        <div className="relative z-10 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Add New Department</h3>
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
                                    <label className="block text-gray-700 mb-1">Department Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Department Code</label>
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>
                                {error && <p className="text-red-500 mb-3">{error}</p>}
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded font-semibold border cursor-pointer"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#89B0FF] font-semibold text-black px-4 py-2 rounded cursor-pointer"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-lg" onClick={() => setShowEditModal(false)}></div>
                        <div className="relative z-10 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Edit Department</h3>
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
                                    <label className="block text-gray-700 mb-1">Department Name</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Department Code</label>
                                    <input
                                        type="text"
                                        value={editCode}
                                        onChange={(e) => setEditCode(e.target.value)}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>
                                {error && <p className="text-red-500 mb-3">{error}</p>}
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded font-semibold border cursor-pointer"
                                        onClick={() => setShowEditModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#89B0FF] font-semibold text-black px-4 py-2 rounded cursor-pointer"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </section>
        </div>

    </>);
}

export default ManageDepartmentsPage;