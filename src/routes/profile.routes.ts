import express, { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';

const router: Router = express.Router();
const profileController = new ProfileController();

// Get user profile
router.get('/', (req, res) => profileController.getProfile(req, res));

// Update profile
router.put('/', (req, res) => profileController.updateProfile(req, res));

// Update password
router.put('/password', (req, res) => profileController.updatePassword(req, res));

// Update preferences
router.put('/preferences', (req, res) => profileController.updatePreferences(req, res));

export default router;
