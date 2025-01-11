import express, { Request, Response, Router } from 'express';
import { Pool, QueryResult } from 'pg';
import { DashboardController } from '../controllers/dashboard.controller';

// Extend Express Request type to include db
interface CustomRequest extends Request {
  db: Pool;
}

const router: Router = express.Router();
const dashboardController = new DashboardController();

// Get dashboard data
router.get('/', (req: CustomRequest, res: Response) => dashboardController.getDashboardData(req, res));

// Get recent transactions
router.get('/transactions', (req: CustomRequest, res: Response) => dashboardController.getRecentTransactions(req, res));

// Get financial summary
router.get('/summary', (req: CustomRequest, res: Response) => dashboardController.getFinancialSummary(req, res));

// Export the router
export default router;
