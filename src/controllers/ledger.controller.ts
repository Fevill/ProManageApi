import { Request, Response } from 'express';
import { LedgerService } from '../services/ledger.service';

export class LedgerController {
    private ledgerService: LedgerService;

    constructor() {
        this.ledgerService = new LedgerService();
    }

    async getLedgerEntries(req: Request, res: Response): Promise<void> {
        try {
            const entries = await this.ledgerService.getLedgerEntries(req);
            res.json(entries);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getLedgerByAccount(req: Request, res: Response): Promise<void> {
        try {
            const entries = await this.ledgerService.getLedgerByAccount(req);
            res.json(entries);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async createLedgerEntry(req: Request, res: Response): Promise<void> {
        try {
            const newEntry = await this.ledgerService.createLedgerEntry(req);
            res.status(201).json(newEntry);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateLedgerEntry(req: Request, res: Response): Promise<void> {
        try {
            const updatedEntry = await this.ledgerService.updateLedgerEntry(req);
            if (updatedEntry) {
                res.json(updatedEntry);
            } else {
                res.status(404).json({ message: 'Ledger entry not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
