import { Request } from 'express';
import { Pool, QueryResult } from 'pg';
import { Company } from '../models/company.model';
import { CustomRequest } from '../types/express';



export class CompanyService {
    async getAllCompanies(req: CustomRequest): Promise<Company[]> {
        try {
            const result: QueryResult = await req.db.query(
                'SELECT * FROM companies ORDER BY name'
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching companies: ${(error as Error).message}`);
        }
    }

    async getCompanyById(req: CustomRequest): Promise<Company | null> {
        try {
            const id = req.params.id;
            const result: QueryResult = await req.db.query(
                'SELECT * FROM companies WHERE id = $1',
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching company: ${(error as Error).message}`);
        }
    }

    async createCompany(req: CustomRequest): Promise<Company> {
        try {
            const { name, address, siret, phone, email } = req.body;
            const result: QueryResult = await req.db.query(
                `INSERT INTO companies (name, address, siret, phone, email) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING *`,
                [name, address, siret, phone, email]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating company: ${(error as Error).message}`);
        }
    }

    async updateCompany(req: CustomRequest): Promise<Company | null> {
        try {
            const id = req.params.id;
            const { name, address, siret, phone, email } = req.body;
            
            const result: QueryResult = await req.db.query(
                `UPDATE companies 
                SET name = $1, address = $2, siret = $3, phone = $4, email = $5, 
                    updated_at = CURRENT_TIMESTAMP 
                WHERE id = $6 
                RETURNING *`,
                [name, address, siret, phone, email, id]
            );
            
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error updating company: ${(error as Error).message}`);
        }
    }

    async deleteCompany(req: CustomRequest): Promise<boolean> {
        try {
            const id = req.params.id;
            const result: QueryResult = await req.db.query(
                'DELETE FROM companies WHERE id = $1 RETURNING id',
                [id]
            );
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error deleting company: ${(error as Error).message}`);
        }
    }
}
