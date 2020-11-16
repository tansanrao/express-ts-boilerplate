import {Application, Request, Response } from 'express';

export class IndexRoutes {
    public route(app: Application) {
        app.get('/', (req: Request, res: Response) => {
            res.status(200).json({message: "Express TypeScript Boilerplate Server"});
        });
    }
}