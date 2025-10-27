import { useState } from "react";
import { NavLink } from "react-router-dom"

export const Sidebar = () => {

    const [isOpen, setIsOpen] =  useState(false);

    return (<>
        <aside className="w-1/4 h-[87%] p-2 ">
            <div className="w-full h-full rounded-lg p-1 bg-[#89B0FF]">
                {/* <div className="w-full flex justify-end p-1" >
                    <svg className="w-5 h-5 rounded-sm bg-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div> */}
                <nav className="w-full h-full flex flex-col  gap-3">
                    <div className="w-full h-1/4 flex flex-col p-2 gap-2 ">
                        <NavLink className={(e) => `text-lg font-semibold px-2 py-1 rounded-lg ${e.isActive ? "bg-zinc-100" : "bg-none"}`} to="/admin/dashboard" >Dashboard</NavLink>
                        <NavLink className={(e) => `text-lg font-semibold px-2 py-1 rounded-lg ${e.isActive ? "bg-zinc-100" : "bg-none"}`} to="/generate/timetable" >Generate Timetable</NavLink>
                   </div>
                    <div className="w-full h-full flex flex-col p-2 gap-2">
                        <NavLink className={(e) => `text-lg font-semibold px-2 py-1 rounded-lg ${e.isActive ? "bg-zinc-100" : "bg-none"}`} to="/manage/departments" >Manage Departments</NavLink>
                        <NavLink className={(e) => `text-lg font-semibold px-2 py-1 rounded-lg ${e.isActive ? "bg-zinc-100" : "bg-none"}`} to="/manage/subjects" >Manage Subjects</NavLink>
                        <NavLink className={(e) => `text-lg font-semibold px-2 py-1 rounded-lg ${e.isActive ? "bg-zinc-100" : "bg-none"}`} to="/manage/rooms" >Manage Rooms</NavLink>
                        <NavLink className={(e) => `text-lg font-semibold px-2 py-1 rounded-lg ${e.isActive ? "bg-zinc-100" : "bg-none"}`} to="/manage/faculties" >Manage Faculties</NavLink>
                        <NavLink className={(e) => `text-lg font-semibold px-2 py-1 rounded-lg ${e.isActive ? "bg-zinc-100" : "bg-none"}`} to="/manage/sections" >Manage Sections</NavLink>
                 </div>
                </nav>
            </div>
        </aside>
    </>)
}





{/* <div className=" flex h-screen border">
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <nav className="flex-grow">
            <Link to="/" className="block py-2.5 px-4 rounded hover:bg-gray-700">Dashboard</Link>
            <Link to="/generate" className="block py-2.5 px-4 rounded hover:bg-gray-700">Generate Timetable</Link>
            <h2 className="text-xs font-semibold text-gray-400 mt-6 mb-2 px-4">MANAGE</h2>
            <Link to="/manage-departments" className="block py-2.5 px-4 rounded hover:bg-gray-700">Departments</Link>
            <Link to="/manage-subjects" className="block py-2.5 px-4 rounded hover:bg-gray-700">Subjects</Link>
            <Link to="/manage-rooms" className="block py-2.5 px-4 rounded hover:bg-gray-700">Rooms</Link>
            <Link to="/manage-faculties" className="block py-2.5 px-4 rounded hover:bg-gray-700">Faculties</Link>
            <Link to="/manage-sections" className="block py-2.5 px-4 rounded hover:bg-gray-700">Sections</Link>
        </nav>
    </aside>
    <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
    </main>
</div> */}