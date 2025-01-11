import express, { Router } from 'express';
import { AccountingController } from '../controllers/accounting.controller';

const router: Router = express.Router();
const accountingController = new AccountingController();

// Get all accounts
router.get('/accounts', (req, res) => accountingController.getAccounts(req, res));

// Get specific account
router.get('/accounts/:id', (req, res) => accountingController.getAccountById(req, res));

// Create account
router.post('/accounts', (req, res) => accountingController.createAccount(req, res));

// Update account
router.put('/accounts/:id', (req, res) => accountingController.updateAccount(req, res));

// Delete account
router.delete('/accounts/:id', (req, res) => accountingController.deleteAccount(req, res));

// Get account balance
router.get('/accounts/:accountId/balance', (req, res) => accountingController.getAccountBalance(req, res));

// Get account transactions
router.get('/accounts/:accountId/transactions', (req, res) => accountingController.getAccountTransactions(req, res));

// Record transaction
router.post('/transactions', (req, res) => accountingController.recordTransaction(req, res));

export default router;
