const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// MongoDB connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Import routes
const sessionRoutes = require('./routes/SessionRoutes');
const rewardRoutes = require('./routes/RewardRoutes');
const productivityRoutes = require('./routes/ProductivityRoutes');
const notificationRoutes = require('./routes/NotificationRoutes');
const goalRoutes = require('./routes/GoalRoutes');
const userRoutes = require('./routes/UserRoutes');

// Use routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/productivity', productivityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});