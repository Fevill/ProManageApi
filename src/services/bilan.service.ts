import { Request } from 'express';
import { Pool, QueryResult } from 'pg';
import { Bilan } from '../models/bilan.model';
import { CustomRequest } from '../types/express';

export class BilanService {
    async getAllBilans(req: CustomRequest): Promise<Bilan[]> {
        try {
            const result: QueryResult = await req.db.query('SELECT * FROM bilan');
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching bilans: ${(error as Error).message}`);
        }
    }

    async createBilan(req: CustomRequest): Promise<Bilan> {
        try {
            // Add your bilan creation logic here
            const { /* add your required fields */ } = req.body;
            const result: QueryResult = await req.db.query(
                'INSERT INTO bilan (/* fields */) VALUES (/* values */) RETURNING *'
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating bilan: ${(error as Error).message}`);
        }
    }
}
