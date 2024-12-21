const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser, loginUser } = require('../controllers/UserController');

const router = express.Router();

router.post('/', createUser); // Create user
router.get('/', getUsers); // Get all users
router.get('/:id', getUserById); // Get user by ID
router.put('/:id', updateUser); // Update user
router.delete('/:id', deleteUser); // Delete user
router.post('/login', loginUser); // Login user

module.exports = router;
