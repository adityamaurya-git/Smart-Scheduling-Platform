const express = require('express');
const router = express.Router();
const controller = require('../controllers/department.controller');

router.post('/create' , controller.createDepartment);
router.get('/', controller.getAllDepartments);
router.put('/:id', controller.updateDepartment);
router.delete('/:id', controller.deleteDepartment);

module.exports = router;