import { Router } from "express";
import { Server } from "@startupway/main/lib/server";
import { getPool } from "@startupway/database/lib/server";
import { QueryOptions, Connection } from "mariadb";
import { getAuthorizationFunction } from "@startupway/users/lib/server";
import { Team, UserTeams, UserActivity, Product} from "../common";
import { User } from "@startupway/users/lib/server";

export class TeamsServer {

	private static INSTANCE?: TeamsServer;
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



	async addTeam(team: Team, product: Product): Promise<Team & Product | null> {
		try {
			let o: Team & Product;
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: `INSERT INTO products (startupName,businessTrack,teamType,workshopDay,mentorId,descriptionEN,descriptionRO,pendingDescriptionEN,pendingDescriptionRO,productDetails,updatedAt,lastMentorUpdate) values(:startupName,:businessTrack,:teamType,:workshopDay,:mentorId,:descriptionEN,:descriptionRO,:pendingDescriptionEN,:pendingDescriptionRO,:productDetails,:updatedAt,:lastMentorUpdate)`
			};
			await this.conn.query(queryOptions,product);
			queryOptions.sql="SELECT LAST_INSERT_ID()";
			const id:{"LAST_INSERT_ID()":number}[] = await this.conn.query(queryOptions);
			queryOptions.sql="SELECT * FROM products WHERE products.productId=:id"
			const productResponse:Product[] = await this.conn.query(queryOptions,{id:id[0]["LAST_INSERT_ID()"]});
			if(productResponse[0] !== undefined) {
				team.productId = productResponse[0].productId;
				queryOptions.sql = "INSERT INTO teams (productId,teamName,teamDetails,location,year) VALUES(:productId,:teamName,:teamDetails,:location,:year)";
				await this.conn.query(queryOptions,team);
				queryOptions.sql="SELECT LAST_INSERT_ID()";
				const id:{"LAST_INSERT_ID()":number}[] = await this.conn.query(queryOptions);
				queryOptions.sql="SELECT * FROM teams WHERE teams.teamId=:id"
				const teamResponse:Team[] = await this.conn.query(queryOptions,{id:id[0]["LAST_INSERT_ID()"]});
				if(teamResponse[0]){
					team = teamResponse[0];
					product = productResponse[0];
					o = {
						teamId: team.teamId,
						teamName: team.teamName,
						productId: team.productId,
						mentorId: product.mentorId,
						year:team.year,
						location:team.location,
						startupName: product.startupName,
						businessTrack: product.businessTrack,
						teamType: product.teamType,
						workshopDay: product.workshopDay,
						descriptionRO: product.descriptionRO,
						descriptionEN: product.descriptionEN,
						pendingDescriptionRO: product.pendingDescriptionRO,
						pendingDescriptionEN: product.pendingDescriptionEN,
						teamDetails: team.teamDetails,
						productDetails: product.productDetails,
						updatedAt: product.updatedAt,
						lastMentorUpdate: product.lastMentorUpdate
					}
					return o;
				}
				else
					return null;
			} else {
				return null;
			}

			
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async deleteTeam(team: Team): Promise<boolean> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "DELETE FROM userTeams where userTeams.teamId=:teamId"
			}
			await this.conn.query(queryOptions,{teamId:team.teamId});
			queryOptions.sql = "DELETE FROM teams where teams.teamId=:teamId";
			await this.conn.query(queryOptions,{teamId:team.teamId});
			queryOptions.sql = "DELETE FROM products where product.productId=:productId";
			await this.conn.query(queryOptions,{productId:team.productId});
			return true;
		} catch (error) {
			// TODO add user back if failed
			// await this.addUser(user);
			console.error(error);
			return false;
		}
	}

	async modifyTeam(team: Team): Promise<Team | null> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "UPDATE teams SET productId=:productId, teamName=:teamName, teamDetails=:teamDetails, location=:location, year=:year, reproductId=:reproductId WHERE teamId=:teamId"
			};
			await this.conn.query(queryOptions,team);
			queryOptions.sql = "SELECT * FROM teams WHERE teams.teamId=:teamId";
			const teamResponse:Team[] = await this.conn.query(queryOptions,{teamId:team.teamId});
			if(teamResponse[0])
				return teamResponse[0];
			else
				return null;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async addUserToTeam(user: User, team: Team, role: string): Promise<UserTeams | null> {  
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "INSERT INTO userTeams (userId,teamId,role) VALUES(:userId,:teamId,:role)"
			};
			await this.conn.query(queryOptions,{userId:user.userId, teamId:team.teamId, role:role});
			queryOptions.sql="SELECT LAST_INSERT_ID()";
			const id:{"LAST_INSERT_ID()":number}[] = await this.conn.query(queryOptions);
			queryOptions.sql="SELECT * FROM userTeams WHERE userTeams.userProductId=:id"
			const userInTeam:UserTeams[] = await this.conn.query(queryOptions,{id:id[0]["LAST_INSERT_ID()"]});
			if(userInTeam[0])
				return userInTeam[0];
			else
				return null
		} catch (e) {
			console.error(e);
			return null
		}
	}

	async deleteUserFromTeam(user: User, team: Team): Promise<boolean>
	{
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "DELETE FROM userTeams WHERE userTeams.userId=:userId AND teamId=:teamId"
			};
			await this.conn.query(queryOptions,{userId:user.userId, teamId:team.teamId});
			return true;
		} catch (e) {
			console.error(e);
			return false
		}
	}
	// changed param from User to number, (userId)
	async getUserTeams(userId: number): Promise<Team[]> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				nestTables:"_",
				sql: "SELECT teams.*, userTeams.* FROM teams INNER JOIN userTeams ON userTeams.teamId = teams.teamId WHERE userTeams.userId=:userId"
			};
			const teamsReponse:Team[] = await this.conn.query(queryOptions,{userId});
			if(teamsReponse.length > 0)
				return teamsReponse;
			else
				return [];
		} catch (e) {
			console.error(e);
			return [];
		}
	}

	async getTeams(): Promise<Team[]> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				nestTables:"_",
				sql: "SELECT teams.*, products.* FROM teams INNER JOIN products ON teams.productId = products.productId"
			};
			const teamsReponse:Team[] = await this.conn.query(queryOptions);
			console.log(teamsReponse);
			if(teamsReponse.length > 0)
				return teamsReponse;
			else
				return [];
		} catch (e) {
			console.error(e);
			return [];
		}
	}
	async getTeamsByLocation(location:string): Promise<Team[]> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				nestTables:"_",
				sql: "SELECT teams.*, products.* FROM teams INNER JOIN products ON teams.productId = products.productId and teams.location=:location"
			};
			const teamsReponse:Team[] = await this.conn.query(queryOptions,{location});
			console.log(teamsReponse);
			if(teamsReponse.length > 0)
				return teamsReponse;
			else
				return [];
		} catch (e) {
			console.error(e);
			return [];
		}
	}

	async getTeamById(teamId: number): Promise<Team | null> {
		try{
			if(teamId && !isNaN(teamId)) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: "SELECT * FROM teams WHERE teams.teamId=:teamId"
				};
				const teamsReponse:Team[] = await this.conn.query(queryOptions,{teamId});
				if(teamsReponse[0])
					return teamsReponse[0];
				else
					return null;
			} else 
				return null;
		} catch (e) {
			console.log("GetTeamByID");
			console.error(e);
			return null;
		}
	}

	async getTeamByProductId(productId: number): Promise<Team | null> {
		try{
			if(productId && !isNaN(productId)) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: "SELECT * FROM teams WHERE teams.productId=:productId"
				};
				const teamsReponse:Team[] = await this.conn.query(queryOptions,{productId});
				if(teamsReponse[0])
					return teamsReponse[0];
				else
					return null;
			} else 
				return null;
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async getTeamsByIdList(list: number[]): Promise<Team[]> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM teams WHERE teams.teamId IN (:...list)"
			};
			const teamsReponse:Team[] = await this.conn.query(queryOptions,{list});
			if(teamsReponse[0])
				return teamsReponse;
			else
				return [];
		} catch (e) {
			console.error(e);
			return [];
		}
	}
	/**
		OGOR 28 49
		iccguard 35 56
		PacketCloud 36 57
		Rungutan 105 127
		Exigo 32 53
		LEDD 40 61
		Synovius 101 123
		Vatis Tech 34 55
		actevanzarimasini 26 47
		ESENCA 15 34
		ParkingWizzard 67 88
		Themis 25 46
		KidsFinance 21 42
		HereItIs 106 128
		PolyMore 89 111
		Tire2Tire 18 37
	*/
	async tempF():Promise<number[]> {
		try{
			const tList:number[] = [];
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT teamId FROM teams WHERE teams.teamId IN (:...list)"
			};
			const teamsList:Team[] = await this.conn.query(queryOptions,{list:[28,35,36,105,32,40,101,34,26,15,67,25,21,106,89,18]});
			if(teamsList.length > 0){
				for(const t of teamsList) {
					tList.push(t.teamId);
				}
				return tList;
			}
			else
				return [];
		} catch (e) {
			console.error(e);
			return [];
		}
	}

	async getProductById(productId: number): Promise<Product | null> {
		try{
			if(productId && !isNaN(productId)) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: "SELECT * FROM products WHERE products.productId=:productId"
				};
				const productResponse:Product[] = await this.conn.query(queryOptions,{productId});
				if(productResponse[0])
					return productResponse[0];
				else
					return null;
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			return null;
		}
	}
	async getUserInTeam(userId:number, teamId:number): Promise<UserTeams | null> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM userTeams WHERE userTeams.userId=:userId AND userTeams.teamId=:teamId"
			};
			const userTeamsResponse:UserTeams[] = await this.conn.query(queryOptions,{teamId, userId});
			if(userTeamsResponse[0])
				return userTeamsResponse[0];
			else
				return null;
		} catch (e) {
			console.error(e);
			return null;
		}
	}
	
	async getTimestampProduct(productId:number): Promise<Product | null> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT products.timestamp FROM products WHERE products.productId=:productId"
			};
			const productResponse:Product[] = await this.conn.query(queryOptions,{productId});
			if(productResponse[0])
				return productResponse[0];
			else
				return null;
		} catch (e) {
			console.error(e);
			return null;
		}
	}
	async getTeamByYearAndLocation(year: number, location:string, teamName:string): Promise<Team | null> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM teams WHERE teams.year=:year AND teams.location=:location AND teams.teamName=:teamName"
			};
			const teamResponse:Team[] = await this.conn.query(queryOptions,{year, location, teamName});
			if(teamResponse[0])
				return teamResponse[0];
			else
				return null;
		} catch (e) {
			console.error(e);
			return null;
		}
	}
	
	async isTeamInDate(date:string, productId:number): Promise<boolean> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: ""
			};
			let response:Product[];
			if(date === "may") {
				queryOptions.sql="SELECT * FROM products WHERE products.productId=:productId JSON_EXTRACT(productDetails,'$.assessment20May') = 'Yes'"
				response = await this.conn.query(queryOptions,{productId});
			} else if(date === "oct") {
				queryOptions.sql="SELECT * FROM products WHERE products.productId=:productId JSON_EXTRACT(productDetails,'$.assessment20May') = 'Yes' AND JSON_EXTRACT(productDetails,'$.assessment12Oct') = 'Yes'"
				response = await this.conn.query(queryOptions,{productId});
			} else if(date === "none") {
				return true;
			} else {
				return false;
			}
			if(response[0])
				return true;
			else
				return false;
		} catch (e) {
			console.error(e);
			return false;
		}
	}
	async getUsersByTeamId(teamId: number): Promise<(User & UserTeams)[]> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				nestTables:"_",
				sql: "SELECT userTeams.*, users.* FROM userTeams INNER JOIN users ON users.userId=userTeams.userId WHERE userTeams.teamId=:teamId"
			};
			const teamResponse:(User & UserTeams) [] = await this.conn.query(queryOptions,{teamId});
			if(teamResponse[0])
				return (teamResponse as any)[0]; // weird error?
			else
				return ([] as any);
		} catch (e) {
			console.error(e);
			return ([] as any);
		}
	}

	async getProductByTeamId(teamId: number): Promise<Product | null> {
		try{
			const teamById: Team | null = await this.getTeamById(teamId);
			if(teamById) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: "SELECT * FROM products WHERE products.productId=:productId"
				};
				const teamResponse:Product [] = await this.conn.query(queryOptions,{productId:teamById.productId});
				if(teamResponse[0])
					return teamResponse[0];
				else
					return null;
			} else {
				return null;
			}
		} catch (e) {
			console.log("getProductByTeamId");
			console.error(e);
			return null;
		}
	}
	async getTeamAndProductByMentorId(mentorId: number): Promise<Team & Product[]> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				nestTables:"_",
				sql: "SELECT teams.*, products.* FROM teams INNER JOIN products ON teams.productId=products.productId AND products.mentorId=:mentorId"
			};
			const teamResponse:Team & Product[] = await this.conn.query(queryOptions,{mentorId});
			console.log(teamResponse);
			if(teamResponse.length > 0)
				return teamResponse;
			else
				return ([] as any);
		} catch(error) {
			console.error(error);
			return ([] as any);
		}
	}
	async getTeamByMentorId(mentorId: number): Promise<Team & Product[]> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				nestTables:"_",
				sql: "SELECT teams.* FROM teams INNER JOIN products ON products.productId=teams.productId WHERE products.mentorId=:mentorId"
			};
			const teamResponse:Team & Product[] = await this.conn.query(queryOptions,{mentorId});
			if(teamResponse.length > 0)
				return teamResponse;
			else
				return ([] as any);
		} catch(error) {
			console.error(error);
			return ([] as any);
		}
	}
	async getProductByMentorId(mentorId: number): Promise<Product[]> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM products WHERE mentorId=:mentorId"
			};
			const teamResponse:Product[] = await this.conn.query(queryOptions,{mentorId});
			if(teamResponse.length > 0)
				return teamResponse;
			else
				return ([] as any);
		} catch(error) {
			console.error(error);
			return ([] as any);
		}
	}
	async updateProduct(product: Product): Promise<Product | null> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "UPDATE products SET startupName=:startupName, businessTrack=:businessTrack, teamType=:teamType, workshopDay=:workshopDay, mentorId=:mentorId, descriptionEN=:descriptionEN, descriptionRO=:descriptionRO, pendingDescriptionEN=:pendingDescriptionEN, pendingDescriptionRO=:pendingDescriptionRO, productDetails=:productdetails, updatedAt=:updatedAt, lastMentorUpdate=:lastMentorUpdate WHERE productId=:productId"
			};
			await this.conn.query(queryOptions,product);
			queryOptions.sql = "SELECT * FROM products WHERE productId=:productId";
			const teamResponse:Product[] = await this.conn.query(queryOptions,{productId:product.productId});
			if(teamResponse[0])
				return teamResponse[0];
			else
				return null;
		} catch(error) {
			console.error(error);
			return null;
		}
	}
	async updateTeam(team: Team): Promise<Team | null> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "UPDATE teams SET productId=:productId, teamName=:teamName, teamDetails=:teamDetails, location=:location, year=:year, reproductId=:reproductId WHERE teamId=:teamId"
			};
			await this.conn.query(queryOptions,team);
			queryOptions.sql = "SELECT * FROM teams WHERE teams.teamId=:teamId";
			const teamResponse:Team[] = await this.conn.query(queryOptions,{teamId:team.teamId});
			if(teamResponse[0])
				return teamResponse[0];
			else
				return null;
		} catch(error) {
			console.error(error);
			return null;
		}
	}
	async approveDescription(product:Product): Promise<Product | null> {
		try{
			if(product.pendingDescriptionEN !== "")
				product.descriptionEN = product.pendingDescriptionEN;
			if(product.pendingDescriptionRO !== "")
				product.descriptionRO = product.pendingDescriptionRO;
			product.pendingDescriptionEN = "";
			product.pendingDescriptionRO = "";

			const productResponse = await this.updateProduct(product);
			if(productResponse)
				return productResponse;
			else
				return null;
		} catch(error) {
			console.error(error);
			return null;
		}
	}
	async getUserActivity(userId: number, teamId: number): Promise<UserActivity[]> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM userActivities WHERE userActivities.userId=:userId AND userActivities.teamId=:teamId"
			};
			const teamResponse:UserActivity[] = await this.conn.query(queryOptions,{userId, teamId});
			if(teamResponse.length > 0)
				return teamResponse;
			else
				return [];
		} catch(error) {
			console.error(error);
			return [];
		}
	}

	async addActivityForUser(userActivity: UserActivity): Promise<UserActivity | null> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM userActivities WHERE userId=:userId AND teamId=:teamId AND (WEEK(date, 7)=WEEK(CURDATE(), 7) OR WEEK(date, 7)=(WEEK(CURDATE(), 7)-1)) AND WEEK(date, 7)=WEEK(:date, 7)"
			};
			const activityResponse:UserActivity[] = await this.conn.query(queryOptions,userActivity);
			if(activityResponse[0])
				return null;
			else {
				queryOptions.sql = "INSERT INTO userActivities (userId,teamId,noOfHours,date,description) VALUES(:userId,:teamId,:noOfHours,:date,:description)";
				await this.conn.query(queryOptions,userActivity);
				queryOptions.sql="SELECT LAST_INSERT_ID()";
				const id:{"LAST_INSERT_ID()":number}[] = await this.conn.query(queryOptions);
				queryOptions.sql="SELECT * FROM userActivities WHERE userActivities.activityId=:id"
				const activity:UserActivity[] = await this.conn.query(queryOptions,{id:id[0]["LAST_INSERT_ID()"]});
				if(activity[0]) {
					return activity[0];
				} else {
					return null;
				}
			}
		} catch(error) {
			console.error(error);
			return null;
		}
	}

	async modifyActivityForUser(userActivity: UserActivity): Promise<UserActivity | null> {
		try{
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM userActivities WHERE userId=:userId AND teamId=:teamId AND (WEEK(date, 7)=WEEK(CURDATE(), 7) OR WEEK(date, 7)=(WEEK(CURDATE(), 7)-1)) AND WEEK(date, 7)=WEEK(:date, 7)"
			};
			const activityResponse:UserActivity[] = await this.conn.query(queryOptions,{userActivity});
			if(activityResponse[0]){
				queryOptions.sql = "UPDATE userActivities SET userId=:userId, teamId=:teamId, noOfHours=:noOfHours, date=:date, description=:description";
				await this.conn.query(queryOptions,{userActivity});
				queryOptions.sql="SELECT * FROM userActivities WHERE activityId=:activityId";
				const activity:UserActivity[] = await this.conn.query(queryOptions,{activityId:userActivity.activityId});
				if(activity[0]) {
					return activity[0];
				} else {
					return null;
				}
			}
			else {
				return null;
			}
		} catch(error) {
			console.error(error);
			return null;
		}
	}
	async updateActivity(userActivity: UserActivity): Promise<UserActivity | null> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql:"UPDATE userActivities SET userId=:userId, teamId=:teamId, noOfHours=:noOfHours, date=:date, description=:description"
			}; 
			await this.conn.query(queryOptions,{userActivity});
			queryOptions.sql="SELECT * FROM userActivities WHERE userActivities.activityId=:activityId";
			const activity:UserActivity[] = await this.conn.query(queryOptions,{activityId:userActivity.activityId});
			if(activity[0]) {
				return activity[0];
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			return null;
		}
	}
	async updateUserTeamDetails(userTeam: UserTeams):Promise<UserTeams | null> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql:"UPDATE userTeams SET userId=:userId, teamId=:teamId, role=:role"
			}; 
			await this.conn.query(queryOptions,{userTeam});
			queryOptions.sql="SELECT * FROM userTeams WHERE userProductId=:userProductId";
			const activity:UserTeams[] = await this.conn.query(queryOptions,{userProductId:userTeam.userProductId});
			if(activity[0]) {
				return activity[0];
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	public static getInstance (): TeamsServer
	{
		if (!this.INSTANCE)
		{
			this.INSTANCE = new TeamsServer ();
		}
		return this.INSTANCE;
	}

}
const router = Router();
const teams = TeamsServer.getInstance();

