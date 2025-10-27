function TimetableGrid({ schedule ,id }) {
    if (!schedule || Object.keys(schedule).length === 0) {
        return <p className="text-center text-gray-500 mt-4">No schedule data to display.</p>;
    }

    // This logic correctly gets all unique time slots and sorts them
    const timeSlots = [...new Set(Object.values(schedule).flat().map(s => s.timeSlot))].sort();

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return (
        <div id={id} className="overflow-x-auto bg-[#ffffff] rounded-lg shadow-md">

            <div className="overflow-x-auto bg-[#ffffff] rounded-lg shadow-md">
                <table className="min-w-full border-collapse">
                    
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="border p-3 font-semibold text-sm">Time</th>
                            {timeSlots.map(slot => (
                                <th key={slot} className="border p-3 font-semibold text-sm font-mono">
                                    {slot}
                                </th>
                            ))}

                            {/* {days.map(day => <th key={day} className="border p-3 font-semibold text-sm">{day}</th>)} */}
                        </tr>
                    </thead>

                    <tbody>
                        {days.map(day => (
                            <tr key={day} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="border p-2 font-mono bg-gray-100 text-center text-xs font-medium">{day}</td>
                                {timeSlots.map(slot => {
                                    const cls = schedule[day]?.find(c => c.timeSlot === slot);
                                    return (
                                        <td key={slot} className="border p-2 text-center align-top h-28">
                                            {cls ? (
                                                <div className="bg-blue-100 p-2 rounded-md h-full text-xs flex flex-col justify-center">
                                                    <p className="font-bold text-blue-800">{cls.subject?.subjectName || 'N/A'}</p>

                                                    <p className="italic text-gray-800">{cls.faculty?.facultyName || 'N/A'}</p>

                                                    <p className="text-gray-600 mt-1">Room: {cls.room?.roomNumber || 'N/A'}</p>
                                                </div>
                                            ) : null}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default TimetableGrid;

