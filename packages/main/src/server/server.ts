import express, { RequestHandler, Router } from "express";
import { createServer } from "http";
import { networkInterfaces } from "os";
import { AddressInfo } from "net";

export class Server {
    public app: express.Application = express();
	private apiv1 = express.Router();

	private static INSTANCE?: Server;

    registerRouterUI (router: Router | RequestHandler, prefix?: string): void {
        if (prefix === undefined)
		{
			this.app.use (router);
		}
		else
		{
			this.app.use (prefix, router);
		}
    }

	registerRouterAPI (version: number, router: Router | RequestHandler, prefix?: string): void {
		if (version === 1)
		{
			if (prefix === undefined)
			{
				this.apiv1.use (router);
			}
			else
			{
				this.apiv1.use (prefix, router);
			}
		}
	}

    async start (port:number = 9090):Promise<void> {
		this.app.use ('/api/v1', express.json({limit:314572800}));
		this.app.use ('/api/v1', this.apiv1);
		const server = createServer(this.app);
		const serverListener = server.listen (process.env.PORT || port, () => {
			let n = 0;
			const networks = networkInterfaces();
			for (const network in networks) {
				// if (network.hasOwnProperty(network))
				// {
					for (const networkAddress of networks[network]!)
					{
						if (networkAddress.family === "IPv4" && !networkAddress.address.startsWith ("127"))
						{
							n = n + 1;
							console.log ("StartupWay running at http://"+networkAddress.address+":"+(serverListener.address() as AddressInfo).port);
						}
					}
				// }
			}
			if (n === 0)
			{
				console.log ("StartupWay running at http://127.0.0.1:"+(serverListener.address() as AddressInfo).port);
			}
		});
		serverListener.on ("error", (err) => {
			console.error (err);
		});
	}

	public static getInstance (): Server
	{
		if (!this.INSTANCE)
		{
			this.INSTANCE = new Server ();
		}
		return this.INSTANCE;
	}

}