const authFunct = getAuthorizationFunction();
if(authFunct)
	router.use((authFunct as any));
	// Bypass params dictionary and send authorization Function

router.get("/teams:userId", async(req, res) => {
	try {
		const all_teams: Team[] = await teams.getUserTeams(parseInt(req.params.userId));
		if(all_teams)
			res.send(all_teams);
		else 
			res.status(204).send({err: 204});
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500});
	}
});
// List all teams
router.get("/mentor/teamsAndProduct/:mentorId", async(req, res) => {
	try {
		const allTeams: Team& Product[] = await teams.getTeamAndProductByMentorId(parseInt(req.params.mentorId));
		if(allTeams)
			res.status(200).send(allTeams);
		else
			res.status(204).send([])
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}

});

router.get("/mentor/teams/:mentorId", async(req, res) => {
	try { 
		const allTeams: Team & Product[] = await teams.getTeamByMentorId(parseInt(req.params.mentorId));
		if(allTeams)
			res.status(200).send(allTeams);
		else
			res.status(204).send([]);
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}

});

router.get("/teams/demoDay", async(req,res) => {
	try { 
		const demoDayTeams: number[] = await teams.tempF();
		if(demoDayTeams)
			res.status(200).send(demoDayTeams);
		else
			res.status(204).send([]);
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}
});

