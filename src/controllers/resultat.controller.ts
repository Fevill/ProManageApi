import { Request, Response } from 'express';
import { ResultatService } from '../services/resultat.service';

export class ResultatController {
    private resultatService: ResultatService;

    constructor() {
        this.resultatService = new ResultatService();
    }

    async getResultat(req: Request, res: Response): Promise<void> {
        try {
            const resultat = await this.resultatService.getResultat(req);
            res.json(resultat);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getResultatByPeriod(req: Request, res: Response): Promise<void> {
        try {
            const resultat = await this.resultatService.getResultatByPeriod(req);
            res.json(resultat);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getResultatByCompany(req: Request, res: Response): Promise<void> {
        try {
            const resultat = await this.resultatService.getResultatByCompany(req);
            res.json(resultat);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
