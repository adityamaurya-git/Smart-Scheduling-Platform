const express = require('express');
const router = express.Router();
const controller = require('../controllers/faculty.controller');

router.post('/create', controller.createFaculty);
router.patch('/update/:id' , controller.updateFaculty);
router.get('/',controller.getAllFaculties);
router.delete('/:id', controller.deleteFaculty);

module.exports = router;