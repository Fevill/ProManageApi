import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';

export class TransactionController {
    private transactionService: TransactionService;

    constructor() {
        this.transactionService = new TransactionService();
    }

    async getTransactions(req: Request, res: Response): Promise<void> {
        try {
            const transactions = await this.transactionService.getAllTransactions(req);
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async createTransaction(req: Request, res: Response): Promise<void> {
        try {
            const newTransaction = await this.transactionService.createTransaction(req);
            res.status(201).json(newTransaction);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
