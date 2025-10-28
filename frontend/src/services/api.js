import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://smart-scheduling-platform.onrender.com/api',
    withCredentials: true,
});

// --- Admin Auth ---
export const loginAdmin = (credentials) => api.post('/auth/admin/login', credentials);
export const logoutAdmin = () => api.post('/auth/admin/logout');
export const registerAdmin = (data) => api.post('/auth/admin/register', data);

// --- Dashboard ---
export const getDashboardStats = () => api.get('/dashboard/stats');

// --- Department Management ---
export const createDepartment = (data) => api.post('/department/create', data);
export const getAllDepartments = () => api.get('/department');
export const updateDepartment = (id, data) => api.put(`/department/${id}`, data);
export const deleteDepartment = (id) => api.delete(`/department/${id}`);

// --- Subject Management ---
export const createSubject = (data) => api.post('/subject/create', data);
export const getAllSubjects = () => api.get('/subject');
export const updateSubject = (id, data) => api.put(`/subject/${id}`, data);
export const deleteSubject = (id) => api.delete(`/subject/${id}`);

// --- Room Management ---
export const createRoom = (data) => api.post('/room/create', data);
export const getAllRooms = () => api.get('/room');
export const updateRoom = (id, data) => api.put(`/room/${id}`, data);
export const deleteRoom = (id) => api.delete(`/room/${id}`);

// --- Faculty Management ---
export const createFaculty = (data) => api.post('/faculty/create', data);
export const getAllFaculties = () => api.get('/faculty');
export const updateFaculty = (id, data) => api.patch(`/faculty/update/${id}`, data);
export const deleteFaculty = (id) => api.delete(`/faculty/${id}`);

// --- Section Management ---
export const createSection = (data) => api.post('/section/create', data);
export const getAllSections = () => api.get('/section');
export const updateSection = (id, data) => api.put(`/section/${id}`, data);
export const deleteSection = (id) => api.delete(`/section/${id}`);




export const generateTimetable = (data) => api.post('/timetables/generate', data);


export const saveTimetable = (timetableData) => api.post('/timetables', timetableData);


export const getAllTimetables = () => api.get('/timetables');


export const getTimetableById = (id) => api.get(`/timetables/${id}`);

