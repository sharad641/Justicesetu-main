require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'JusticeSetu API is running perfectly!' });
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/consultations', require('./routes/consultationRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/tracker', require('./routes/caseTrackerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

// Initialize Server
const startServer = async () => {
  try {
    // Sync database - create tables if they don't exist
    // Note: { alter: true } fails on fresh SQLite DBs; use force: false for compatibility
    const useSQLite = process.env.USE_SQLITE === 'true';
    await sequelize.sync(useSQLite ? { force: false } : { alter: true });
    console.log('Database synced successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};
startServer();

// trigger nodemon restart for supabase
// recovering to sqlite mode
