import { Request, Response } from 'express';
import { BalanceService } from '../services/balance.service';

export class BalanceController {
    private balanceService: BalanceService;

    constructor() {
        this.balanceService = new BalanceService();
    }

    async getBalance(req: Request, res: Response): Promise<void> {
        try {
            const balance = await this.balanceService.getBalance(req);
            res.json(balance);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getBalanceByCompany(req: Request, res: Response): Promise<void> {
        try {
            const balance = await this.balanceService.getBalanceByCompany(req);
            res.json(balance);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getBalanceByPeriod(req: Request, res: Response): Promise<void> {
        try {
            const balance = await this.balanceService.getBalanceByPeriod(req);
            res.json(balance);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
