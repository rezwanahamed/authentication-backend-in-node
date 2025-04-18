require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userDataRoutes = require('./routes/userDataRoutes');
const connectDB = require('./config/database');
const cors = require('cors');

const app = express();

// CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://authentication-frontend-nu.vercel.app',
        process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/authorize-user', userDataRoutes);

// Database connection
connectDB();
// Removing direct mongoose connection in favor of the connectDB function
// that uses the custom database name

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
