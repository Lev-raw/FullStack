const express = require('express');
const { getSection, updateSection } = require('../controllers/siteSectionsController');

const router = express.Router();

router.get('/:key', getSection);
router.put('/:key', updateSection);

module.exports = router;
