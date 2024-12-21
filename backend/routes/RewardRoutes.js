const express = require('express');
const {
  createReward,
  getRewards,
  getRewardById,
  updateReward,
  deleteReward,
} = require('../controllers/RewardController');

const router = express.Router();

router.post('/', createReward);
router.get('/', getRewards);
router.get('/:id', getRewardById);
router.put('/:id', updateReward);
router.delete('/:id', deleteReward);

module.exports = router;
