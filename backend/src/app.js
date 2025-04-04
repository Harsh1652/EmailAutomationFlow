// File: src/app.js
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { authenticateUser } = require('./middleware/auth');
const emailRoutes = require('./routes/email.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/emails', authenticateUser, emailRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;