import { Request, Response } from 'express';
import { CustomRequest } from '../types/express';
import { BilansService } from '../services/bilans.service';

export class BilansController {
  private bilansService: BilansService;

  constructor() {
    this.bilansService = new BilansService();
  }

  async getBilans(req: CustomRequest, res: Response) {
    try {
      const { companyId, fiscalYearId } = req.query;
      
      if (!companyId || !fiscalYearId) {
        return res.status(400).json({ error: 'Company ID and Fiscal Year ID are required' });
      }

      // TODO: Implement bilan logic
      const bilans = await this.bilansService.getAllBilans(req);
      
      res.json(bilans);
    } catch (error) {
      console.error('Error in getBilans:', error);
      res.status(500).json({ error: 'Failed to retrieve bilans' });
    }
  }

  async getBilanById(req: CustomRequest, res: Response) {
    try {
      const { id } = req.params;
      
      // TODO: Implement get bilan by ID logic
      const bilan = await this.bilansService.getBilanById(req);
      
      if (!bilan) {
        return res.status(404).json({ error: 'Bilan not found' });
      }
      
      res.json(bilan);
    } catch (error) {
      console.error('Error in getBilanById:', error);
      res.status(500).json({ error: 'Failed to retrieve bilan' });
    }
  }

  async createBilan(req: CustomRequest, res: Response) {
    try {
      const newBilan = await this.bilansService.createBilan(req);
      res.status(201).json(newBilan);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
