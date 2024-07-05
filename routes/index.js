const express = require('express');
const authRoutes = require('./auth');
const fileRoutes = require('./fileRoutes');

const app = express.Router();

app.use('/api/auth',authRoutes);
app.use('/api/csv', fileRoutes);

module.exports= app;