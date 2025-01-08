const express = require('express');
const {
  createProductivity,
  getProductivityEntries,
  getProductivityEntriesForUser,
  getProductivityById,
  updateProductivity,
  deleteProductivity,
} = require('../controllers/ProductivityController');

const router = express.Router();

router.post('/', createProductivity);
router.get('/', getProductivityEntries);
router.get('/user/:userId', getProductivityEntriesForUser);
router.get('/:id', getProductivityById);
router.put('/:id', updateProductivity);
router.delete('/:id', deleteProductivity);

module.exports = router;
