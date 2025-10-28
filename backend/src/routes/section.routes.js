const express = require('express');
const router = express.Router();
const controller = require('../controllers/section.controller');
const middleware = require('../middlewares/auth.middleware');

router.post('/create', middleware.authMiddleware, controller.createSection);
router.get('/', middleware.authMiddleware,controller.getAllSections);
router.put('/:id', middleware.authMiddleware, controller.updateSection);
router.delete('/:id', middleware.authMiddleware, controller.deleteSection);

module.exports = router;