router.get("/team/:teamId", async(req,res) => {
	try {
		const team: Team | null = await teams.getTeamById(parseInt(req.params.teamId));
		if(team) 
			res.status(200).send(team);
		else
			res.status(204).send({});
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}
});
router.get("/team/users/:teamId", async(req,res) => {
	try {
		const users: (User & UserTeams)[] = await teams.getUsersByTeamId(parseInt(req.params.teamId));
		if(users) 
			res.status(200).send(users);
		else
			res.status(204).send([]);
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}

});

router.post("/team/activity", async(req,res) => {
	try {
		const userActivities: UserActivity[] = await teams.getUserActivity(req.body.userId, req.body.teamId);
		if(userActivities) 
			res.status(200).send(userActivities);
		else
			res.status(204).send([]);
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}
});
router.post("/team/activity/update", async(req,res) =>{
	try {
		const userActivity: UserActivity | null = await teams.updateActivity(req.body.activity);
		if(userActivity) 
			res.status(200).send(userActivity);
		else
			res.status(204).send({});
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}
});
router.post("/team/remove/users", async(req, res) => {
	try {
		const toRemove = req.body.users;
		const teamId = req.body.teamId;
		let r = false;
		for(const user of toRemove) {
			if(user.userId === undefined) 
				user.userId = user.UserTeams_userId;
			r = await teams.deleteUserFromTeam(user,{teamId:teamId} as Team);
			if(!r){
				break;
			}
		}
		if(r)
			res.status(200).send(true);
		else
			res.status(204).send(false);
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:false});
	}
});
router.post("/team/add/users", async(req, res) => {
	try{
		const toAdd = req.body.users;
		const teamId = req.body.teamId;
		let userTeam:UserTeams | null = null;
		for(const user of toAdd) {
			if(user.userId === undefined) 
				user.userId = user.UserTeams_userId;
			userTeam = await teams.addUserToTeam({userId:user.userId} as User,{teamId:teamId} as Team, "");
			if(userTeam === null) {
				break;
			}
		}
		if(userTeam)
			res.status(200).send(true);
		else
			res.status(204).send(false);
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	} 
});

