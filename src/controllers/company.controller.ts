import { Request, Response } from 'express';
import { CompanyService } from '../services/company.service';

export class CompanyController {
    private companyService: CompanyService;

    constructor() {
        this.companyService = new CompanyService();
    }

    async getCompanies(req: Request, res: Response): Promise<void> {
        try {
            const companies = await this.companyService.getAllCompanies(req);
            res.json(companies);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getCompany(req: Request, res: Response): Promise<void> {
        try {
            const company = await this.companyService.getCompanyById(req);
            if (company) {
                res.json(company);
            } else {
                res.status(404).json({ message: 'Company not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async createCompany(req: Request, res: Response): Promise<void> {
        try {
            const newCompany = await this.companyService.createCompany(req);
            res.status(201).json(newCompany);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateCompany(req: Request, res: Response): Promise<void> {
        try {
            const updatedCompany = await this.companyService.updateCompany(req);
            if (updatedCompany) {
                res.json(updatedCompany);
            } else {
                res.status(404).json({ message: 'Company not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async deleteCompany(req: Request, res: Response): Promise<void> {
        try {
            const deleted = await this.companyService.deleteCompany(req);
            if (deleted) {
                res.json({ message: 'Company deleted successfully' });
            } else {
                res.status(404).json({ message: 'Company not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
