import { Request } from 'express';
import { Pool, QueryResult } from 'pg';
import { Account, AccountTransaction, AccountBalance } from '../models/accounting.model';
import { CustomRequest } from '../types/express';

export class AccountingService {
    async getAccounts(req: CustomRequest): Promise<Account[]> {
        try {
            const companyId = req.query.companyId;
            let query = 'SELECT * FROM accounts';
            const params: any[] = [];

            if (companyId) {
                query += ' WHERE company_id = $1';
                params.push(companyId);
            }

            query += ' ORDER BY account_number';

            const result: QueryResult = await req.db.query(query, params);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching accounts: ${(error as Error).message}`);
        }
    }

    async getAccountById(req: CustomRequest): Promise<Account | null> {
        try {
            const id = req.params.id;
            const result: QueryResult = await req.db.query(
                'SELECT * FROM accounts WHERE id = $1',
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching account: ${(error as Error).message}`);
        }
    }

    async createAccount(req: CustomRequest): Promise<Account> {
        try {
            const { 
                account_number,
                name,
                type,
                description,
                company_id,
                parent_account_id
            } = req.body;

            const result: QueryResult = await req.db.query(
                `INSERT INTO accounts 
                (account_number, name, type, description, company_id, parent_account_id) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING *`,
                [account_number, name, type, description, company_id, parent_account_id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating account: ${(error as Error).message}`);
        }
    }

    async updateAccount(req: CustomRequest): Promise<Account | null> {
        try {
            const id = req.params.id;
            const { name, description, type } = req.body;

            const result: QueryResult = await req.db.query(
                `UPDATE accounts 
                SET name = $1, description = $2, type = $3, updated_at = CURRENT_TIMESTAMP 
                WHERE id = $4 
                RETURNING *`,
                [name, description, type, id]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error updating account: ${(error as Error).message}`);
        }
    }

    async deleteAccount(req: CustomRequest): Promise<boolean> {
        try {
            const id = req.params.id;
            
            // Check if account has transactions
            const transactionsCheck: QueryResult = await req.db.query(
                'SELECT id FROM account_transactions WHERE account_id = $1 LIMIT 1',
                [id]
            );

            if (transactionsCheck.rows.length > 0) {
                throw new Error('Cannot delete account with existing transactions');
            }

            const result: QueryResult = await req.db.query(
                'DELETE FROM accounts WHERE id = $1 RETURNING id',
                [id]
            );
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error deleting account: ${(error as Error).message}`);
        }
    }

    async getAccountBalance(req: CustomRequest): Promise<AccountBalance> {
        try {
            const accountId = req.params.accountId;
            const { start_date, end_date } = req.query;

            let query = `
                SELECT 
                    COALESCE(SUM(CASE WHEN type = 'DEBIT' THEN amount ELSE 0 END), 0) as total_debit,
                    COALESCE(SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE 0 END), 0) as total_credit
                FROM account_transactions 
                WHERE account_id = $1
            `;
            const params: any[] = [accountId];

            if (start_date && end_date) {
                query += ' AND date BETWEEN $2 AND $3';
                params.push(start_date, end_date);
            }

            const result: QueryResult = await req.db.query(query, params);
            const { total_debit, total_credit } = result.rows[0];

            return {
                account_id: parseInt(accountId),
                total_debit,
                total_credit,
                balance: total_debit - total_credit
            };
        } catch (error) {
            throw new Error(`Error fetching account balance: ${(error as Error).message}`);
        }
    }

    async getAccountTransactions(req: CustomRequest): Promise<AccountTransaction[]> {
        try {
            const accountId = req.params.accountId;
            const { start_date, end_date } = req.query;
            let query = 'SELECT * FROM account_transactions WHERE account_id = $1';
            const params: any[] = [accountId];

            if (start_date && end_date) {
                query += ' AND date BETWEEN $2 AND $3';
                params.push(start_date, end_date);
            }

            query += ' ORDER BY date DESC';

            const result: QueryResult = await req.db.query(query, params);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching account transactions: ${(error as Error).message}`);
        }
    }

    async recordTransaction(req: CustomRequest): Promise<AccountTransaction> {
        try {
            const { 
                account_id,
                date,
                type,
                amount,
                description,
                reference,
                company_id
            } = req.body;

            const result: QueryResult = await req.db.query(
                `INSERT INTO account_transactions 
                (account_id, date, type, amount, description, reference, company_id) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                RETURNING *`,
                [account_id, date, type, amount, description, reference, company_id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error recording transaction: ${(error as Error).message}`);
        }
    }
}
