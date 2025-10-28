import React, { useState, useEffect } from 'react';
import { createSubject, getAllSubjects, updateSubject, deleteSubject } from '../services/api';
import { Sidebar } from '../Components/Sidebar';

function ManageSubjectsPage() {
    // Form state
    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [weeklyHours, setWeeklyHours] = useState('');
    const [isLab, setIsLab] = useState(false);
    const [requiredBatchSize, setRequiredBatchSize] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editId, setEditId] = useState('');
    const [editSubjectName, setEditSubjectName] = useState('');
    const [editSubjectCode, setEditSubjectCode] = useState('');
    const [editWeeklyHours, setEditWeeklyHours] = useState('');
    const [editIsLab, setEditIsLab] = useState(false);
    const [editBatchSize, setEditBatchSize] = useState('');

    // List state
    const [subjects, setSubjects] = useState([]);

    const fetchSubjects = async () => {
        try {
            const response = await getAllSubjects();
            setSubjects(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await createSubject({ subjectName, subjectCode, weeklyHours: Number(weeklyHours), isLab, requiredBatchSize: Number(requiredBatchSize) });
            setSuccess(`Subject "${subjectName}" created!`);
            fetchSubjects(); // Refresh list
            setSubjectName(''); setSubjectCode(''); setWeeklyHours(''); setIsLab(false); setRequiredBatchSize('');
            setShowModal(false); // Close modal on success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create subject.');
        }
    };

    const openEdit = (sub) => {
        setError(''); setSuccess('');
        setEditId(sub._id);
        setEditSubjectName(sub.subjectName || '');
        setEditSubjectCode(sub.subjectCode || '');
        setEditWeeklyHours(sub.weeklyHours ?? '');
        setEditIsLab(!!sub.isLab);
        setEditBatchSize(sub.requiredBatchSize ?? '');
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await updateSubject(editId, {
                subjectName: editSubjectName,
                subjectCode: editSubjectCode,
                weeklyHours: Number(editWeeklyHours),
                isLab: editIsLab,
                requiredBatchSize: Number(editBatchSize)
            });
            setSuccess('Subject updated successfully.');
            setShowEditModal(false);
            fetchSubjects();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update subject.');
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm('Are you sure you want to delete this subject?');
        if (!confirm) return;
        setError(''); setSuccess('');
        try {
            await deleteSubject(id);
            setSuccess('Subject deleted successfully.');
            fetchSubjects();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete subject.');
        }
    };

    return (
        <div className='min-h-screen w-full flex flex-col md:flex-row'>
            <Sidebar />
            <section className='w-full  p-2 md:h-[87vh] rounded-lg drop-shadow-xl '>
                <div className="w-full h-screen grid grid-cols-1 gap-6 overflow-auto rounded-lg md:h-full">
                    
                        <div className="bg-white p-6 shadow-md">
                            <div className="flex items-center justify-between mb-4 ">
                                <h2 className="text-xl font-semibold">Existing Subjects</h2>
                                <button
                                    onClick={() => { setError(''); setSuccess(''); setSubjectName(''); setSubjectCode(''); setWeeklyHours(''); setIsLab(false); setRequiredBatchSize(''); setShowModal(true); }}
                                    className="bg-[#89B0FF] text-black font-semibold px-4 py-2 rounded cursor-pointer"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                            <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                                            <th className="px-2 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {subjects.map((sub) => (
                                            <tr key={sub._id}>
                                                <td className="px-2 sm:px-6 py-3">{sub.subjectName}</td>
                                                <td className="px-2 sm:px-6 py-3">{sub.subjectCode}</td>
                                                <td className="px-2 sm:px-6 py-3">{sub.weeklyHours}</td>
                                                <td className="px-2 sm:px-6 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => openEdit(sub)} className="px-3 py-1 text-sm rounded border text-black font-semibold cursor-pointer">Edit</button>
                                                        <button onClick={() => handleDelete(sub._id)} className="px-3 py-1 text-sm rounded border border-red-600 text-red-600 font-semibold cursor-pointer">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        

                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-lg bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                        <div className="relative z-10 w-[92vw] sm:w-full max-w-lg bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Add New Subject</h3>
                                <button
                                    className="w-7 h-7 rounded-lg flex justify-center items-center font-semibold cursor-pointer bg-red-400"
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Subject Name</label>
                                    <input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className="w-full px-3 py-2 border rounded" required autoFocus />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Subject Code</label>
                                    <input value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-1">Weekly Hours</label>
                                        <input type="number" value={weeklyHours} onChange={(e) => setWeeklyHours(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1">Batch Size</label>
                                        <input type="number" value={requiredBatchSize} onChange={(e) => setRequiredBatchSize(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" checked={isLab} onChange={(e) => setIsLab(e.target.checked)} id="isLab" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                    <label htmlFor="isLab" className="ml-2 block text-sm text-gray-900">Is a Lab Subject?</label>
                                </div>
                                {error && <p className="text-red-500">{error}</p>}
                                <div className="flex justify-end gap-3">
                                    <button type="button" className="px-4 py-2 font-semibold rounded border cursor-pointer" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="bg-[#89B0FF] text-black font-semibold px-4 py-2 rounded cursor-pointer">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-lg bg-black/30 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
                        <div className="relative z-10 w-[92vw] sm:w-full max-w-lg bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Edit Subject</h3>
                                <button className="w-7 h-7 rounded-lg flex justify-center items-center font-semibold cursor-pointer bg-red-400" onClick={() => setShowEditModal(false)} aria-label="Close">✕</button>
                            </div>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Subject Name</label>
                                    <input value={editSubjectName} onChange={(e) => setEditSubjectName(e.target.value)} className="w-full px-3 py-2 border rounded" required autoFocus />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Subject Code</label>
                                    <input value={editSubjectCode} onChange={(e) => setEditSubjectCode(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-1">Weekly Hours</label>
                                        <input type="number" value={editWeeklyHours} onChange={(e) => setEditWeeklyHours(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1">Batch Size</label>
                                        <input type="number" value={editBatchSize} onChange={(e) => setEditBatchSize(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" checked={editIsLab} onChange={(e) => setEditIsLab(e.target.checked)} id="editIsLab" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                    <label htmlFor="editIsLab" className="ml-2 block text-sm text-gray-900">Is a Lab Subject?</label>
                                </div>
                                {error && <p className="text-red-500">{error}</p>}
                                <div className="flex justify-end gap-3">
                                    <button type="button" className="px-4 py-2 font-semibold rounded border cursor-pointer" onClick={() => setShowEditModal(false)}>Cancel</button>
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

export default ManageSubjectsPage;