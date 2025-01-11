import { Request } from 'express';
import { Pool, QueryResult } from 'pg';
import { LedgerEntry } from '../models/ledger.model';
import { CustomRequest } from '../types/express';

export class LedgersService {
    async getLedgerEntries(req: CustomRequest): Promise<LedgerEntry[]> {
        try {
            const { companyId, fiscalYearId } = req.query;
            let query = 'SELECT * FROM ledger';
            const params: any[] = [];

            if (companyId || fiscalYearId) {
                query += ' WHERE';
                if (companyId) {
                    params.push(companyId);
                    query += ` company_id = $${params.length}`;
                }
                if (fiscalYearId) {
                    if (params.length > 0) query += ' AND';
                    params.push(fiscalYearId);
                    query += ` fiscal_year_id = $${params.length}`;
                }
            }

            query += ' ORDER BY date DESC';

            const result: QueryResult = await req.db.query(query, params);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching ledger entries: ${(error as Error).message}`);
        }
    }

    async getLedgerByAccount(req: CustomRequest): Promise<LedgerEntry[]> {
        try {
            const accountId = req.params.accountId;
            const result: QueryResult = await req.db.query(
                'SELECT * FROM ledger WHERE account_id = $1 ORDER BY date DESC',
                [accountId]
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching ledger by account: ${(error as Error).message}`);
        }
    }

    async createLedgerEntry(req: CustomRequest): Promise<LedgerEntry> {
        try {
            const { 
                date, 
                account_id, 
                description, 
                debit, 
                credit, 
                company_id, 
                fiscal_year_id 
            } = req.body;

            const result: QueryResult = await req.db.query(
                `INSERT INTO ledger 
                (date, account_id, description, debit, credit, company_id, fiscal_year_id) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                RETURNING *`,
                [date, account_id, description, debit, credit, company_id, fiscal_year_id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating ledger entry: ${(error as Error).message}`);
        }
    }

    async updateLedgerEntry(req: CustomRequest): Promise<LedgerEntry | null> {
        try {
            const id = req.params.id;
            const { date, description, debit, credit } = req.body;

            const result: QueryResult = await req.db.query(
                `UPDATE ledger 
                SET date = $1, description = $2, debit = $3, credit = $4, 
                    updated_at = CURRENT_TIMESTAMP 
                WHERE id = $5 
                RETURNING *`,
                [date, description, debit, credit, id]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error updating ledger entry: ${(error as Error).message}`);
        }
    }
}
