import { Server, ApiResponse, ApiRequest } from "@startupway/main/lib/server";
import { getPool } from "@startupway/database/lib/server";
import { getAuthorizationFunction } from "@startupway/users/lib/server";
import { BModelCanvas } from "../common";
import {QueryOptions, Connection} from 'mariadb';
import {Router} from "express";
// import { v4 as uiidv4 } from 'uuid';
export class BModelCanvasServer {

	private static INSTANCE?: BModelCanvasServer;

	async addCanvas (canvas: BModelCanvas): Promise<BModelCanvas | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				conn.beginTransaction();
				let queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: "SELECT bModelCanvas.* FROM bModelCanvas WHERE bModelCanvas.productId=:productId AND DATE(bModelCanvas.date)=DATE(NOW())"
				};
				const values = {
					productId:canvas.productId
				};
				const canvases:BModelCanvas[] =  await conn.query(queryOptions, values);
				if(canvases && canvases.length > 0 && canvases[0]) {
					queryOptions = {
						namedPlaceholders:true,
						sql: "UPDATE bModelCanvas SET bModelCanvas.fields=:fields, bModelCanvas.date=:date WHERE bModelCanvas.modelId=:modelId RETURNING modelId,productId,date,fields"
					};
					const updateValues = {
						fields:canvas.fields,
						date:canvas.date,
						modelId:canvas.modelId
					};
					const canvasResult:BModelCanvas[] = await conn.query(queryOptions,updateValues);
					if(canvasResult && canvasResult.length > 0 && canvasResult[0]) {
						await conn.commit();
						await conn.end();
						return canvasResult[0];
					} else {
						await conn.rollback();
						await conn.end();
						return null;
					}
				} else {
					queryOptions = {
						namedPlaceholders:true,
						sql: "INSERT INTO bModelCanvas values(:modelId,:productId,:date,:fields) RETURNING modelId,productId,date,fields"
					};
					const result:BModelCanvas[] = await conn.query(queryOptions,canvas);
					if(result && result.length > 0 && result[0]) {
						await conn.commit();
						await conn.end();
						return result[0];
					} else {
						await conn.rollback();
						await conn.end();
						return null;
					}
				}
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return null;
		}
	}

	async getCanvasesForTeam (teamId: string): Promise<BModelCanvas[]> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					nestTables:"_",
					sql: "SELECT bModelCanvas.* FROM bModelCanvas INNER JOIN teams ON team.productId=bModelCanvas.productId AND team.teamId=:tId"
				}
				const values = {
					tId:teamId
				}
				const canvases:BModelCanvas[] =  await conn.query(queryOptions, values);
				if(canvases && canvases.length > 0) {
					await conn.end();
					return canvases;
				} else {
					await conn.end();
					return [];
				}
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			if(conn)
				await conn.end();
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
	router.use(authFunct);


router.get("/:teamId", async(req:ApiRequest<undefined>,res:ApiResponse<BModelCanvas[]>) => {
	try {
		const result = await bModelCanvasServer.getCanvasesForTeam(req.params.teamId);
		if(result)
			res.send(result);
		else
			res.status(401).send({err:401,data:[]});
	} catch (error) {
		console.error(error);
		res.status(500).send({err:500,data:[]})
	}
});
// TODO: add addCanvas(canvas) function
router.post("/:teamId", async(req:ApiRequest<BModelCanvas>,res:ApiResponse<BModelCanvas|null>) => {
	try{
		const newCanvas = await bModelCanvasServer.addCanvas(req.body);
		if(newCanvas)
			res.send(newCanvas);
		else
			res.status(401).send({err:401, data:null});
	} catch (error) {
		console.error(error);
		res.status(500).send({err:500,data:null})
	}
});
router.post("/update:teamId", async(req:ApiRequest<BModelCanvas>,res:ApiResponse<BModelCanvas|null>) => {
	try{
		const newCanvas = req.body;
		if(newCanvas)
			res.send(newCanvas);
		else
			res.status(401).send({err:401, data:null});
	} catch (error) {
		console.error(error);
		res.status(500).send({err:500,data:null})
	}
});

server.registerRouterAPI (1, router, "/canvas");
