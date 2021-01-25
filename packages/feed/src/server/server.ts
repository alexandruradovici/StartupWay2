import { Feed} from "../common";
import { Router } from "express";
import { Server } from "@startupway/main/lib/server";
import { getPool } from '@startupway/database/lib/server';
import { QueryOptions, Connection } from 'mariadb';

export class FeedServer {

	private static INSTANCE?: FeedServer;
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

	async addFeed(feed: Feed): Promise<Feed | null> {
		try {
			let queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql:"SELECT feeds.* FROM feeds WHERE feed.teamId=:teamId AND DATE(feed.date)=DATE(NOW()",
			}
			const values = { 
				teamId: feed.teamId
			}
			const feeds: Feed[] = await this.conn.query(queryOptions,values);
			if(feeds[0] !== undefined && feeds.length > 0) {
				if(feeds.length > 3) {
					return null;
				} else {
					queryOptions.sql = "INSERT INTO feeds values(:teamId,:feedType,:text,:date)";
					await this.conn.query(queryOptions,feed);
					queryOptions.sql="SELECT feeds.* FROM feeds WHERE feed.teamId=:teamId AND DATE(feed.date)=DATE(NOW()";
					const resp: Feed[] = await this.conn.query(queryOptions,values);
					if(resp[0] !== undefined) {
						return resp[0];
					} else {
						return null
					}
				}
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async updateFeed(feed: Feed): Promise<Feed|null> {
		try {
			let queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql:"UPDATE feeds set teamId=:teamId, feedType=:feedType, text=:text, date=:date WHERE feeds.feedId=:feedId",
			}
			await this.conn.query(queryOptions,feed);
			queryOptions = {
				namedPlaceholders:true,
				sql:"SELECT feeds.* FROM feeds WHERE feeds.feedID=:feedID",
			}
			const resp:Feed[] = await this.conn.query(queryOptions,{feedId:feed.feedId});
			if(resp[0]!==undefined) {
				return resp[0];
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async deleteFeed(feed: Feed): Promise<boolean> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql:"DELETE FROM feeds WHERE feed.feedId=:feedId",
			}
			await this.conn.query(queryOptions,{feedId:feed.feedId});
			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	async getFeedByTeamId(teamId: number): Promise<Feed[]> {
		try {
			let queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql:"SELECT feeds.* FROM feeds WHERE feed.teamId=:teamId ORDER BY feeds.date",
			}
			const values = { 
				teamId: teamId
			}
			const feeds: Feed[] = await this.conn.query(queryOptions,values);
			if(feeds.length > 0 && feeds[0] !== undefined) {
				return feeds;
			} else {
				return []
			}
		} catch (e) {
			console.error(e);
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
let router = Router();
let feed = FeedServer.getInstance();
router.use((req, res, next) => {
	req.feed = [];
	next();
});

router.get("/feed/:teamId", async (req, res) => {
	let userFeed = await feed.getFeedByTeamId(parseInt(req.params.teamId));
	if (userFeed)
		res.send(userFeed);
	else
		res.status(401).send({ err: 401 });
});

router.post("/feed/add", async (req, res) => {
	let response = await feed.addFeed(req.body.feed);
	if (response)
		res.send(response);
	else
		res.status(401).send({ err: 401 });
})
router.post("/feed/update", async(req,res) =>{
	try {
		let feedResp: Feed | null = await feed.updateFeed(req.body.newFeed);
		if(feedResp) 
			res.status(200).send(feedResp);
		else
			res.status(204).send({});
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}
});
router.post("/feed/delete", async(req, res) => {
	try {
		let toRemove = req.body.feed;
		if(toRemove) {
			let resp = await feed.deleteFeed(toRemove);
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