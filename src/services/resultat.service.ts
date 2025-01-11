import { Request } from 'express';
import { Pool, QueryResult } from 'pg';
import { Resultat } from '../models/resultat.model';
import { CustomRequest } from '../types/express';

export class ResultatService {
    async getResultat(req: CustomRequest): Promise<Resultat[]> {
        try {
            const result: QueryResult = await req.db.query(
                'SELECT * FROM resultat ORDER BY date DESC'
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching resultat: ${(error as Error).message}`);
        }
    }

    async getResultatByPeriod(req: CustomRequest): Promise<Resultat[]> {
        try {
            const { startDate, endDate, companyId } = req.query;
            const result: QueryResult = await req.db.query(
                `SELECT * FROM resultat 
                WHERE company_id = $1 
                AND date BETWEEN $2 AND $3 
                ORDER BY date DESC`,
                [companyId, startDate, endDate]
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching resultat by period: ${(error as Error).message}`);
        }
    }

    async getResultatByCompany(req: CustomRequest): Promise<Resultat[]> {
        try {
            const companyId = req.params.companyId;
            const result: QueryResult = await req.db.query(
                'SELECT * FROM resultat WHERE company_id = $1 ORDER BY date DESC',
                [companyId]
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching resultat by company: ${(error as Error).message}`);
        }
    }
}
