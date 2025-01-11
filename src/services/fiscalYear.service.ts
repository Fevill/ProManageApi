import { Request } from 'express';
import { Pool, QueryResult } from 'pg';
import { FiscalYear } from '../models/fiscalYear.model';
import { CustomRequest } from '../types/express';

export class FiscalYearService {
    async getAllFiscalYears(req: CustomRequest): Promise<FiscalYear[]> {
        try {
            const companyId = req.query.companyId;
            let query = 'SELECT * FROM fiscal_years';
            let params: any[] = [];

            if (companyId) {
                query += ' WHERE company_id = $1';
                params.push(companyId);
            }

            query += ' ORDER BY start_date DESC';

            const result: QueryResult = await req.db.query(query, params);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching fiscal years: ${(error as Error).message}`);
        }
    }

    async getFiscalYearById(req: CustomRequest): Promise<FiscalYear | null> {
        try {
            const id = req.params.id;
            const result: QueryResult = await req.db.query(
                'SELECT * FROM fiscal_years WHERE id = $1',
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching fiscal year: ${(error as Error).message}`);
        }
    }

    async getCurrentFiscalYear(req: CustomRequest): Promise<FiscalYear | null> {
        try {
            const companyId = req.params.companyId;
            const result: QueryResult = await req.db.query(
                `SELECT * FROM fiscal_years 
                WHERE company_id = $1 
                AND start_date <= CURRENT_DATE 
                AND end_date >= CURRENT_DATE
                ORDER BY start_date DESC 
                LIMIT 1`,
                [companyId]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching current fiscal year: ${(error as Error).message}`);
        }
    }

    async createFiscalYear(req: CustomRequest): Promise<FiscalYear> {
        try {
            const { start_date, end_date, company_id } = req.body;
            const result: QueryResult = await req.db.query(
                `INSERT INTO fiscal_years (start_date, end_date, company_id) 
                VALUES ($1, $2, $3) 
                RETURNING *`,
                [start_date, end_date, company_id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating fiscal year: ${(error as Error).message}`);
        }
    }

    async updateFiscalYear(req: CustomRequest): Promise<FiscalYear | null> {
        try {
            const id = req.params.id;
            const { start_date, end_date } = req.body;
            
            const result: QueryResult = await req.db.query(
                `UPDATE fiscal_years 
                SET start_date = $1, end_date = $2, updated_at = CURRENT_TIMESTAMP 
                WHERE id = $3 
                RETURNING *`,
                [start_date, end_date, id]
            );
            
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error updating fiscal year: ${(error as Error).message}`);
        }
    }

    async deleteFiscalYear(req: CustomRequest): Promise<boolean> {
        try {
            const id = req.params.id;
            const result: QueryResult = await req.db.query(
                'DELETE FROM fiscal_years WHERE id = $1 RETURNING id',
                [id]
            );
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error deleting fiscal year: ${(error as Error).message}`);
        }
    }
}
