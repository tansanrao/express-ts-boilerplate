import {Application, Request, Response } from 'express';

export class IndexRoutes {
    public route(app: Application) {
        app.get('/healthz', (req, res) => {
            res.status(200).send({message: "Server Healthy!"})
        })
        app.get('/', (req: Request, res: Response) => {
            res.status(200).json({message: "Express TypeScript Boilerplate Server"});
        });
    }
}
