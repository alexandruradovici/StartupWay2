import { Server, ApiResponse, ApiRequest } from "@startupway/main/lib/server";
import { getPool } from "@startupway/database/lib/server";
import { getAuthorizationFunction } from "@startupway/users/lib/server";
import { BModelCanvas } from "../common";
import {QueryOptions, Connection} from 'mariadb';
import {Router} from "express";
export class BModelCanvasServer {

	private static INSTANCE?: BModelCanvasServer;
	private conn: Connection;

 	constructor() {
		const that = this;
		getPool().getConnection()
		.then(conn => {
			console.log("Connected to database");
			that.conn = conn;
		})
		.catch(err => {
			console.log("Not connected due to error: " + err);
		})
	}

	async addCanvas (canvas: BModelCanvas): Promise<BModelCanvas | null> {
		try {
			let queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT bModelCanvas.* FROM bModelCanvas WHERE bModelCanvas.productId=:productId AND DATE(bModelCanvas.date)=DATE(NOW())"
			};
			const values = {
				productId:canvas.productId
			} ;
			const canvases:BModelCanvas[] =  await this.conn.query(queryOptions, values);
			if(canvases[0] !== undefined) {
				queryOptions = {
					namedPlaceholders:true,
					sql: "UPDATE bModelCanvas SET bModelCanvas.fields=:fields, bModelCanvas.date=:date WHERE bModelCanvas.modelId=:modelId"
				};
				const updateValues = {
					fields:canvas.fields,
					date:canvas.date,
					modelId:canvas.modelId
				};
				await this.conn.query(queryOptions,updateValues);
				queryOptions = {
					namedPlaceholders:true,
					sql: "SELECT bModelCanvas.* FROM bModelCanvas WHERE bModelCanvas.productId=:productId AND DATE(bModelCanvas.date)=DATE(NOW())"
				};
				const canvasResult:BModelCanvas[] = await this.conn.query(queryOptions);
				if(canvasResult[0] !== undefined)
					return canvases[0];
				else
					return null;
			} else {
				queryOptions = {
					namedPlaceholders:true,
					sql: "INSERT INTO bModelCanvas values(:modelId,:productId,:date,:fields)"
				};
				// as any because I need to insert a row with null as id to be autocreated
				(canvas as any).modelId = null;
				await this.conn.query(queryOptions,canvas);

				queryOptions = {
					namedPlaceholders:true,
					sql: "SELECT bModelCanvas.* FROM bModelCanvas WHERE bModelCanvas.productId=:productId AND DATE(bModelCanvas.date)=DATE(NOW())"
				};
				const result:BModelCanvas[] = await this.conn.query(queryOptions,canvas);
				if(result[0] !== undefined) {
					return result[0];
				} else {
					return null;
				}
			}
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async getCanvasesForTeam (teamId: number): Promise<BModelCanvas[]> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				nestTables:"_",
				sql: "SELECT bModelCanvas.* FROM bModelCanvas INNER JOIN teams ON team.productId=bModelCanvas.productId AND team.teamId=:tId"
			}
			const values = {
				tId:teamId
			}
			const canvases:BModelCanvas[][] =  await this.conn.query(queryOptions, values);
			if(canvases[0] !== undefined && canvases[0].length > 0) {
				return canvases[0];
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	// async updateCanvas (canvas: BModelCanvas): Promise<BModelCanvas> {
	// 	await (await this.getBModelCanvasRepository())
	// 		.update(canvas.modelId, canvas);
	// 	let updatedCanvas = await (await this.getBModelCanvasRepository())
	// 		.findOne(canvas.modelId);
	// 	if (updatedCanvas)
	// 		return updatedCanvas;
	// 	else
	// 		return null;
	// }

	public static getInstance (): BModelCanvasServer
	{
		if (!this.INSTANCE)
		{
			this.INSTANCE = new BModelCanvasServer ();
		}
		return this.INSTANCE;
	}

}


const server = Server.getInstance ();
const bModelCanvasServer = BModelCanvasServer.getInstance();
const router = Router ();
const authFunct = getAuthorizationFunction();

if(authFunct)
	router.use((authFunct as any));
	// Bypass params dictionary and send authorization Function


router.get("/:teamId", async(req:ApiRequest<undefined>,res:ApiResponse<BModelCanvas[]>) => {
	const result = await bModelCanvasServer.getCanvasesForTeam(parseInt(req.params.teamId,10));
	if(result)
		res.send(result);
	else
		res.status(401).send({err:401,data:[]});
});
// TODO: add addCanvas(canvas) function
router.post("/:teamId", async(req:ApiRequest<BModelCanvas>,res:ApiResponse<BModelCanvas|null>) => {
	const newCanvas = await bModelCanvasServer.addCanvas(req.body);
	if(newCanvas)
		res.send(newCanvas);
	else
		res.status(401).send({err:401, data:null});
});
router.post("/update:teamId", async(req:ApiRequest<BModelCanvas>,res:ApiResponse<BModelCanvas|null>) => {
	const newCanvas = req.body;
	if(newCanvas)
		res.send(newCanvas);
	else
		res.status(401).send({err:401, data:null});
});

server.registerRouterAPI (1, router, "/canvas");
