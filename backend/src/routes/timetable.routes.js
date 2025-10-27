const express = require('express');
const router = express.Router();
const controller = require('../controllers/timetable.controller');

router.post('/generate' , controller.generateTimetableFor);
router.post('/', controller.createTimetable);

// 3. Route to GET all saved timetables from the database
// METHOD: GET /api/timetables/
router.get('/', controller.getAlltimetable);

// 4. Route to GET a single saved timetable by its ID
// METHOD: GET /api/timetables/:id
router.get('/:id', controller.getTimetableById);


module.exports = router;