const express = require('express');
const {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
} = require('../controllers/SessionController');

const router = express.Router();

router.post('/', createSession);
router.get('/', getSessions);
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

module.exports = router;
