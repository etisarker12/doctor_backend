const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models to ensure they are registered
require('./src/models/User');
require('./src/models/Doctor');
require('./src/models/Appointment');

// Connect to database
const connectDB = require('./src/config/db');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Connect to DB and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});