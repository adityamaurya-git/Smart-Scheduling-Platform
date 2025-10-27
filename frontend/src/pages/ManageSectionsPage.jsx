// import React, { useState, useEffect } from 'react';
// import { createSection, getAllSections, getAllDepartments, getAllSubjects } from '../services/api';

// function ManageSectionsPage() {
//     // Form state
//     const [name, setName] = useState('');
//     const [year, setYear] = useState('1');
//     const [department, setDepartment] = useState('');
//     const [selectedSubjects, setSelectedSubjects] = useState([]);

//     // Data for dropdowns
//     const [sections, setSections] = useState([]);
//     const [allDepartments, setAllDepartments] = useState([]);
//     const [allSubjects, setAllSubjects] = useState([]);

//     const fetchData = async () => {
//         try {
//             const [depts, subs] = await Promise.all([getAllDepartments(), getAllSubjects()]);
//             setAllDepartments(depts.data);
//             setAllSubjects(subs.data);
//         } catch (error) {
//             console.error("Failed to fetch data", error);
//         }
//     };

    

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const handleSubjectSelect = (e) => {
//         const options = [...e.target.selectedOptions];
//         const values = options.map(option => option.value);
//         setSelectedSubjects(values);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await createSection({ name, year: Number(year), department, subjects: selectedSubjects });
//             alert('Section created!');
//         } catch (err) {
//             alert('Error: ' + err.response?.data?.message);
//         }
//     };

//     return (
//         <div>
//             <h1 className="text-3xl font-bold mb-6">Manage Sections</h1>
//             <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
//                 <h2 className="text-xl font-semibold mb-4">Add New Section</h2>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Section Name (e.g., A)" className="w-full px-3 py-2 border rounded" required />
//                     <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2 border rounded">
//                         <option value="1">1st Year</option>
//                         <option value="2">2nd Year</option>
//                         <option value="3">3rd Year</option>
//                         <option value="4">4th Year</option>
//                     </select>
//                     <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 border rounded" required>
//                         <option value="">Select Department</option>
//                         {allDepartments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
//                     </select>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Subjects for this Section (Ctrl+Click to select multiple)</label>
//                         <select multiple value={selectedSubjects} onChange={handleSubjectSelect} className="w-full px-3 py-2 border rounded h-48">
//                             {allSubjects.map(sub => <option key={sub._id} value={sub._id}>{sub.subjectName} ({sub.subjectCode})</option>)}
//                         </select>
//                     </div>
//                     <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Add Section</button>
//                 </form>
//             </div>
//             {/* You can add a table to display sections here */}
//             <div className="bg-white p-6 rounded-lg shadow-md">
//                 <h2 className="text-xl font-semibold mb-4">Existing Sections</h2>
//                 <div className="overflow-x-auto">
//                     <table className="w-full table-auto text-left">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-4 py-2">Section Name</th>
//                                 <th className="px-4 py-2">Year</th>
//                                 <th className="px-4 py-2">Department</th>
//                                 {/* Add other headers if needed */}
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {sections.length > 0 ? sections.map(section => (
//                                 <tr key={section._id}>
//                                     <td className="px-4 py-2 font-medium">{section.name}</td>
//                                     <td className="px-4 py-2">{section.year}</td>
//                                     <td className="px-4 py-2">{getDepartmentName(section.department)}</td>
//                                     {/* You could also list subjects, but it might get long */}
//                                     {/* <td className="px-4 py-2">{section.subjects.length} subjects</td> */}
//                                 </tr>
//                             )) : (
//                                 <tr>
//                                     <td colSpan="3" className="text-center py-4">No sections found.</td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ManageSectionsPage;

import React, { useState, useEffect } from 'react';
import { createSection, getAllSections, getAllDepartments, getAllSubjects, updateSection, deleteSection } from '../services/api';
import { Sidebar } from '../Components/Sidebar';

function ManageSectionsPage() {
    // Form state
    const [name, setName] = useState('');
    const [year, setYear] = useState('1');
    const [department, setDepartment] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    // Data for display and dropdowns
    const [sections, setSections] = useState([]); // list for table
    const [allDepartments, setAllDepartments] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [subjectSearch, setSubjectSearch] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSectionId, setEditingSectionId] = useState(null);

    // Fetch all necessary data from the API
    const fetchData = async () => {
        try {
            // Use Promise.all to fetch everything concurrently
            const [depts, subs, secs] = await Promise.all([
                getAllDepartments(),
                getAllSubjects(),
                getAllSections()
            ]);
            setAllDepartments(depts.data);
            setAllSubjects(subs.data);
            setSections(secs.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
            alert("Failed to load data. Please check the console.");
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchData();
    }, []);

    const handleSubjectSelect = (e) => {
        const options = [...e.target.selectedOptions];
        const values = options.map(option => option.value);
        setSelectedSubjects(values);
    };

    // Enhanced subject selection helpers (match Faculties UX)
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
        if (!department || selectedSubjects.length === 0) {
            setError('Please select a department and at least one subject.');
            return;
        }
        try {
            await createSection({ name, year: Number(year), department, subjects: selectedSubjects });
            setSuccess('Section created successfully!');
            
            // Reset form fields
            setName('');
            setYear('1');
            setDepartment('');
            setSelectedSubjects([]);
            
            // Refresh the sections table
            fetchData();
            setShowModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not create section.');
        }
    };

    const openEdit = (section) => {
        setEditingSectionId(section._id);
        setName(section.name || '');
        setYear(String(section.year ?? '1'));
        setDepartment(section.department || '');
        setSelectedSubjects(section.subjects || []);
        setSubjectSearch('');
        setError(''); setSuccess('');
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (!department || selectedSubjects.length === 0) {
            setError('Please select a department and at least one subject.');
            return;
        }
        try {
            await updateSection(editingSectionId, {
                name,
                year: Number(year),
                department,
                subjects: selectedSubjects,
            });
            setSuccess('Section updated!');
            setShowEditModal(false);
            setEditingSectionId(null);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not update section.');
        }
    };

    const handleDelete = async (section) => {
        const ok = window.confirm(`Delete section "${section.name}"?`);
        if (!ok) return;
        try {
            await deleteSection(section._id);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Could not delete section.');
        }
    };
    
    // Helper to find department name from its ID
    const getDepartmentName = (deptId) => {
        const dept = allDepartments.find(d => d._id === deptId);
        return dept ? dept.name : 'Unknown';
    };

    return (
        <div className='w-full h-screen flex'>
            <Sidebar />
            <section className='w-full h-[87%] p-2 pl-1 rounded-lg drop-shadow-xl'>
                <div className="w-full h-full grid grid-cols-1 gap-8 overflow-auto">
                  
                        <div className="bg-white p-6 rounded-lg shadow-md">

                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Existing Sections</h2>
                                <button
                                    onClick={() => { setError(''); setSuccess(''); setName(''); setYear('1'); setDepartment(''); setSelectedSubjects([]); setShowModal(true); }}
                                    className="bg-[#89B0FF] text-black font-semibold px-4 py-2 rounded cursor-pointer"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full table-auto text-left">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Section Name</th>
                                            <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Year</th>
                                            <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Department</th>
                                            <th className="px-4 text-right py-2 text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {sections.length > 0 ? sections.map(section => (
                                            <tr key={section._id}>
                                                <td className="px-4 py-2 font-medium">{section.name}</td>
                                                <td className="px-4 py-2">{section.year}</td>
                                                <td className="px-4 py-2">{getDepartmentName(section.department)}</td>
                                                <td className="px-4 py-2">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="px-3 py-1 text-sm rounded border font-semibold cursor-pointer" onClick={() => openEdit(section)}>Edit</button>
                                                        <button className="px-3 py-1 text-sm rounded border font-semibold text-red-600 cursor-pointer" onClick={() => handleDelete(section)}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4">No sections found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                   
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-lg bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                        <div className="relative z-10 w-full max-w-lg bg-white p-6 rounded-lg shadow-lg max-h-[85vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Add New Section</h3>
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
                                    <label className="block text-gray-700 mb-1">Section Name</label>
                                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., A" className="w-full px-3 py-2 border rounded" required autoFocus />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-1">Year</label>
                                        <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2 border rounded">
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1">Department</label>
                                        <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 border rounded" required>
                                            <option value="">Select Department</option>
                                            {allDepartments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Subjects</label>
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={subjectSearch}
                                            onChange={(e) => setSubjectSearch(e.target.value)}
                                            placeholder="Search subjects..."
                                            className="w-3/5 px-3 py-2 border rounded"
                                        />
                                        <button type="button" onClick={selectAllFiltered} className="px-3 py-2.5 text-sm rounded border hover:bg-gray-50">Select All</button>
                                        <button type="button" onClick={clearSelection} className="px-3 py-2.5 text-sm rounded border hover:bg-gray-50">Clear</button>
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
                        <div className="relative z-10 w-full max-w-lg bg-white p-6 rounded-lg shadow-lg max-h-[85vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Edit Section</h3>
                                <button
                                    className="w-7 h-7 rounded-lg flex justify-center items-center font-semibold cursor-pointer bg-red-400"
                                    onClick={() => setShowEditModal(false)}
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Section Name</label>
                                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., A" className="w-full px-3 py-2 border rounded" required autoFocus />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-1">Year</label>
                                        <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2 border rounded">
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1">Department</label>
                                        <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 border rounded" required>
                                            <option value="">Select Department</option>
                                            {allDepartments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Subjects</label>
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={subjectSearch}
                                            onChange={(e) => setSubjectSearch(e.target.value)}
                                            placeholder="Search subjects..."
                                            className="w-3/5 px-3 py-2 border rounded"
                                        />
                                        <button type="button" onClick={selectAllFiltered} className="px-3 py-2.5 text-sm rounded border hover:bg-gray-50">Select All</button>
                                        <button type="button" onClick={clearSelection} className="px-3 py-2.5 text-sm rounded border hover:bg-gray-50">Clear</button>
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

export default ManageSectionsPage;