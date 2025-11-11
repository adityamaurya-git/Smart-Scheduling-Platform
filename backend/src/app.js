const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const departmentRoutes = require('./routes/department.routes')
const facultyRoutes = require('./routes/faculty.routes')
const roomRoutes = require('./routes/room.routes')
const subjectRoutes = require('./routes/subject.routes');
const sectionRoutes = require('./routes/section.routes');
const timetableRoutes = require('./routes/timetable.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173','https://smart-scheduling-platform.vercel.app'],
    credentials: true 
}));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/' , (req, res) =>{
    res.send("server started");
})

app.use('/api/auth', authRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/subject', subjectRoutes);
app.use('/api/section', sectionRoutes);


// --- THIS IS THE CORRECTED LINE ---
// The base path is now specific, matching the frontend and avoiding conflicts.
app.use('/api/timetables' , timetableRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.get('*name' , (req ,res)=>{
    res.sendFile(path.join(__dirname,  '../public/index.html'));
})

module.exports = app;
