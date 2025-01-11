import { Request, Response } from 'express';
import { BilanService } from '../services/bilan.service';

export class BilanController {
    private bilanService: BilanService;

    constructor() {
        this.bilanService = new BilanService();
    }

    async getBilan(req: Request, res: Response): Promise<void> {
        try {
            const bilans = await this.bilanService.getAllBilans(req);
            res.json(bilans);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async createBilan(req: Request, res: Response): Promise<void> {
        try {
            const newBilan = await this.bilanService.createBilan(req);
            res.status(201).json(newBilan);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
