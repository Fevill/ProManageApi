import express, { Express, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import accountingRoutes from './routes/accounting.routes';
import balanceRoutes from './routes/balance.routes';
import bilanRoutes from './routes/bilan.routes';
import companyRoutes from './routes/company.routes';
import dashboardRoutes from './routes/dashboard.routes';
import fiscalYearRoutes from './routes/fiscal-year.routes';
import forecastRoutes from './routes/forecast.routes';
import ledgerRoutes from './routes/ledger.routes';
import profileRoutes from './routes/profile.routes';
import projectRoutes from './routes/project.routes';
import resultatRoutes from './routes/resultat.routes';
import transactionRoutes from './routes/transaction.routes';

dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'promanage_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Extend Express Request type to include db
declare global {
  namespace Express {
    interface Request {
      db: Pool;
    }
  }
}

// Make db pool available in req object
app.use((req: Request, _res: Response, next: NextFunction) => {
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
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
