// Update the main index.js file to include classes routes
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const classRoutes = require('./routes/classes');
const wordBookRoutes = require('./routes/wordBooks');
const wordRoutes = require('./routes/words');
const learningRecordRoutes = require('./routes/learningRecords');
const gameRecordRoutes = require('./routes/gameRecords');

// Import middleware
const { errorHandler } = require('./middleware/error');

// Import logger
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/wordbooks', wordBookRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/learning-records', learningRecordRoutes);
app.use('/api/game-records', gameRecordRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/english-word-app')
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Database connection error:', error);
  });