import express, { Router } from 'express';
import { ForecastController } from '../controllers/forecast.controller';

const router: Router = express.Router();
const forecastController = new ForecastController();

// Get all forecasts
router.get('/', (req, res) => forecastController.getForecasts(req, res));

// Create forecast
router.post('/', (req, res) => forecastController.createForecast(req, res));

// Update forecast
router.put('/:id', (req, res) => forecastController.updateForecast(req, res));

export default router;
