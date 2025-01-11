import { Request } from 'express';
import { Pool, QueryResult } from 'pg';
import { DashboardData, FinancialSummary, Transaction } from '../models/dashboard.model';
import { CustomRequest } from '../types/express';


export class DashboardService {
    async getDashboardData(req: CustomRequest): Promise<DashboardData> {
        try {
            const companyId = req.query.companyId;
            const fiscalYearId = req.query.fiscalYearId;

            const [transactions, summary] = await Promise.all([
                this.getRecentTransactions(req),
                this.getFinancialSummary(req)
            ]);

            return {
                recentTransactions: transactions,
                financialSummary: summary
            };
        } catch (error) {
            throw new Error(`Error fetching dashboard data: ${(error as Error).message}`);
        }
    }

    async getRecentTransactions(req: CustomRequest): Promise<Transaction[]> {
        try {
            const companyId = req.query.companyId;
            const fiscalYearId = req.query.fiscalYearId;

            let params: any[] = [];
            let whereClause = '';

            if (companyId) {
                params.push(companyId);
                whereClause += ' WHERE company_id = $1';
            }

            if (fiscalYearId) {
                params.push(fiscalYearId);
                whereClause += params.length === 1 ? ' WHERE' : ' AND';
                whereClause += ` fiscal_year_id = $${params.length}`;
            }

            const query = `
                SELECT * FROM transactions
                ${whereClause}
                ORDER BY date DESC
                LIMIT 10
            `;

            const result: QueryResult = await req.db.query(query, params);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching recent transactions: ${(error as Error).message}`);
        }
    }

    async getFinancialSummary(req: CustomRequest): Promise<FinancialSummary> {
        try {
            const companyId = req.query.companyId;
            const fiscalYearId = req.query.fiscalYearId;

            let params: any[] = [];
            let whereClause = '';

            if (companyId) {
                params.push(companyId);
                whereClause += ' WHERE company_id = $1';
            }

            if (fiscalYearId) {
                params.push(fiscalYearId);
                whereClause += params.length === 1 ? ' WHERE' : ' AND';
                whereClause += ` fiscal_year_id = $${params.length}`;
            }

            const query = `
                SELECT 
                    SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_income,
                    SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as total_expenses,
                    SUM(amount) as net_income
                FROM transactions
                ${whereClause}
            `;

            const result: QueryResult = await req.db.query(query, params);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error fetching financial summary: ${(error as Error).message}`);
        }
    }
}
