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
                console.log(response);
                setTimetable(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchStats();
        fetchTimetable();
    }, []);

    return (
        <div className='w-full h-screen flex'>
            <Sidebar />

            <section className=' w-full h-[87%] p-2 pl-1 rounded-lg drop-shadow-xl'>
                <div className=' w-full h-full rounded-lg p-2 bg-zinc-100'>
                    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Departments" value={stats?.departments} isLoading={isLoading} />
                        <StatCard title="Total Subjects" value={stats?.subjects} isLoading={isLoading} />
                        <StatCard title="Total Faculties" value={stats?.faculties} isLoading={isLoading} />
                        <StatCard title="Total Rooms" value={stats?.rooms} isLoading={isLoading} />
                    </div>

                </div>
            </section>


        </div>

    );
}

export default DashboardPage;