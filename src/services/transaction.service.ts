import { Request } from 'express';
import { Pool, QueryResult } from 'pg';
import { Transaction } from '../models/transaction.model';
import { CustomRequest } from '../types/express';

export class TransactionService {
    async getAllTransactions(req: CustomRequest): Promise<Transaction[]> {
        try {
            const isForecast: boolean = req.query.forecast ? String(req.query.forecast).toLowerCase() === 'true' : false;
            const companyId = req.query.companyId;
            const fiscalYearId = req.query.fiscalYearId;

            let params:any[]= [isForecast];
            let whereClause = 't.is_forecast = $1';

            if (companyId) {
                params.push(companyId);
                whereClause += ` AND t.company_id = $${params.length}`;
            }

            if (fiscalYearId) {
                params.push(fiscalYearId);
                whereClause += ` AND t.fiscal_year_id = $${params.length}`;
            }

            const query = `
                SELECT t.* 
                FROM transactions t
                WHERE ${whereClause}
                ORDER BY t.date DESC
            `;

            const result: QueryResult = await req.db.query(query, params);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching transactions: ${(error as Error).message}`);
        }
    }

    async createTransaction(req: CustomRequest): Promise<Transaction> {
        try {
            // Add your transaction creation logic here
            const { /* add your required fields */ } = req.body;
            const result: QueryResult = await req.db.query(
                'INSERT INTO transactions (/* fields */) VALUES (/* values */) RETURNING *'
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating transaction: ${(error as Error).message}`);
        }
    }
}
