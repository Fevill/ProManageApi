import express, { Router } from 'express';
import { LedgerController } from '../controllers/ledgers.controller';

const router: Router = express.Router();
const ledgerController = new LedgerController();

// Get all ledger entries
router.get('/', (req, res) => ledgerController.getLedgerEntries(req, res));

// Get ledger entries by account
router.get('/account/:accountId', (req, res) => ledgerController.getLedgerByAccount(req, res));

// Create ledger entry
router.post('/', (req, res) => ledgerController.createLedgerEntry(req, res));

// Update ledger entry
router.put('/:id', (req, res) => ledgerController.updateLedgerEntry(req, res));

export default router;
