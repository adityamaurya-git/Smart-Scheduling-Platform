const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');

router.post('/admin/register' , controller.registerAdmin);
router.post('/admin/login' , controller.loginAdmin);
router.post('/admin/logout' , controller.logoutAdmin);


module.exports = router;