import express, { RequestHandler, Router } from "express";
export declare class Server {
    app: express.Application;
    private apiv1;
    private static INSTANCE?;
    registerRouterUI(router: Router | RequestHandler, prefix?: string): void;
    registerRouterAPI(version: number, router: Router | RequestHandler, prefix?: string): void;
    start(port?: number): Promise<void>;
    static getInstance(): Server;
}
//# sourceMappingURL=server.d.ts.map