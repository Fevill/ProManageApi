import { Request } from 'express';
import { Pool, QueryResult } from 'pg';
import { Bilan } from '../models/bilan.model';
import { CustomRequest } from '../types/express';

export class BilansService {
  async getAllBilans(req: CustomRequest) {
    const { companyId, fiscalYearId } = req.query;
    const { db } = req;

    const query = `
      SELECT * FROM bilans 
      WHERE company_id = $1 
      AND fiscal_year_id = $2
    `;

    const result = await db.query(query, [companyId, fiscalYearId]);
    return result.rows;
  }

  async getBilanById(req: CustomRequest) {
    const { id } = req.params;
    const { db } = req;

    const query = `
      SELECT * FROM bilans 
      WHERE id = $1
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  async createBilan(req: CustomRequest) {
    const { companyId, fiscalYearId, data } = req.body;
    const { db } = req;

    const query = `
      INSERT INTO bilans (company_id, fiscal_year_id, data, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;

    const result = await db.query(query, [companyId, fiscalYearId, data]);
    return result.rows[0];
  }
}
