import express, { Request, Response, Router } from 'express';
import { Pool, QueryResult } from 'pg';

// Extend Express Request type to include db
interface CustomRequest extends Request {
  db: Pool;
}

const router: Router = express.Router();

// Routes pour ClassePCG
router.get('/classes', async (req: CustomRequest, res: Response) => {
  try {
    const result: QueryResult = await req.db.query('SELECT * FROM ClassePCG ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/classes/:id', async (req: CustomRequest, res: Response) => {
  try {
    const result: QueryResult = await req.db.query('SELECT * FROM ClassePCG WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Classe PCG non trouvée' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Export the router
export = router;
