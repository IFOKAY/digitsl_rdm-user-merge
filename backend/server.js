const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8082;

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/users')); // Note: /api/user not /api/users
app.use('/api/users', require('./routes/users'));
app.use('/api/practices', require('./routes/practices'));
app.use('/api/practice-areas', require('./routes/practiceAreas'));
app.use('/api/user-skills', require('./routes/userSkills'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/professional-certifications', require('./routes/professionalCertifications'));
app.use('/api/high-impact-assets', require('./routes/highImpactAssets'));
app.use('/api/practice-product-technology', require('./routes/practiceProductTechnology'));
app.use('/api/pending-approvals', require('./routes/pendingApprovals'));
app.use('/api/user-messages', require('./routes/userMessages'));
app.use('/oauth2', require('./routes/oauth'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'IBM Skills Pro API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;