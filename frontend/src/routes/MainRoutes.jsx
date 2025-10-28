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
import { useDispatch, useSelector } from "react-redux";
import { currentUserAction } from "../store/actions/userAction";
import { useEffect } from "react";

export const MainRoutes = () =>{

    const dispatch = useDispatch();

        const {isAuthenticated} = useSelector((state) => state.user);
    
        useEffect(()=>{
           dispatch(currentUserAction());
        },[]);
        
    return(<>
        <Routes>
            <Route path="/" element={<Home/>} />
            {isAuthenticated ? (<>
                <Route path="/admin/dashboard" element={<DashboardPage/>} />
                <Route path="/generate/timetable" element={<GenerateTimetablePage />} />
                <Route path="/manage/departments" element={<ManageDepartmentsPage />} />
                <Route path="/manage/subjects" element={<ManageSubjectsPage />} />
                <Route path="/manage/rooms" element={<ManageRoomsPage />} />
                <Route path="/manage/faculties" element={<ManageFacultiesPage />} />
                <Route path="/manage/sections" element={<ManageSectionsPage />} />
            </>) : 
            (<>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<Register/>} />
            </>) 
            }
           
            

        </Routes>
    </>)
}
