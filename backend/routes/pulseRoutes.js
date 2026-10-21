const express = require('express');
const {
  getAllPulsePosts,
  getPulsePostById,
  createPulsePost,
  updatePulsePost,
  deletePulsePost,
} = require('../controllers/pulseController');

const router = express.Router();

router.get('/', getAllPulsePosts);
router.get('/:id', getPulsePostById);
router.post('/', createPulsePost);
router.put('/:id', updatePulsePost);
router.delete('/:id', deletePulsePost);

module.exports = router;
