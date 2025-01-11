import { Request } from 'express';
import { Pool, QueryResult } from 'pg';
import { Balance } from '../models/balance.model';
import { CustomRequest } from '../types/express';

export class BalancesService {
    async getBalance(req: CustomRequest): Promise<Balance[]> {
        try {
            const result: QueryResult = await req.db.query(
                'SELECT * FROM balance ORDER BY date DESC'
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching balance: ${(error as Error).message}`);
        }
    }

    async getBalanceByCompany(req: CustomRequest): Promise<Balance[]> {
        try {
            const companyId = req.params.companyId;
            const result: QueryResult = await req.db.query(
                'SELECT * FROM balance WHERE company_id = $1 ORDER BY date DESC',
                [companyId]
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching balance by company: ${(error as Error).message}`);
        }
    }

    async getBalanceByPeriod(req: CustomRequest): Promise<Balance[]> {
        try {
            const { startDate, endDate, companyId } = req.query;
            const result: QueryResult = await req.db.query(
                `SELECT * FROM balance 
                WHERE company_id = $1 
                AND date BETWEEN $2 AND $3 
                ORDER BY date DESC`,
                [companyId, startDate, endDate]
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching balance by period: ${(error as Error).message}`);
        }
    }
}
