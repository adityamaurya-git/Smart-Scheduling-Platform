import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { getAllTimetables } from '../services/api';
import { Sidebar } from '../Components/Sidebar';



function StatCard({ title, value, isLoading }) {
    return (
        <div className="text-zinc-100 bg-[#89B0FF] p-6 rounded-lg shadow-md">
            <h3 className="text-black text-sm font-semibold">{title}</h3>
            <p className="text-3xl font-bold">{isLoading ? '...' : value}</p>
        </div>
    );
}


function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [timetable, setTimetable] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getDashboardStats();
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchTimetable = async () => {
            try {
                const response = await getAllTimetables();
                setTimetable(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchStats();
        fetchTimetable();
    }, []);

    return (
        <div className='min-h-screen w-full flex flex-col md:flex-row'>
            <Sidebar />

            <section className='w-full p-2 md:h-[87vh] drop-shadow-xl'>
                <div className='w-full h-screen p-3 sm:p-4 bg-zinc-100 rounded-lg md:h-full'>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Dashboard</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <StatCard title="Total Departments" value={stats?.departments} isLoading={isLoading} />
                        <StatCard title="Total Subjects" value={stats?.subjects} isLoading={isLoading} />
                        <StatCard title="Total Faculties" value={stats?.faculties} isLoading={isLoading} />
                        <StatCard title="Total Rooms" value={stats?.rooms} isLoading={isLoading} />
                        <StatCard title="Total Sections" value={stats?.sections} isLoading={isLoading} />
                        <StatCard title="Total Timetables" value={stats?.timetables} isLoading={isLoading} />
                    </div>

                </div>
            </section>


        </div>

    );
}

export default DashboardPage;