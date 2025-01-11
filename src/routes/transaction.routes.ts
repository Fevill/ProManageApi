import express, { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';

const router: Router = express.Router();
const transactionController = new TransactionController();

// Get all transactions
router.get('/', (req, res) => transactionController.getTransactions(req, res));

// Create transaction
router.post('/', (req, res) => transactionController.createTransaction(req, res));

export default router;
