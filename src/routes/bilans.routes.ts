import express from 'express';
import { BilansController } from '../controllers/bilans.controller';

const router = express.Router();
const controller = new BilansController();

// GET /api/bilans
router.get('/', controller.getBilans.bind(controller));

// GET /api/bilans/:id
router.get('/:id', controller.getBilanById.bind(controller));

// POST /api/bilans
router.post('/', controller.createBilan.bind(controller));

export default router;
