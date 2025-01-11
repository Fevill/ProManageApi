import express, { Router } from 'express';
import { AccountsController } from '../controllers/accounts.controller';

const router: Router = express.Router();
const accountsController = new AccountsController();

// Get all accounts
router.get('/accounts', (req, res) => accountsController.getAccounts(req, res));

// Get specific account
router.get('/accounts/:id', (req, res) => accountsController.getAccountById(req, res));

// Create account
router.post('/accounts', (req, res) => accountsController.createAccount(req, res));

// Update account
router.put('/accounts/:id', (req, res) => accountsController.updateAccount(req, res));

// Delete account
router.delete('/accounts/:id', (req, res) => accountsController.deleteAccount(req, res));

// Get account balance
router.get('/accounts/:accountId/balance', (req, res) => accountsController.getAccountBalance(req, res));

// Get account transactions
router.get('/accounts/:accountId/transactions', (req, res) => accountsController.getAccountTransactions(req, res));

// Record transaction
router.post('/transactions', (req, res) => accountsController.recordTransaction(req, res));

export default router;
