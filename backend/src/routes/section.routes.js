const express = require('express');
const router = express.Router();
const controller = require('../controllers/section.controller');

router.post('/create', controller.createSection);
router.get('/',controller.getAllSections);
router.put('/:id', controller.updateSection);
router.delete('/:id', controller.deleteSection);

module.exports = router;