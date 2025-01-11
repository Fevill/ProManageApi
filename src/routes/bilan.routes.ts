import express, { Request, Response, Router } from 'express';
import { BilanController } from '../controllers/bilan.controller';

const router: Router = express.Router();
const bilanController = new BilanController();

// Get bilan
router.get('/', (req: Request, res: Response) => bilanController.getBilan(req, res));

// Create bilan
router.post('/', (req: Request, res: Response) => bilanController.createBilan(req, res));

export default router;
