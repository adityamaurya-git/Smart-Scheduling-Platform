const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const middleware = require('../middlewares/auth.middleware');

router.post('/admin/register' , controller.registerAdmin);
router.post('/admin/login' , controller.loginAdmin);
router.post('/admin/logout' , controller.logoutAdmin);
router.get('/admin/get-details' , middleware.authMiddleware, controller.getAdminDetails);


module.exports = router;