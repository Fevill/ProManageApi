import express, { Request, Response, Router } from 'express';
import { Pool, QueryResult } from 'pg';

// Extend Express Request type to include db
interface CustomRequest extends Request {
  db: Pool;
}

const router: Router = express.Router();

// Get all fiscal years
router.get('/', async (req: CustomRequest, res: Response) => {
  try {
    const result: QueryResult = await req.db.query('SELECT * FROM fiscal_year ORDER BY start_date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get fiscal year by ID
router.get('/:id', async (req: CustomRequest, res: Response) => {
  try {
    const result: QueryResult = await req.db.query('SELECT * FROM fiscal_year WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fiscal year not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get current fiscal year by company ID
router.get('/company/:companyId/current', async (req: CustomRequest, res: Response) => {
  try {
    const result: QueryResult = await req.db.query(`
      SELECT * FROM fiscal_year 
      WHERE company_id = $1 AND start_date <= CURRENT_DATE 
      ORDER BY start_date DESC
      LIMIT 1
    `, [req.params.companyId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Current fiscal year not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Export the router
export = router;
