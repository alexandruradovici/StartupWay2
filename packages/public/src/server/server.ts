
import { Router } from "express";
import { Profile } from "../common";
// import { QueryOptions, PoolConnection } from "mariadb";
import { Server, ApiResponse, ApiRequest } from "@startupway/main/lib/server";
// import { getPool } from "@startupway/database/lib/server";
import {
	Team,
	Product,
	TeamsServer
} from "@startupway/teams/lib/server";
import {
	UploadDownloadServer,
	UploadDownloadLink
} from "@startupway/uploaddownload/lib/server";

export class PublicServer {

	private static INSTANCE?: PublicServer;
	public static getInstance (): PublicServer
	{
		if (!this.INSTANCE)
		{
			this.INSTANCE = new PublicServer ();
		}
		return this.INSTANCE;
	}

}
/**
 * Create a public router for the admin plugin
 */
const router = Router();
// const publicServer = PublicServer.getInstance();
const teams = TeamsServer.getInstance();
const uploadDownload = UploadDownloadServer.getInstance();
router.get(
	"/profile",
	async (
		req: ApiRequest<undefined>,
		res: ApiResponse<Profile[]>
	) => {
		try {
			const teamsArray: (Team & Product)[] = await teams.getTeams();
			const profiles: Profile[] = [];
			for (const team of teamsArray) {
				// as any because TODO parse json in backend
				const product = JSON.parse(team.productDetails as any);
				let profile: Profile;
				if (product) {
					profile = {
						location: team.location,
						teamTrack: team.teamType,
						businessTrack: team.businessTrack,
						startupName: team.startupName,
						descriptionEN: team.descriptionEN,
						descriptionRO: team.descriptionRO,
						webLink: product.website,
						teamId: team.teamId,
						productId: team.productId,
						productDetails: product
					};
					profiles.push(profile);
				}
			}
			if (profiles) {
				profiles.sort((a: Profile, b: Profile) => {
					return a.startupName.localeCompare(b.startupName);
				});
				res.send(profiles);
			} else {
				console.error(
					'Error on route "/teams/profile" in "public" router'
				);
				console.error("Error, no profiles!");
				res.status(401).send({ err: 401, data: [] });
			}
		} catch (error) {
			console.error('Error on route "/teams/profile" in "public" router');
			console.error(error);
			res.status(401).send({ err: 401, data: [] });
		}
	}
);
router.get(
	"/profile/:teamId",
	async (
		req: ApiRequest<undefined>,
		res: ApiResponse<Profile[]>
	) => {
		try {
			const teamId = req.params.teamId;
			const teamById = await teams.getTeamById(teamId);
			if (teamById) {
				const product = await teams.getProductByTeamId(teamId);
				if (product) {
					const profile = {
						location: teamById.location,
						teamTrack: product.teamType,
						businessTrack: product.businessTrack,
						startupName: product.startupName,
						descriptionEN: product.descriptionEN,
						descriptionRO: product.descriptionRO,
						webLink: product.productDetails.website,
						teamId: teamById.teamId,
						productId: teamById.productId,
						productDetails: product
					};
					if (profile) {
						res.send(profile);
					} else {
						console.error(
							'Error on route "/teams/profile" in "public" router'
						);
						console.error("Error, no profile!");
						res.status(401).send({ err: 401, data: null });
					}
				} else {
					console.error(
						'Error on route "/teams/profile" in "public" router'
					);
					console.error("Error, no product!");
					res.status(401).send({ err: 401, data: null });
				}
			} else {
				console.error(
					'Error on route "/teams/profile" in "public" router'
				);
				console.error("Error, no team!");
				res.status(401).send({ err: 401, data: null });
			}
		} catch (error) {
			console.error('Error on route "/teams/profile" in "public" router');
			console.error(error);
			res.status(401).send({ err: 401, data: null });
		}
	}
);
router.get("/get/file/product/:fileType/:productId", async(req:ApiRequest<undefined>, res:ApiResponse<{data:string,type:string,ext:string,uuid:string}[] | null>) => {
	try {
		const type = req.params.fileType;
		const productId = req.params.productId;
		if(productId !== "" && productId !== undefined && type !== "" && type !== undefined) {
			let links = await uploadDownload.getLinksByProductIdAndFileType(productId,type);
			const results = [];
			for(const link of (links as UploadDownloadLink[])) {
				
				if((link as UploadDownloadLink).uuid !== "") {
					const url = await uploadDownload.getS3Url((link as UploadDownloadLink).uuid);
					results.push({
						data:url,
						type:(link as UploadDownloadLink).fileType,
						ext:(link as UploadDownloadLink).extension,
						uuid:(link as UploadDownloadLink).uuid
					})
				}
			}
			res.status(200).send(results);
		} else {
			res.status(204).send({err:204,data:null});
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:null});

	}
});
router.get("/download/file/:uuid", async(req:ApiRequest<undefined>, res:ApiResponse<string | null>) => {
	try {
		const uuid = req.params.uuid;
		let url:string = "";
		if(uuid !== "")
			url = await uploadDownload.getS3Url(uuid);
		if(url !== "") {
			res.status(200).send(url);
		} else {
			res.status(404).send({err:404,data:null});
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:null});
	}
});

const server = Server.getInstance ();
server.registerRouterAPI (1, router, "/public");