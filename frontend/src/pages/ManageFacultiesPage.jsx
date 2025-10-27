import React, { useState, useEffect } from 'react';
import { createFaculty, getAllFaculties, getAllDepartments, getAllSubjects, updateFaculty, deleteFaculty } from '../services/api';
import { Sidebar } from '../Components/Sidebar';

function ManageFacultiesPage() {
    const [employeeId, setEmployeeId] = useState('');
    const [facultyName, setFacultyName] = useState('');
    const [department, setDepartment] = useState('');
    const [teachingLoad, setTeachingLoad] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    
    const [allDepartments, setAllDepartments] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [subjectSearch, setSubjectSearch] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingFacultyId, setEditingFacultyId] = useState(null);

    const fetchData = async () => {
        try {
            const [facs, depts, subs] = await Promise.all([getAllFaculties(), getAllDepartments(), getAllSubjects()]);
            setFaculties(facs.data);
            setAllDepartments(depts.data);
            setAllSubjects(subs.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredSubjects = allSubjects.filter(sub => {
        const q = subjectSearch.toLowerCase();
        return (
            sub.subjectName?.toLowerCase().includes(q) ||
            sub.subjectCode?.toLowerCase().includes(q)
        );
    });

    const toggleSubject = (id) => {
        setSelectedSubjects(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const selectAllFiltered = () => {
        const ids = filteredSubjects.map(s => s._id);
        setSelectedSubjects(prev => Array.from(new Set([...prev, ...ids])));
    };

    const clearSelection = () => setSelectedSubjects([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await createFaculty({ employeeId, facultyName, department, teachingLoad: Number(teachingLoad), specializedSubjects: selectedSubjects });
            setSuccess('Faculty created!');
            fetchData(); // Refresh all lists
            // reset fields
            setEmployeeId(''); setFacultyName(''); setDepartment(''); setTeachingLoad(''); setSelectedSubjects([]);
            setShowModal(false); // Close modal on success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create faculty.');
        }
    };

    const openEdit = (fac) => {
        setEditingFacultyId(fac._id);
        setEmployeeId(fac.employeeId || '');
        setFacultyName(fac.facultyName || '');
        setDepartment(fac.department || '');
        setTeachingLoad(String(fac.teachingLoad ?? ''));
        setSelectedSubjects(fac.specializedSubjects || []);
        setSubjectSearch('');
        setError(''); setSuccess('');
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await updateFaculty(editingFacultyId, {
                employeeId,
                facultyName,
                department,
                teachingLoad: Number(teachingLoad),
                specializedSubjects: selectedSubjects,
            });
            setSuccess('Faculty updated!');
            setShowEditModal(false);
            setEditingFacultyId(null);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update faculty.');
        }
    };

    const handleDelete = async (fac) => {
        const ok = window.confirm(`Delete faculty "${fac.facultyName}" (${fac.employeeId})?`);
        if (!ok) return;
        try {
            await deleteFaculty(fac._id);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete faculty.');
        }
    };

    return (
        <div className='w-full h-screen flex'>
            <Sidebar />
            <section className='w-full h-[87%] p-2 pl-1 rounded-lg drop-shadow-xl'>
                <div className="w-full h-full grid grid-cols-1 gap-8 overflow-auto">
                    
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Existing Faculties</h2>
                                <button
                                    onClick={() => { setError(''); setSuccess(''); setEmployeeId(''); setFacultyName(''); setDepartment(''); setTeachingLoad(''); setSelectedSubjects([]); setShowModal(true); }}
                                    className="bg-[#89B0FF] text-black font-semibold px-4 py-2 rounded cursor-pointer"
                                >
                                    Add
                                </button>
                            </div>

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {faculties.map((fac) => (
                                        <tr key={fac._id}>
                                            <td className="px-6 py-4">{fac.facultyName}</td>
                                            <td className="px-6 py-4">{fac.employeeId}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button className="px-3 py-1 text-sm rounded border font-semibold cursor-pointer" onClick={() => openEdit(fac)}>Edit</button>
                                                    <button className="px-3 py-1 text-sm rounded border font-semibold text-red-600 cursor-pointer" onClick={() => handleDelete(fac)}>Delete</button>
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
                        <div className="relative z-10 w-full max-w-lg bg-white p-4 rounded-lg shadow-lg max-h-[85vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Add New Faculty</h3>
                                <button
                                    className="h-7 w-7 flex items-center justify-center font-semibold rounded-lg bg-red-400 cursor-pointer"
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-gray-700 mb-1">Employee ID</label>
                                        <input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="w-full px-3 py-2 border rounded" required autoFocus />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1">Teaching Load (hours)</label>
                                        <input type="number" value={teachingLoad} onChange={(e) => setTeachingLoad(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Faculty Name</label>
                                    <input value={facultyName} onChange={(e) => setFacultyName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Department</label>
                                    <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 border rounded" required>
                                        <option value="">Select Department</option>
                                        {allDepartments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                                    </select>
                                </div>
                                <div className='w-full h-full '>
                                    <label className="block text-gray-700 mb-2">Specialized Subjects</label>
                                    <div className="w-full h-full flex items-center gap-2 mb-2  ">
                                        <input
                                            type="text"
                                            value={subjectSearch}
                                            onChange={(e) => setSubjectSearch(e.target.value)}
                                            placeholder="Search subjects..."
                                            className="w-3/5 px-3 py-2 border rounded"
                                        />
                                        <button type="button" onClick={selectAllFiltered} className="px-3 py-2.5 text-sm rounded border font-semibold cursor-pointer">Select All</button>
                                        <button type="button" onClick={clearSelection} className="px-3 py-2.5 text-sm rounded border font-semibold cursor-pointer">Clear</button>
                                    </div>
                                    <div className="border rounded max-h-20 overflow-y-auto p-1">
                                        {filteredSubjects.length === 0 && (
                                            <p className="text-sm text-gray-500">No subjects match your search.</p>
                                        )}
                                        {filteredSubjects.map(sub => (
                                            <label key={sub._id} className="flex items-center gap-2 h-6 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubjects.includes(sub._id)}
                                                    onChange={() => toggleSubject(sub._id)}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                />
                                                <span className="text-sm text-gray-800">{sub.subjectName}{sub.subjectCode ? ` (${sub.subjectCode})` : ''}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {selectedSubjects.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedSubjects.map(id => {
                                                const s = allSubjects.find(x => x._id === id);
                                                return (
                                                    <span key={id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{s?.subjectName || 'Unknown'}</span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                {error && <p className="text-red-500">{error}</p>}
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
                        <div className="relative z-10 w-full max-w-lg bg-white p-4 rounded-lg shadow-lg max-h-[85vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Edit Faculty</h3>
                                <button
                                    className="h-7 w-7 flex items-center justify-center font-semibold rounded-lg bg-red-400 cursor-pointer"
                                    onClick={() => setShowEditModal(false)}
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-gray-700 mb-1">Employee ID</label>
                                        <input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="w-full px-3 py-2 border rounded" required autoFocus />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1">Teaching Load (hours)</label>
                                        <input type="number" value={teachingLoad} onChange={(e) => setTeachingLoad(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Faculty Name</label>
                                    <input value={facultyName} onChange={(e) => setFacultyName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Department</label>
                                    <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 border rounded" required>
                                        <option value="">Select Department</option>
                                        {allDepartments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                                    </select>
                                </div>
                                <div className='w-full h-full '>
                                    <label className="block text-gray-700 mb-2">Specialized Subjects</label>
                                    <div className="w-full h-full flex items-center gap-2 mb-2  ">
                                        <input
                                            type="text"
                                            value={subjectSearch}
                                            onChange={(e) => setSubjectSearch(e.target.value)}
                                            placeholder="Search subjects..."
                                            className="w-3/5 px-3 py-2 border rounded"
                                        />
                                        <button type="button" onClick={selectAllFiltered} className="px-3 py-2.5 text-sm rounded border font-semibold cursor-pointer">Select All</button>
                                        <button type="button" onClick={clearSelection} className="px-3 py-2.5 text-sm rounded border font-semibold cursor-pointer">Clear</button>
                                    </div>
                                    <div className="border rounded max-h-20 overflow-y-auto p-1">
                                        {filteredSubjects.length === 0 && (
                                            <p className="text-sm text-gray-500">No subjects match your search.</p>
                                        )}
                                        {filteredSubjects.map(sub => (
                                            <label key={sub._id} className="flex items-center gap-2 h-6 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubjects.includes(sub._id)}
                                                    onChange={() => toggleSubject(sub._id)}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                />
                                                <span className="text-sm text-gray-800">{sub.subjectName}{sub.subjectCode ? ` (${sub.subjectCode})` : ''}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {selectedSubjects.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedSubjects.map(id => {
                                                const s = allSubjects.find(x => x._id === id);
                                                return (
                                                    <span key={id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{s?.subjectName || 'Unknown'}</span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                {error && <p className="text-red-500">{error}</p>}
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

export default ManageFacultiesPage;