const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Import routes
const accountingRoutes = require('./src/routes/accounting.routes');
const balanceRoutes = require('./src/routes/balance.routes');
const bilanRoutes = require('./src/routes/bilan.routes');
const companyRoutes = require('./src/routes/company.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const fiscalYearRoutes = require('./src/routes/fiscal-year.routes');
const forecastRoutes = require('./src/routes/forecast.routes');
const ledgerRoutes = require('./src/routes/ledger.routes');
const profileRoutes = require('./src/routes/profile.routes');
const projectRoutes = require('./src/routes/project.routes');
const resultatRoutes = require('./src/routes/resultat.routes');
const transactionRoutes = require('./src/routes/transaction.routes');

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'promanage_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Make db pool available in req object
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Routes
app.use('/api/accounting', accountingRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/bilan', bilanRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/fiscal-year', fiscalYearRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/resultat', resultatRoutes);
app.use('/api/transaction', transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
