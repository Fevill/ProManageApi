import express, { Router } from 'express';
import { ResultatController } from '../controllers/resultat.controller';

const router: Router = express.Router();
const resultatController = new ResultatController();

// Get general resultat
router.get('/', (req, res) => resultatController.getResultat(req, res));

// Get resultat by company
router.get('/company/:companyId', (req, res) => resultatController.getResultatByCompany(req, res));

// Get resultat by period
router.get('/period', (req, res) => resultatController.getResultatByPeriod(req, res));

export default router;