router.post("/product", async(req,res) => {
	try {
		const newProduct: Team & Product | null = await teams.addTeam(req.body.team, req.body.product);
		if(newProduct) 
			res.status(200).send(newProduct);
		else
			res.status(204).send({});
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}
});

router.get("/product/:teamId", async(req,res) => {
	try { 
		const product: Product | null = await teams.getProductByTeamId(parseInt(req.params.teamId));
		if(product) 
			res.status(200).send(product);
		else
			res.status(204).send({});
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}
});

router.post ("/product/approve/description", async(req,res) => {
	try {
		const product:Product = req.body.product;
		if(product.pendingDescriptionEN.trim() == "") {
			product.pendingDescriptionEN = product.descriptionEN;
		}
		if(product.pendingDescriptionRO.trim() == "") {
			product.pendingDescriptionRO = product.descriptionRO;
		}
		if(product) {
			const response = await teams.approveDescription(product);
			if(response)
				res.status(200).send(response);
			else
				res.status(204).send({});
		} else 
			res.status(204).send({});
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}
	
});

router.post("/product/update", async(req,res) => {
	try {
		const product: Product = req.body.product;
		const teamId: number = req.body.teamId;
		if(req.body.product) {
			const team: Team | null = await teams.getTeamById(teamId);
			if(team) {
				team.teamName = product.startupName;
				const newTeam:	Team | null = await teams.updateTeam(team);
				if(newTeam) {
					const newProduct: Product | null = await teams.updateProduct(product);
					if(newProduct)
						res.status(200).send(newProduct);
					else 
						res.status(204).send({});
				} else {
					res.status(204).send({});
				}
			} else {
				res.status(204).send({});
			}
		}
		else
			res.status(204).send({});
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}
});

const server = Server.getInstance ();
server.registerRouterAPI (1, router, "/teams");