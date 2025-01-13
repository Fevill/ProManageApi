import { Request } from 'express';
import { Pool, QueryResult } from 'pg';
import { Transaction } from '../models/transaction.model';
import { CustomRequest } from '../types/express';

export class TransactionsService {
    async getAllTransactions(req: CustomRequest): Promise<Transaction[]> {
        try {
            const isForecast: boolean = req.query.forecast ? String(req.query.forecast).toLowerCase() === 'true' : false;
            const companyId = req.query.companyId;
            const fiscalYearId = req.query.fiscalYearId;

            let params: any[] = [isForecast];
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
                SELECT t.*, 
                    json_build_object(
                        'id', da.id,
                        'code', da.code,
                        'name', da.name,
                        'type_id', da.type_id,
                        'classe_pcg_id', da.classe_pcg_id,
                        'is_active', da.is_active,
                        'is_auxiliaire', da.is_auxiliaire
                    ) as debit_account,
                    json_build_object(
                        'id', ca.id,
                        'code', ca.code,
                        'name', ca.name,
                        'type_id', ca.type_id,
                        'classe_pcg_id', ca.classe_pcg_id,
                        'is_active', ca.is_active,
                        'is_auxiliaire', ca.is_auxiliaire
                    ) as credit_account
                FROM transaction t
                LEFT JOIN account da ON t.debit_account_id = da.id
                LEFT JOIN account ca ON t.credit_account_id = ca.id
                WHERE ${whereClause}
                ORDER BY t.date DESC, t.created_at DESC
            `;

            const result: QueryResult = await req.db.query(query, params);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching transactions: ${(error as Error).message}`);
        }
    }

    async getTransactionById(req: CustomRequest): Promise<Transaction | null> {
        try {
            const id = req.params.id;
            const result: QueryResult = await req.db.query(
                `SELECT t.*, 
                    json_build_object(
                        'id', da.id,
                        'code', da.code,
                        'name', da.name,
                        'type_id', da.type_id,
                        'classe_pcg_id', da.classe_pcg_id,
                        'is_active', da.is_active,
                        'is_auxiliaire', da.is_auxiliaire
                    ) as debit_account,
                    json_build_object(
                        'id', ca.id,
                        'code', ca.code,
                        'name', ca.name,
                        'type_id', ca.type_id,
                        'classe_pcg_id', ca.classe_pcg_id,
                        'is_active', ca.is_active,
                        'is_auxiliaire', ca.is_auxiliaire
                    ) as credit_account
                FROM transaction t
                LEFT JOIN account da ON t.debit_account_id = da.id
                LEFT JOIN account ca ON t.credit_account_id = ca.id
                WHERE t.id = $1`,
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching transaction: ${(error as Error).message}`);
        }
    }

    async createTransaction(req: CustomRequest): Promise<Transaction> {
        try {
            const {
                date,
                amount,
                description,
                reference,
                is_forecast,
                company_id,
                fiscal_year_id,
                debit_account_id,
                credit_account_id
            } = req.body;

            const result: QueryResult = await req.db.query(
                `INSERT INTO transaction 
                (date, amount, description, reference, is_forecast, company_id, 
                fiscal_year_id, debit_account_id, credit_account_id) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                RETURNING *`,
                [date, amount, description, reference, is_forecast, company_id, 
                fiscal_year_id, debit_account_id, credit_account_id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating transaction: ${(error as Error).message}`);
        }
    }

    async updateTransaction(req: CustomRequest): Promise<Transaction | null> {
        try {
            const id = req.params.id;
            const {
                date,
                amount,
                description,
                reference,
                is_forecast,
                debit_account_id,
                credit_account_id
            } = req.body;

            const result: QueryResult = await req.db.query(
                `UPDATE transaction 
                SET date = $1, amount = $2, description = $3, reference = $4, 
                    is_forecast = $5, debit_account_id = $6, credit_account_id = $7,
                    updated_at = CURRENT_TIMESTAMP 
                WHERE id = $8 
                RETURNING *`,
                [date, amount, description, reference, is_forecast, 
                debit_account_id, credit_account_id, id]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error updating transaction: ${(error as Error).message}`);
        }
    }

    async deleteTransaction(req: CustomRequest): Promise<boolean> {
        try {
            const id = req.params.id;
            const result: QueryResult = await req.db.query(
                'DELETE FROM transaction WHERE id = $1 RETURNING id',
                [id]
            );
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error deleting transaction: ${(error as Error).message}`);
        }
    }

    async getTransactionsByAccount(req: CustomRequest): Promise<Transaction[]> {
        try {
            const accountId = req.params.accountId;
            const result: QueryResult = await req.db.query(
                `SELECT t.*, 
                    json_build_object(
                        'id', da.id,
                        'code', da.code,
                        'name', da.name,
                        'type_id', da.type_id,
                        'classe_pcg_id', da.classe_pcg_id,
                        'is_active', da.is_active,
                        'is_auxiliaire', da.is_auxiliaire
                    ) as debit_account,
                    json_build_object(
                        'id', ca.id,
                        'code', ca.code,
                        'name', ca.name,
                        'type_id', ca.type_id,
                        'classe_pcg_id', ca.classe_pcg_id,
                        'is_active', ca.is_active,
                        'is_auxiliaire', ca.is_auxiliaire
                    ) as credit_account
                FROM transaction t
                LEFT JOIN account da ON t.debit_account_id = da.id
                LEFT JOIN account ca ON t.credit_account_id = ca.id
                WHERE t.debit_account_id = $1 OR t.credit_account_id = $1
                ORDER BY t.date DESC, t.created_at DESC`,
                [accountId]
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching transactions by account: ${(error as Error).message}`);
        }
    }

    async getAccountBalance(req: CustomRequest): Promise<{ balance: number }> {
        try {
            const accountId = req.params.accountId;
            const result: QueryResult = await req.db.query(
                `SELECT 
                    COALESCE(SUM(CASE WHEN debit_account_id = $1 THEN amount ELSE 0 END), 0) -
                    COALESCE(SUM(CASE WHEN credit_account_id = $1 THEN amount ELSE 0 END), 0) as balance
                FROM transaction
                WHERE debit_account_id = $1 OR credit_account_id = $1`,
                [accountId]
            );
            return { balance: parseFloat(result.rows[0].balance) };
        } catch (error) {
            throw new Error(`Error calculating account balance: ${(error as Error).message}`);
        }
    }
}
