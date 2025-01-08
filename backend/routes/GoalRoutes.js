const express = require('express');
const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  getGoalsForUser
} = require('../controllers/GoalController');

const router = express.Router();

router.post('/', createGoal);
router.get('/', getGoals);
router.get('/user/:userId', getGoalsForUser);
router.get('/:id', getGoalById);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
