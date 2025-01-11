import express, { Request, Response, Router } from 'express';
import { Pool, QueryResult } from 'pg';

// Extend Express Request type to include db
interface CustomRequest extends Request {
  db: Pool;
}

const router: Router = express.Router();

// Get all transactions (excluding forecasts by default)
router.get('/', async (req: CustomRequest, res: Response) => {
  try {
    const isForecast = req.query.forecast === 'true';
    const companyId = req.query.companyId;
    const fiscalYearId = req.query.fiscalYearId;

    let params = [isForecast];
    let whereClause = 't.is_forecast = $1';

    if (companyId) {
      params.push(companyId);
      whereClause += ` AND t.company_id = $${params.length}`;
    }

    if (fiscalYearId) {
      params.push(fiscalYearId);
      whereClause += ` AND t.fiscal_year_id = $${params.length}`;
    }

    const result: QueryResult = await req.db.query(`
      SELECT t.*
      FROM transactions t
      WHERE ${whereClause}
    `, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Export the router
export = router;
