import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';

export class ProjectController {
    private projectService: ProjectService;

    constructor() {
        this.projectService = new ProjectService();
    }

    async getProjects(req: Request, res: Response): Promise<void> {
        try {
            const projects = await this.projectService.getProjects(req);
            res.json(projects);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getProjectById(req: Request, res: Response): Promise<void> {
        try {
            const project = await this.projectService.getProjectById(req);
            if (project) {
                res.json(project);
            } else {
                res.status(404).json({ message: 'Project not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async createProject(req: Request, res: Response): Promise<void> {
        try {
            const newProject = await this.projectService.createProject(req);
            res.status(201).json(newProject);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateProject(req: Request, res: Response): Promise<void> {
        try {
            const updatedProject = await this.projectService.updateProject(req);
            if (updatedProject) {
                res.json(updatedProject);
            } else {
                res.status(404).json({ message: 'Project not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async deleteProject(req: Request, res: Response): Promise<void> {
        try {
            const deleted = await this.projectService.deleteProject(req);
            if (deleted) {
                res.json({ message: 'Project deleted successfully' });
            } else {
                res.status(404).json({ message: 'Project not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
