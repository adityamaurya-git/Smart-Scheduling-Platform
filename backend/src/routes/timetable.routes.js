const express = require('express');
const router = express.Router();
const controller = require('../controllers/timetable.controller');
const middleware = require('../middlewares/auth.middleware');

router.post('/generate' , middleware.authMiddleware, controller.generateTimetableFor);
router.post('/', middleware.authMiddleware, controller.createTimetable);

// 3. Route to GET all saved timetables from the database
// METHOD: GET /api/timetables/
router.get('/', middleware.authMiddleware, controller.getAlltimetable);

// 4. Route to GET a single saved timetable by its ID
// METHOD: GET /api/timetables/:id
router.get('/:id', middleware.authMiddleware, controller.getTimetableById);


module.exports = router;