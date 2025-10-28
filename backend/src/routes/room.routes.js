const express = require('express');
const router = express.Router();
const controller = require('../controllers/room.controller');
const middleware = require('../middlewares/auth.middleware');


router.post('/create', middleware.authMiddleware, controller.createRoom);
router.get('/', middleware.authMiddleware,controller.getAllRooms);
router.put('/:id', middleware.authMiddleware, controller.updateRoom);
router.delete('/:id', middleware.authMiddleware, controller.deleteRoom);

module.exports = router;