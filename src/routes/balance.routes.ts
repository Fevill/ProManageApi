import express, { Router } from 'express';
import { BalanceController } from '../controllers/balance.controller';

const router: Router = express.Router();
const balanceController = new BalanceController();

// Get general balance
router.get('/', (req, res) => balanceController.getBalance(req, res));

// Get balance by company
router.get('/company/:companyId', (req, res) => balanceController.getBalanceByCompany(req, res));

// Get balance by period
router.get('/period', (req, res) => balanceController.getBalanceByPeriod(req, res));

export default router;
