import express, { Request, Response, Router } from 'express';
import { Pool, QueryResult } from 'pg';

// Extend Express Request type to include db
interface CustomRequest extends Request {
  db: Pool;
}

const router: Router = express.Router();

// Get ledger entries
router.get('/', async (req: CustomRequest, res: Response) => {
  try {
    const result: QueryResult = await req.db.query('SELECT * FROM ledger_entries');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Export the router
export = router;
