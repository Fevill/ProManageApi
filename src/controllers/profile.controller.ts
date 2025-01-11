import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service';

export class ProfileController {
    private profileService: ProfileService;

    constructor() {
        this.profileService = new ProfileService();
    }

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const profile = await this.profileService.getProfile(req);
            if (profile) {
                res.json(profile);
            } else {
                res.status(404).json({ message: 'Profile not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const updatedProfile = await this.profileService.updateProfile(req);
            if (updatedProfile) {
                res.json(updatedProfile);
            } else {
                res.status(404).json({ message: 'Profile not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updatePassword(req: Request, res: Response): Promise<void> {
        try {
            const success = await this.profileService.updatePassword(req);
            if (success) {
                res.json({ message: 'Password updated successfully' });
            } else {
                res.status(400).json({ message: 'Failed to update password' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updatePreferences(req: Request, res: Response): Promise<void> {
        try {
            const updatedPreferences = await this.profileService.updatePreferences(req);
            if (updatedPreferences) {
                res.json(updatedPreferences);
            } else {
                res.status(404).json({ message: 'Preferences not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
