import { Request, Response } from 'express';
import { AccountingService } from '../services/accounting.service';

export class AccountingController {
    private accountingService: AccountingService;

    constructor() {
        this.accountingService = new AccountingService();
    }

    async getAccounts(req: Request, res: Response): Promise<void> {
        try {
            const accounts = await this.accountingService.getAccounts(req);
            res.json(accounts);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getAccountById(req: Request, res: Response): Promise<void> {
        try {
            const account = await this.accountingService.getAccountById(req);
            if (account) {
                res.json(account);
            } else {
                res.status(404).json({ message: 'Account not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async createAccount(req: Request, res: Response): Promise<void> {
        try {
            const newAccount = await this.accountingService.createAccount(req);
            res.status(201).json(newAccount);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateAccount(req: Request, res: Response): Promise<void> {
        try {
            const updatedAccount = await this.accountingService.updateAccount(req);
            if (updatedAccount) {
                res.json(updatedAccount);
            } else {
                res.status(404).json({ message: 'Account not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async deleteAccount(req: Request, res: Response): Promise<void> {
        try {
            const deleted = await this.accountingService.deleteAccount(req);
            if (deleted) {
                res.json({ message: 'Account deleted successfully' });
            } else {
                res.status(404).json({ message: 'Account not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getAccountBalance(req: Request, res: Response): Promise<void> {
        try {
            const balance = await this.accountingService.getAccountBalance(req);
            res.json(balance);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getAccountTransactions(req: Request, res: Response): Promise<void> {
        try {
            const transactions = await this.accountingService.getAccountTransactions(req);
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async recordTransaction(req: Request, res: Response): Promise<void> {
        try {
            const transaction = await this.accountingService.recordTransaction(req);
            res.status(201).json(transaction);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
