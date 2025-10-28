const express = require('express');
const router = express.Router();
const controller = require('../controllers/subject.controller');
const middleware = require('../middlewares/auth.middleware');


router.post('/create', middleware.authMiddleware, controller.createSubject );
router.get('/', middleware.authMiddleware, controller.getAllSubjects);
router.put('/:id', middleware.authMiddleware,  controller.updateSubject);
router.delete('/:id', middleware.authMiddleware,  controller.deleteSubject);

module.exports = router;