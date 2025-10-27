import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import GenerateTimetablePage from "../pages/GenerateTimetablePage";
import ManageDepartmentsPage from "../pages/ManageDepartmentPage";
import ManageSubjectsPage from "../pages/ManageSubjectsPage";
import ManageRoomsPage from "../pages/ManageRoomsPage";
import ManageFacultiesPage from "../pages/ManageFacultiesPage";
import ManageSectionsPage from "../pages/ManageSectionsPage";    
import { Register } from "../pages/Register";

export const MainRoutes = () =>{

    return(<>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/admin/dashboard" element={<DashboardPage/>} />
            <Route path="/generate/timetable" element={<GenerateTimetablePage />} />
            <Route path="/manage/departments" element={<ManageDepartmentsPage />} />
            <Route path="/manage/subjects" element={<ManageSubjectsPage />} />
            <Route path="/manage/rooms" element={<ManageRoomsPage />} />
            <Route path="/manage/faculties" element={<ManageFacultiesPage />} />
            <Route path="/manage/sections" element={<ManageSectionsPage />} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<Register/>} />
        </Routes>
    </>)
}
