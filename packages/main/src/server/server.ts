import express, { RequestHandler, Router } from "express";
import {createServer} from "http";
import {networkInterfaces} from "os";
import { AddressInfo } from "net";
export interface ServerRoute {

}
export interface RouterApi {
    version: number,
    router: express.Router
}
export class Server {
    public app: express.Application = express();
    protected routers: express.Router[] = [];
    protected routersApi: RouterApi[] = [];

    registerRoute (route: Router | RequestHandler): void {
        this.app.use (route);
    }

	registerNewRouter(router: express.Router): void {
		this.routers.push (router);
	}
	
	registerRouterApi(version: number, router: express.Router): void {
		this.routersApi.push ({
			version, 
			router
		});
	}

    async start (port:number = 8080):Promise<void> {
		var server = createServer(this.app);
		let serverListener = server.listen (port , function () {
			let n = 0;
			let networks = networkInterfaces();
			for (let network in networks) {
				for (let networkAddress of networks[network]!)
				{
					if (networkAddress.family === "IPv4" && !networkAddress.address.startsWith ("127"))
					{
						n = n + 1;
						console.log ("StartupWay running at http://"+networkAddress.address+":"+(serverListener.address() as AddressInfo).port);
					}
				}
			}
			if (n === 0)
			{
				console.log ("StartupWay running at http://127.0.0.1:"+(serverListener.address() as AddressInfo).port);
			}
		});
		
		for (let router of this.routers.reverse ())
		{
			this.app.use (router);
		}

		for (let routerApi of this.routersApi.reverse ())
		{
			this.app.use ('/api/v'+routerApi.version, routerApi.router);
		}

		serverListener.on ("error", (err) => {
			console.error (err);
		});
	}
	
}

const SERVER = new Server ();

export function getServer (): Server {
    return SERVER;
}
