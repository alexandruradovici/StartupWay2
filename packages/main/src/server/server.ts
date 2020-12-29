import * as express from "express";

export interface ServerRoute {

}

export class Server {
    protected readonly app: express.Application = express();

    registerRoute (route: ServerRoute): boolean {
        return false;
    }

    async start (port:number = 8080) {
        // start the server
    }
}

const SERVER = new Server ();

export function getServer (): Server {
    return SERVER;
}
