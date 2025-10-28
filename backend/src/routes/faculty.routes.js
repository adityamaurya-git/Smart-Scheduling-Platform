const express = require('express');
const router = express.Router();
const controller = require('../controllers/faculty.controller');
const middleware = require('../middlewares/auth.middleware');


router.post('/create', middleware.authMiddleware, controller.createFaculty);
router.patch('/update/:id' , middleware.authMiddleware, controller.updateFaculty);
router.get('/', middleware.authMiddleware,controller.getAllFaculties);
router.delete('/:id', middleware.authMiddleware, controller.deleteFaculty);

module.exports = router;