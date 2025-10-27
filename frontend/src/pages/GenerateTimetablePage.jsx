
import TimetableGrid from '../Components/TimetableGrid';
import { useEffect, useState } from 'react';
import { generateTimetable, saveTimetable, getAllDepartments, getAllTimetables, getTimetableById } from '../services/api';


// Import the libraries for PDF generation
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { Sidebar } from '../Components/Sidebar';

function GenerateTimetablePage() {
    const [departmentId, setDepartmentId] = useState('');
    const [year, setYear] = useState('3');
    const [timetables, setTimetables] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [savedTimetables, setSavedTimetables] = useState([]);
    const [loadingSaved, setLoadingSaved] = useState(false);
    const [savedError, setSavedError] = useState('');
    const [showSavedModal, setShowSavedModal] = useState(false);
    const [savedDetail, setSavedDetail] = useState(null);

    // Helper to generate a safe DOM id for a section option
    const makeOptionId = (sectionName, optionIndex) => {
        const slug = String(sectionName)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/gi, '-')
            .replace(/(^-|-$)/g, '');
        return `timetable-${slug}-${optionIndex}`;
    };

    useEffect(() => {
        // Preload departments for the modal select
        (async () => {
            try {
                const res = await getAllDepartments();
                setDepartments(res.data || []);
            } catch (e) {
                // Non-blocking; keep manual entry fallback if needed
            }
        })();
    }, []);

    const fetchSavedTimetables = async () => {
        setLoadingSaved(true);
        setSavedError('');
        try {
            const res = await getAllTimetables();
            setSavedTimetables(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            setSavedError(e.response?.data?.message || 'Failed to load saved timetables.');
        } finally {
            setLoadingSaved(false);
        }
    };

    useEffect(() => {
        fetchSavedTimetables();
    }, []);

    const handleGenerate = async (e) => {
        if (e) e.preventDefault();
        if (!departmentId) {
            setError('Please enter a Department ID.');
            return;
        }
        setIsLoading(true);
        setError('');
        setSaveSuccess('');
        setTimetables(null);

        try {
            const response = await generateTimetable({ departmentId, year: Number(year) });

            setTimetables(response.data.generatedTimetables);
            setShowModal(false);

        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during generation.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (sectionName, timetableData) => {
        setSaveSuccess('');
        setError('');
        try {
            const classesToSave = Object.values(timetableData.schedule).flat().map(cls => ({
                subject: cls.subject._id,
                faculty: cls.faculty._id,
                room: cls.room._id,
                day: cls.day,
                timeSlot: cls.timeSlot
            }));

            const payload = {
                name: `Timetable for ${sectionName} - ${new Date().toLocaleDateString()}`,
                score: timetableData.fitness,
                classes: classesToSave
            };

            await saveTimetable(payload);
            setSaveSuccess(`Timetable for ${sectionName} has been saved successfully!`);
            fetchSavedTimetables();

        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while saving.');
        }
    };

    const handleDownloadPdf = async (sectionName, optionIndex) => {
        const timetableId = makeOptionId(sectionName, optionIndex);
        const input = document.getElementById(timetableId);

        if (!input) {
            setError("Error: Could not find timetable element to download.");
            return;
        }

        setIsDownloading(true);
        setError('');

        try {
            const dataUrl = await toPng(input, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
            });

            // Create PDF and add the image
            const img = new Image();
            img.src = dataUrl;
            await new Promise((res) => (img.onload = res));

            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            const pageWidth = 297;  // A4 landscape width in mm
            const pageHeight = 210; // A4 landscape height in mm
            const margin = 5; // mm

            const imgPixelWidth = img.width;
            const imgPixelHeight = img.height;

            // Start by fitting to full width minus margins
            let drawWidth = pageWidth - margin * 2;
            let drawHeight = (imgPixelHeight * drawWidth) / imgPixelWidth;

            // If it exceeds page height, fit to height instead
            if (drawHeight > pageHeight - margin * 2) {
                drawHeight = pageHeight - margin * 2;
                drawWidth = (imgPixelWidth * drawHeight) / imgPixelHeight;
            }

            // Center the image
            const x = (pageWidth - drawWidth) / 2;
            const y = (pageHeight - drawHeight) / 2;

            pdf.addImage(dataUrl, 'PNG', x, y, drawWidth, drawHeight);
            pdf.save(`Timetable-${sectionName}-Option-${optionIndex + 1}.pdf`);
        } catch (err) {
            console.error('PDF Generation Error:', err);
            setError('An error occurred while generating the PDF.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (<>

        <div className='w-full h-screen flex '>
            <Sidebar />
            <section className='w-full h-[87%] p-2 pl-1 rounded-lg drop-shadow-xl'>
                <div className="w-full h-full rounded-lg p-2 bg-zinc-100 overflow-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Generate Timetable</h2>
                            <button
                                onClick={() => { setError(''); setSaveSuccess(''); setShowModal(true); }}
                                className="bg-[#89B0FF] text-black font-semibold px-4 py-2 rounded cursor-pointer"
                            >
                                Generate
                            </button>
                        </div>
                        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
                        {saveSuccess && <p className="text-green-600 mt-3 text-sm">{saveSuccess}</p>}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Saved Timetables</h2>
                            <button
                                onClick={fetchSavedTimetables}
                                className="px-3 py-2 text-sm rounded border font-semibold cursor-pointer"
                            >
                                Refresh
                            </button>
                        </div>
                        {savedError && <p className="text-red-500 mb-3 text-sm">{savedError}</p>}
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2">Name</th>
                                        <th className="px-4 py-2">Score</th>
                                        <th className="px-4 py-2">Classes</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loadingSaved ? (
                                        <tr><td colSpan="4" className="px-4 py-3">Loading...</td></tr>
                                    ) : savedTimetables.length === 0 ? (
                                        <tr><td colSpan="4" className="px-4 py-3 text-center">No saved timetables found.</td></tr>
                                    ) : (
                                        savedTimetables.map(tt => (
                                            <tr key={tt._id}>
                                                <td className="px-4 py-2 font-medium">{tt.name || 'Untitled'}</td>
                                                <td className="px-4 py-2">{typeof tt.score === 'number' ? tt.score.toFixed(2) : (tt.score ?? '-')}</td>
                                                <td className="px-4 py-2">{Array.isArray(tt.classes) ? tt.classes.length : (tt.classesCount ?? '-')}</td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const res = await getTimetableById(tt._id);
                                                                setSavedDetail(res.data);
                                                                setShowSavedModal(true);
                                                            } catch (e) {
                                                                setSavedError(e.response?.data?.message || 'Failed to load timetable details.');
                                                            }
                                                        }}
                                                        className="px-3 py-1 text-sm rounded bg-[#89B0FF] text-black font-semibold cursor-pointer"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {timetables && Object.keys(timetables).map(sectionName => (

                        <div key={sectionName} className="mt-10">
                            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Options for Section: {sectionName}</h2>

                            {timetables[sectionName].map((timetable, index) => (
                                <div key={index} className="mb-8 p-4 bg-white rounded-lg shadow-lg">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                        <p className="text-lg font-semibold mb-2 sm:mb-0">Option {index + 1} <span className="text-gray-500 font-normal">(Fitness Score: {timetable.fitness.toFixed(2)})</span></p>
                                        <div className="flex space-x-2">
                                            {/* 3. The "Download PDF" button is now added here */}
                                            <button
                                                onClick={() => handleDownloadPdf(sectionName, index)}
                                                disabled={isDownloading}
                                                className="bg-red-400 text-white font-bold py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-400 transition-colors cursor-pointer"
                                            >
                                                {isDownloading ? 'Downloading...' : 'Download PDF'}
                                            </button>
                                            <button
                                                onClick={() => handleSave(sectionName, timetable)}
                                                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors cursor-pointer"
                                            >
                                                Save This Option
                                            </button>
                                        </div>
                                    </div>
                                    {/* 4. The unique ID is now passed to the TimetableGrid component */}

                                    <TimetableGrid
                                        schedule={timetable.schedule}
                                        id={makeOptionId(sectionName, index)}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-lg bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                        <div className="relative z-10 w-full max-w-lg bg-white p-6 rounded-lg shadow-lg max-h-[85vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Generate Timetable</h3>
                                <button className="h-7 w-7 flex justify-center items-center font-semibold cursor-pointer rounded-lg bg-red-400" onClick={() => setShowModal(false)} aria-label="Close">✕</button>
                            </div>
                            <form onSubmit={handleGenerate} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Department</label>
                                    <select
                                        value={departmentId}
                                        onChange={(e) => setDepartmentId(e.target.value)}
                                        className="w-full px-3 py-2 border rounded bg-white"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(d => (
                                            <option key={d._id} value={d._id}>{d.name} {d.code ? `(${d.code})` : ''}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Year</label>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full px-3 py-2 border rounded bg-white"
                                    >
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button type="button" className="px-4 py-2 rounded font-semibold border cursor-pointer" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" disabled={isLoading || isDownloading} className="bg-[#89B0FF] text-black font-semibold px-4 py-2 rounded cursor-pointer ">
                                        {isLoading ? 'Generating...' : 'Generate'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showSavedModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-lg bg-black/30 backdrop-blur-sm" onClick={() => setShowSavedModal(false)}></div>
                        <div className="relative z-10 w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg max-h-[85vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Saved Timetable Details</h3>
                                <button className="h-7 w-7 flex justify-center items-center font-semibold cursor-pointer rounded-lg bg-red-400" onClick={() => setShowSavedModal(false)} aria-label="Close">✕</button>
                            </div>
                            {!savedDetail ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <p className="font-semibold">{savedDetail.name || 'Untitled'}</p>
                                        {typeof savedDetail.score !== 'undefined' && (
                                            <p className="text-sm text-gray-600">Score: {typeof savedDetail.score === 'number' ? savedDetail.score.toFixed(2) : savedDetail.score}</p>
                                        )}
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full table-auto text-left">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2">Day</th>
                                                    <th className="px-4 py-2">Time Slot</th>
                                                    <th className="px-4 py-2">Subject</th>
                                                    <th className="px-4 py-2">Faculty</th>
                                                    <th className="px-4 py-2">Room</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {(savedDetail.classes || []).map((cls, idx) => {
                                                    const disp = (x) => x?.name || x?.subjectName || x?.code || x?._id || x;
                                                    
                                                    return (
                                                        <tr key={idx}>
                                                            <td className="px-4 py-2">{cls.day}</td>
                                                            <td className="px-4 py-2">{cls.timeSlot}</td>
                                                            <td className="px-4 py-2">{disp(cls.subject)}</td>
                                                            <td className="px-4 py-2">{disp(cls.faculty)}</td>
                                                            <td className="px-4 py-2">{disp(cls.room)}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

            </section>

        </div>



    </>);
}

export default GenerateTimetablePage;




