
// import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';


// // Import all the pages
// import LoginPage from './pages/LoginPage';
// import DashboardPage from './pages/DashboardPage';
// import ManageDepartmentsPage from './pages/ManageDepartmentPage';
// import ManageSubjectsPage from './pages/ManageSubjectsPage';
// import ManageRoomsPage from './pages/ManageRoomsPage';
// import ManageFacultiesPage from './pages/ManageFacultiesPage';
// import ManageSectionsPage from './pages/ManageSectionsPage';
// import GenerateTimetablePage from './pages/GenerateTimetablePage';

// const SidebarLayout = () => (
//     <div className="flex h-screen bg-gray-100 font-sans">
//         <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
//             <h1 className="text-2xl font-bold mb-8">Smart Timetable</h1>
//             <nav className="flex-grow">
//                 <Link to="/" className="block py-2.5 px-4 rounded hover:bg-gray-700">Dashboard</Link>
//                 <Link to="/generate" className="block py-2.5 px-4 rounded hover:bg-gray-700">Generate Timetable</Link>
//                 <h2 className="text-xs font-semibold text-gray-400 mt-6 mb-2 px-4">MANAGE</h2>
//                 <Link to="/manage-departments" className="block py-2.5 px-4 rounded hover:bg-gray-700">Departments</Link>
//                 <Link to="/manage-subjects" className="block py-2.5 px-4 rounded hover:bg-gray-700">Subjects</Link>
//                 <Link to="/manage-rooms" className="block py-2.5 px-4 rounded hover:bg-gray-700">Rooms</Link>
//                 <Link to="/manage-faculties" className="block py-2.5 px-4 rounded hover:bg-gray-700">Faculties</Link>
//                 <Link to="/manage-sections" className="block py-2.5 px-4 rounded hover:bg-gray-700">Sections</Link>
//             </nav>
//         </aside>
//         <main className="flex-1 p-8 overflow-y-auto">
//             <Outlet />
//         </main>
//     </div>
// );

// export const App = () =>{
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route element={<SidebarLayout />}>
//                     <Route path="/" element={<DashboardPage />} />
//                     <Route path="/generate" element={<GenerateTimetablePage />} />
//                     <Route path="/manage-departments" element={<ManageDepartmentsPage />} />
//                     <Route path="/manage-subjects" element={<ManageSubjectsPage />} />
//                     <Route path="/manage-rooms" element={<ManageRoomsPage />} />
//                     <Route path="/manage-faculties" element={<ManageFacultiesPage />} />
//                     <Route path="/manage-sections" element={<ManageSectionsPage />} />
//                 </Route>
//             </Routes>
//         </Router>
//     );
// }

import { Footer } from "./Components/Footer"
import { Navbar } from "./Components/Navbar"
import { MainRoutes } from "./routes/MainRoutes"




export const App = () => {
    return (<>
        <div className="w-full h-full font-sans bg-[#E6F3FF]">
            <Navbar/>
            <MainRoutes/>
            <Footer/>
        </div>
    </>)
}
