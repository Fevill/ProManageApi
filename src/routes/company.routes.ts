import express, { Request, Response, Router } from 'express';
import { Pool, QueryResult } from 'pg';

// Extend Express Request type to include db
interface CustomRequest extends Request {
  db: Pool;
}

const router: Router = express.Router();

// Get all companies
router.get('/', async (req: CustomRequest, res: Response) => {
  try {
    const result: QueryResult = await req.db.query(`
      WITH company_data AS (
        SELECT c.*, 
          CASE 
            WHEN EXISTS (SELECT 1 FROM fiscal_year fy WHERE fy.company_id = c.id)
            THEN (
              SELECT json_agg(
                json_build_object(
                  'id', fy.id,
                  'companyId', fy.company_id,
                  'name', fy.name,
                  'startDate', fy.start_date,
                  'endDate', fy.end_date,
                  'status', fy.status,
                  'notes', fy.notes
                )
              )
              FROM fiscal_year fy
              WHERE fy.company_id = c.id
            )
            ELSE '[]'
          END AS fiscal_years
        FROM companies c
      )
      SELECT * FROM company_data;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Export the router
export = router;
