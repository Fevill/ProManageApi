import { Request, Response } from 'express';
import { LedgersService } from '../services/ledgers.service';

export class LedgerController {
    private ledgersService: LedgersService;

    constructor() {
        this.ledgersService = new LedgersService();
    }

    async getLedgerEntries(req: Request, res: Response): Promise<void> {
        try {
            const entries = await this.ledgersService.getLedgerEntries(req);
            res.json(entries);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getLedgerByAccount(req: Request, res: Response): Promise<void> {
        try {
            const entries = await this.ledgersService.getLedgerByAccount(req);
            res.json(entries);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async createLedgerEntry(req: Request, res: Response): Promise<void> {
        try {
            const newEntry = await this.ledgersService.createLedgerEntry(req);
            res.status(201).json(newEntry);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateLedgerEntry(req: Request, res: Response): Promise<void> {
        try {
            const updatedEntry = await this.ledgersService.updateLedgerEntry(req);
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
