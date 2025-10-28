const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboard.controller');
const middleware = require('../middlewares/auth.middleware');

router.get('/stats', middleware.authMiddleware, getStats);

module.exports = router;