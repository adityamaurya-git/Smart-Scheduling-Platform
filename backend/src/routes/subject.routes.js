const express = require('express');
const router = express.Router();
const controller = require('../controllers/subject.controller')

router.post('/create',controller.createSubject );
router.get('/',controller.getAllSubjects);
router.put('/:id', controller.updateSubject);
router.delete('/:id', controller.deleteSubject);

module.exports = router;