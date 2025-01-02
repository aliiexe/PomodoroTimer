const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a new user
const createUser = async (req, res) => {
    try {
        console.log("Creating a new user:", req.body);
        const { username, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ username, email, passwordHash });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        console.log("Fetching all users");
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Get a single user by ID
const getUserById = async (req, res) => {
    try {
        console.log("Fetching user by ID:", req.params.id);
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        console.log("Updating user:", req.params.id, req.body);
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        console.log("Deleting user:", req.params.id);
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

// Login a user
const loginUser = async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        console.log("Logging in user:", emailOrUsername);
        // Find user by email or username
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        // Return the token and user data
        res.status(200).json({ token, user });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: 'Error logging in', error });
    }
};


const addReward = async (req, res) => {
    try {
        console.log("Adding reward to user:", req.params.id, req.params.rewardId);
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.rewards.push(req.params.rewardId);
        await user.save();
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error adding reward to user:", error);
        res.status(500).json({ message: 'Error adding reward to user', error });
    }
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    addReward
};