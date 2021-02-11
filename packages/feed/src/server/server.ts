import { Feed} from "../common";
import { Router } from "express";
import { Server, ApiRequest, ApiResponse } from "@startupway/main/lib/server";
import { getPool } from "@startupway/database/lib/server";
import { QueryOptions, Connection } from "mariadb";
import { getAuthorizationFunction } from "@startupway/users/lib/server";
// import { v4 as uiidv4 } from 'uuid';
export class FeedServer {

	private static INSTANCE?: FeedServer;

	async addFeed(feedParam: Feed): Promise<Feed | null> {
		let conn:Connection | null = null
		try {
			conn = await getPool().getConnection();
			if(conn) {
				conn.beginTransaction();
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"SELECT feeds.* FROM feeds WHERE feed.teamId=:teamId AND DATE(feed.date)=DATE(NOW()",
				}
				const values = {
					teamId: feedParam.teamId
				}
				const feeds: Feed[] = await conn.query(queryOptions,values);
				if(feeds && feeds.length > 0 && feeds[0]) {
					if(feeds.length > 3) {
						await conn.commit();
						await conn.end();
						return null;
					} else {
						queryOptions.sql = "INSERT INTO feeds (feedId, teamId, feedType, text, date) VALUES(feedId,:teamId,:feedType,:text,:date) RETURNING feedId, teamId, feedType, text, date";
						const resp: Feed[] = await conn.query(queryOptions,feedParam);
						if(resp && resp.length > 0 && resp[0]) {
							await conn.commit();
							await conn.end();
							return resp[0];
						} else {
							await conn.rollback();
							await conn.end();
							return null
						}
					}
				} else {
					await conn.rollback();
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return null;
		}
	}

	async updateFeed(feedParam: Feed): Promise<Feed|null> {
		let conn:Connection | null = null
		try {
			conn = await getPool().getConnection();
			if(conn) {
				conn.beginTransaction();
				let queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"UPDATE feeds set teamId=:teamId, feedType=:feedType, text=:text, date=:date WHERE feeds.feedId=:feedId RETURNING feedId, teamId, feedType, text, date",
				}
				const resp:Feed[] = await conn.query(queryOptions,feedParam);
				if(resp && resp.length > 0 && resp[0]) {
					await conn.commit();
					await conn.end();
					return resp[0];
				} else {
					await conn.rollback();
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return null;
		}
	}

	async deleteFeed(feedParam: Feed): Promise<boolean> {
		let conn:Connection | null = null
		try {
			conn = await getPool().getConnection();
			if(conn) {
				conn.beginTransaction();
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"DELETE FROM feeds WHERE feed.feedId=:feedId RETURNING feedId as deleted_id",
				}
				const response:{deleted_id:string}[] = await conn.query(queryOptions,{feedId:feedParam.feedId});
				if(response && response.length > 0 && response[0]) {
					await conn.commit();
					await conn.end();
					return true;
				} else {
					await conn.rollback();
					await conn.end();
					return false;
				}
			} else {
				return false;
			}
		} catch (e) {
			console.error(e);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return false;
		}
	}

	async getFeedByTeamId(teamId: string): Promise<Feed[]> {
		let conn:Connection | null = null
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"SELECT feeds.* FROM feeds WHERE feed.teamId=:teamId ORDER BY feeds.date",
				}
				const feeds: Feed[] = await conn.query(queryOptions,{teamId});
				if(feeds && feeds.length > 0) {
					await conn.end();
					return feeds;
				} else {
					await conn.end();
					return []
				}
			} else {
				return [];
			}
		} catch (e) {
			console.error(e);
			if(conn)
				await conn.end();
			return [];
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
		if (userFeed)
			res.send(userFeed);
		else
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