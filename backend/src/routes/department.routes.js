const express = require('express');
const router = express.Router();
const controller = require('../controllers/department.controller');
const middleware = require('../middlewares/auth.middleware');

router.post('/create' , middleware.authMiddleware , controller.createDepartment);
router.get('/', middleware.authMiddleware , controller.getAllDepartments);
router.put('/:id', middleware.authMiddleware , controller.updateDepartment);
router.delete('/:id', middleware.authMiddleware , controller.deleteDepartment);

module.exports = router;