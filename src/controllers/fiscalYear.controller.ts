import { Request, Response } from 'express';
import { FiscalYearService } from '../services/fiscalYear.service';

export class FiscalYearController {
    private fiscalYearService: FiscalYearService;

    constructor() {
        this.fiscalYearService = new FiscalYearService();
    }

    async getFiscalYears(req: Request, res: Response): Promise<void> {
        try {
            const fiscalYears = await this.fiscalYearService.getAllFiscalYears(req);
            res.json(fiscalYears);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getFiscalYear(req: Request, res: Response): Promise<void> {
        try {
            const fiscalYear = await this.fiscalYearService.getFiscalYearById(req);
            if (fiscalYear) {
                res.json(fiscalYear);
            } else {
                res.status(404).json({ message: 'Fiscal year not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getCurrentFiscalYear(req: Request, res: Response): Promise<void> {
        try {
            const fiscalYear = await this.fiscalYearService.getCurrentFiscalYear(req);
            if (fiscalYear) {
                res.json(fiscalYear);
            } else {
                res.status(404).json({ message: 'Current fiscal year not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async createFiscalYear(req: Request, res: Response): Promise<void> {
        try {
            const newFiscalYear = await this.fiscalYearService.createFiscalYear(req);
            res.status(201).json(newFiscalYear);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateFiscalYear(req: Request, res: Response): Promise<void> {
        try {
            const updatedFiscalYear = await this.fiscalYearService.updateFiscalYear(req);
            if (updatedFiscalYear) {
                res.json(updatedFiscalYear);
            } else {
                res.status(404).json({ message: 'Fiscal year not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async deleteFiscalYear(req: Request, res: Response): Promise<void> {
        try {
            const deleted = await this.fiscalYearService.deleteFiscalYear(req);
            if (deleted) {
                res.json({ message: 'Fiscal year deleted successfully' });
            } else {
                res.status(404).json({ message: 'Fiscal year not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
