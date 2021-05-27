import { Feed} from "../common";
import { Router } from "express";
import { Server, ApiRequest, ApiResponse } from "@startupway/main/lib/server";
import { getPool } from "@startupway/database/lib/server";
import { QueryOptions, PoolConnection } from "mariadb";
import { getAuthorizationFunction } from "@startupway/users/lib/server";
// import { v4 as uiidv4 } from 'uuid';
export class FeedServer {

	private static INSTANCE?: FeedServer;

	async addFeed(feedParam: Feed): Promise<Feed | null> {
		let conn:PoolConnection | null = null
		try {
			conn = await getPool().getConnection();
			if(conn) {
				conn.beginTransaction();
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"SELECT feeds.* FROM feeds WHERE feeds.teamId=:teamId AND DATE(feeds.date)=DATE(NOW())",
				}
				const values = {
					teamId: feedParam.teamId
				}
				const feeds: Feed[] = await conn.query(queryOptions,values);
				if(feeds) {
					if(feeds.length > 3) {
						await conn.commit();
						await conn.release();
						return null;
					} else {
						queryOptions.sql = "INSERT INTO feeds (feedId, teamId, feedType, text, date) VALUES(:feedId,:teamId,:feedType,:text,:date)";
						await conn.query(queryOptions,feedParam);
						queryOptions.sql = "SELECT feedId, teamId, feedType, text, date FROM feeds WHERE feedId=:feedId";
						const resp: Feed[] = await conn.query(queryOptions,{feedId:feedParam.feedId});
						if(resp && resp.length > 0 && resp[0]) {
							await conn.commit();
							await conn.release();
							return resp[0];
						} else {
							await conn.rollback();
							await conn.release();
							return null
						}
					}
				} else {
					await conn.rollback();
					await conn.release();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			if(conn) {
				await conn.rollback();
				await conn.release();
			}
			return null;
		}
	}

	async updateFeed(feedParam: Feed): Promise<Feed|null> {
		let conn:PoolConnection | null = null
		try {
			conn = await getPool().getConnection();
			if(conn) {
				conn.beginTransaction();
				let queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"UPDATE feeds SET teamId=:teamId, feedType=:feedType, text=:text, date=:date WHERE feeds.feedId=:feedId",
				}
				await conn.query(queryOptions,feedParam);
				queryOptions.sql = "SELECT feedId, teamId, feedType, text, date FROM feeds WHERE feedId=:feedId";
				const resp:Feed[] = await conn.query(queryOptions,feedParam);
				if(resp && resp.length > 0 && resp[0]) {
					await conn.commit();
					await conn.release();
					return resp[0];
				} else {
					await conn.rollback();
					await conn.release();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			if(conn) {
				await conn.rollback();
				await conn.release();
			}
			return null;
		}
	}

	async deleteFeed(feedParam: Feed): Promise<boolean> {
		let conn:PoolConnection | null = null
		try {
			conn = await getPool().getConnection();
			if(conn) {
				conn.beginTransaction();
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"DELETE FROM feeds WHERE feed.feedId=:feedId",
				}
				await conn.query(queryOptions,{feedId:feedParam.feedId});
				queryOptions.sql = "SELECT feedId as deleted_id FROM feeds where feedId=:feedId";
				const response:{deleted_id:string}[] = await conn.query(queryOptions,{feedId:feedParam.feedId});
				if(response && response.length === 0) {
					await conn.commit();
					return true;
				} else {
					await conn.rollback();
					return false;
				}
			} else {
				return false;
			}
		} catch (e) {
			console.error(e);
			if(conn) {
				await conn.rollback();
			}
			return false;
		} finally {
			if(conn)
				conn.release();
		}
	}

	async getFeedByTeamId(teamId: string): Promise<Feed[]> {
		let conn:PoolConnection | null = null
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"SELECT feeds.* FROM feeds WHERE feeds.teamId=:teamId ORDER BY feeds.date",
				}
				const feeds: Feed[] = await conn.query(queryOptions,{teamId});
				if(feeds && feeds.length > 0) {
					return feeds;
				} else {
					return []
				}
			} else {
				return [];
			}
		} catch (e) {
			console.error(e);
			return [];
		} finally {
			if(conn)
				conn.release();
		}
	}

	public static getInstance (): FeedServer
	{
		if (!this.INSTANCE)
		{
			this.INSTANCE = new FeedServer ();
		}
		return this.INSTANCE;
	}

}
const router = Router();
const feed = FeedServer.getInstance();
router.use((req, res, next) => {
	req.feed = [];
	next();
});

const authFunct = getAuthorizationFunction();
if(authFunct)
	router.use(authFunct);
	// Bypass params dictionary and send authorization Function
	
router.get("/:teamId", async (req:ApiRequest<undefined>, res:ApiResponse<Feed[]>) => {
	try {
		const userFeed = await feed.getFeedByTeamId(req.params.teamId);
		if (userFeed) {
			for(let uF of userFeed) {
				uF.text = JSON.parse((uF.text as any) as string);
			}
			res.send(userFeed);
		} else
			res.status(401).send({err:401, data:[]});
	} catch (error) {
		res.status(500).send({err:500, data:[]});
	}
});

router.post("/add", async (req:ApiRequest<Feed>, res:ApiResponse<Feed | null>) => {
	try {
		const response = await feed.addFeed(req.body);
		if (response)
			res.send(response);
		else
			res.status(401).send({err:401, data:null});
	} catch (error) {
		res.status(500).send({err:500, data:null});
	}
})
router.post("/update", async(req:ApiRequest<Feed>, res:ApiResponse<Feed | null>) =>{
	try {
		const feedResp: Feed | null = await feed.updateFeed(req.body);
		if(feedResp)
			res.status(200).send(feedResp);
		else
			res.status(204).send(null);
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500, data:null});
	}
});
router.post("/delete", async(req:ApiRequest<Feed>, res:ApiResponse<boolean>) => {
	try {
		const toRemove = req.body;
		if(toRemove) {
			const resp = await feed.deleteFeed(toRemove);
			if(resp)
				res.status(200).send(true);
			else
				res.status(204).send(false);
		}
	} catch(e) {
		console.error(e)
		res.status(500).send({err:500,data:false});
	}
})
const server = Server.getInstance ();
server.registerRouterAPI (1, router, "/feed");