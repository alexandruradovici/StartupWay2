import { MessageType, NotificationType, Recovery, Review } from "../common";
import * as _ from "lodash";
import * as Papa from "papaparse";
import moment from "moment";
import randomstring from "randomstring";

import { Router } from "express";
import { QueryOptions, PoolConnection } from "mariadb";
import { Server, ApiResponse, ApiRequest } from "@startupway/main/lib/server";
import { getPool } from "@startupway/database/lib/server";
import { getAuthorizationFunction, User, UsersServer } from "@startupway/users/lib/server";
import { DaemonServer } from "@startupway/daemons/lib/server";
import { UserActivity, UserTeams, BusinessTrack, Team, Product, TeamType, WorkshopDay, TeamsServer } from "@startupway/teams/lib/server";

import { ParsedCSV, UpdateCSV, SWNotify } from '../common/index';
import { v4 as uiidv4 } from 'uuid';
const users = UsersServer.getInstance();
const teams = TeamsServer.getInstance();
const daemon = DaemonServer.getInstance();

function parseEnum<D,T extends Record<string,D>>(t:T,key:string):D | undefined {
	return t[key as keyof T];
}
export class AdminServer {

	private static INSTANCE?: AdminServer;
	private users: UsersServer = users;
	
	/**
	 * Internal function that parses a single line from a .CSV file
	 * Params are sent via deconstruction an array ...arr
	 * @param loc - location
	 * @param workshopNo - workshop day
	 * @param teamMentor - mentor email
	 * @param teamId - teamId for database
	 * @param teamTrack - team type
	 * @param businessTrack - team business track
	 * @param teamName - name of the team
	 * @param pitcher - pitcher name
	 * @param role - user role in team
	 * @param firstName - user firstname
	 * @param lastName - user lastname
	 * @param email - user email
	 * @param phone - user phonenumber
	 * @param facebook - user facebook link
	 * @param linkedin - user linkedin link
	 * @param shortDescRO - team short description RO
	 * @param shortDescEN - team short description EN
	 * @param birthDate - user birthdate
	 * @param faculty - user faculty
	 * @param group - user group at faculty
	 * @param findProgram - shot description on how the user found the program
	 * @returns { teamId:string, workshop:WorkshopObj, team:{}, product:{}, user:{} } parsedCSV | null - contains all the info about the user and it's asociated team and product
	 */
	//TODO import parsedCSV type -> toate datele corecte altfel nu importa usersul.
	// Toate id-urile devin string-uri cu uuidv4 dimensiune fixa 16 caractere
	public parseCSVData(loc?:string ,workshopNo?:string ,teamMentor?:string ,teamId?:string ,teamTrack?:string ,businessTrack?:string ,teamName?:string ,pitcher?:string ,
		role?:string ,firstName?:string ,lastName?:string , email?:string ,phone?:string ,facebook?:string ,linkedin?:string ,
		shortDescRO?:string, shortDescEN?:string, birthDate?:string ,faculty?:string ,group?:string ,findProgram?:string ):
		ParsedCSV | null
	{
		try {
			if(teamMentor === undefined || firstName === undefined || lastName === undefined || email === undefined || teamId === undefined)
				return null;
			let parsedCSV:ParsedCSV = {
				teamId:parseInt(teamId)
			}; 
			
			enum days {
				NONE,
				MONDAY,
				TUESDAY,
				WEDNESDAY,
				THURSDAY,
				FRIDAY,
				SATURDAY,
				SUNDAY
			}
			const productId = uiidv4();
			const insertTeamId = uiidv4();
			if(teamName !== undefined && loc !== undefined && teamMentor !== undefined && pitcher !== undefined) {
				parsedCSV.team = {
					teamId:insertTeamId,
					productId:productId,
					teamName:teamName,
					location:loc,
					year:new Date().getFullYear(),
					teamDetails:{
						"mentor":teamMentor,
						"pitcher":pitcher
					},
				}
			} else {
				return null;
			}
			let bT:string = "";
			if(businessTrack !== undefined) {
				bT = (businessTrack as string).toUpperCase().replace(/\s+/g, '');
			}
			let tT = "";
			if(teamTrack !== undefined) {
				tT = (teamTrack as string).split("-")[0].toUpperCase();
			}
			let wD = "";
			if(workshopNo !== undefined) {
				wD = days[parseInt(workshopNo as string)];
			}
			const bTValue = parseEnum<BusinessTrack,typeof BusinessTrack>(BusinessTrack,bT);
			const tTValue = parseEnum<TeamType,typeof TeamType>(TeamType,tT);
			const wDValue = parseEnum<WorkshopDay,typeof WorkshopDay>(WorkshopDay,wD);
			let btVal = "";
			let ttVal = "";
			let wdVal = "";
			if(bTValue !== undefined) {
				btVal = bTValue;
			}
			if(tTValue !== undefined) {
				ttVal = tTValue;
			}
			if(wDValue !== undefined) {
				wdVal = wDValue;
			}
			parsedCSV.product = {
				productId:productId,
				startupName:teamName,
				mentorId:"",
				// Need to index enum based on string
				businessTrack:btVal,
				teamType:ttVal,
				workshopDay:wdVal,
				descriptionEN:"",
				descriptionRO:"", 
				pendingDescriptionEN: "",
				pendingDescriptionRO: "",
				productDetails: {
					website: "",
					linkedin: "",
					facebook: "",
					mentorNotes: "",
					adminNotes: "",
					assesmentFinals: "",
					assesmentSemifinals: ""
				},
				updatedAt:new Date(),
				lastMentorUpdate:new Date(),
			}

			if(parsedCSV.product && wDValue) {
				parsedCSV.product.workshopDay = wdVal;
			}

			if(parsedCSV.product && bTValue) {
				parsedCSV.product.businessTrack = btVal;
			}

			if(parsedCSV.product && tTValue) {
				parsedCSV.product.teamType = ttVal;
			}
			if(parsedCSV.product && shortDescRO) {
				parsedCSV.product.descriptionRO = shortDescRO;
			}
			if(parsedCSV.product && shortDescEN) {
				parsedCSV.product.descriptionEN = shortDescEN;
			}
			
			let username = "";
			if(email !== undefined)
				username = (email as string).split("@")[0].toLowerCase();

			let aux = new Date(); // .toISOString().split('T')[0];

			try {
				if(birthDate !== undefined)
					aux = new Date((birthDate as string)); // .toISOString().split('T')[0];
			} catch (e) {
				console.error(e);
			}
			const userId = uiidv4();
			parsedCSV.user = {
				userId:userId,
				firstName:(firstName as string),
				lastName:(lastName as string),
				username:username,
				password:"",
				email:(email as string),
				phone:(phone as string),
				socialMedia:{
					"facebook":(facebook as string),
					"linkedin":(linkedin as string)
				},
				birthDate:aux,
				userDetails:{
					"faculty":faculty,
					"group":group,
					"details":"How din you find about Innovation Labs: " +findProgram
				},
				role:(role as string),
				avatarUu:"",
				lastLogin:new Date()
			}
			return parsedCSV;
		} catch (error) {
			console.error("Error in function \"_parseCSVData(...array of params)\"|\"admin\" ")
			console.error(error);
			return null;
		}
	}
	
	public parseUpdateCSV(loc?:string, teamName?:string, descRO?:string, descEN?:string):UpdateCSV | null {
		try {
			let updateCSV:UpdateCSV | null = null;
			if(loc !== undefined && loc !== "" && teamName !== undefined && teamName !== "") {
				updateCSV = {
					location:loc,
					teamName:teamName,
					descRO:"",
					descEN:""
				};
				if(descRO !== undefined) {
					updateCSV.descRO = descRO;
				}
				if(descEN !== undefined) {
					updateCSV.descEN = descEN;
				}
				return updateCSV;
			} else {
				console.error("No Location or teamName");
				return null;
			}
		} catch (error) {
			console.error("Error in function \"parseUpdateCSV()|\"admin\"\"");
			console.error(error);
			return null;
		}
	}
	/**
	 * Internal function that creates a random password
	 * @returns { string } - the generated password
	 */
	public randomPassword():string {
		return Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10)
	}

	/**
	 * Function that generates a recovery token used in password recovery
	 * @returns {string} the recovery token
	 */
	_randomRecoveryGenerator():string{
		const string:string = randomstring.generate({ length: 100 });;
		return string;
	}

	/**
	 * Function that formats a Date object to a readeable string
	 * @param date - Date object
	 * @returns {string} a readeable date string or ""
	 */
	formatDate(date: Date):string {
		try {
			const time  = (new Date(date)).toTimeString().split(" ");
			if(new Date(date).toString() === "Invalid Date")
				return "";
			else
				return (new Date(date)).toDateString() + " " + time[0];
		} catch (error) {
			console.log("Error in function \"formatDate(date: Date)\"|\"admin\"")
			console.error(error);
			return "";
		}
	}

	/**
	 * Function that extract information from the database about all teams that have passed 20th may assesment and 
	 * 		all of their uploaded files. 
	 * @returns {Promise<any[]>} an array of informations about each team
	 */
	async getUDCData():Promise<any[]> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"SELECT IF(JSON_EXTRACT(productDetails,'$.assessment20May') = \"Yes\",\"DA\",\ Echipa,JSON_EXTRACT(t.teamDetails,'$.mentor') as Mentor,IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"pres\")>0,\"DA\",\"NU\") as 'Au prezentare pptx incarcata?',IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"image\")>0,(SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"image\"),0) as 'Au poze la \"Product Images\"?',IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"demoVid\")>0,\"DA\",\"NU\") as 'Au \"Tehnic Demo Video\" incarcat?', IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"presVid\")>0,\"DA\",\"NU\") as 'Au \"Product Presentation Video\" incarcat?',IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"logo\")>0,\"DA\",\"NU\") as 'Au \"Logo\" incarcat?',IF((JSON_EXTRACT(p.productDetails,'$.website')=''),'NU','DA') as 'Au link catre pagina web a produsului?',IF((JSON_EXTRACT(p.productDetails,'$.facebook')=''),'NU','DA') as 'Au link catre pagina de facebook a produsului?',DATE_FORMAT(p.lastMentorUpdate, \"%d %M %Y\") as \"Ultima actualizare a descrierii RO\",DATE_FORMAT(p.lastMentorUpdate, \"%d %M %Y\") as \"Ultima actualizare a descrierii ENG\",CONCAT((SELECT count(*) from (SELECT u.avatarUu, t1.teamId,IF(u.avatarUu!='',\"Yes\",\"No\") as has from users u inner join userTeams uT on u.userId = uT.userId inner join teams t1 on t1.teamId = uT.teamId ) as t2 where t2.teamId = t.teamId and t2.has =\"Yes\" ),'|',(SELECT count(*) from (SELECT u.avatarUu, t1.teamId, IF(u.avatarUu!='',\"Yes\",\"No\") as has from users u inner join userTeams uT on u.userId = uT.userId inner join teams t1 on t1.teamId = uT.teamId ) as t2 where t2.teamId = t.teamId)) as \"Au toti membrii echipei poza incarcata?\", IFNULL(DATE_FORMAT(tab.date, '%d %M %Y'),'') as \"Ultima actualizare a Lean Model Canvas\",DATE_FORMAT(p.updatedAt, \"%d %M %Y\") as \"Ultima actualizare\" from teams t inner join products p on t.productId = p.productId and JSON_EXTRACT(productDetails,'$.assessment20May') = \"Yes\" left join (SELECT date, productId from bModelCanvas group by productId) as tab on p.productId = tab.productId;"
				}
				const response:any[] = await conn.query(queryOptions);
				if(response && response.length > 0) {
					await conn.release();
					return response
				} else {
					await conn.release();
					return [];
				}
			} else {
				return [];
			}
		} catch (e) {
			console.log("Error in function \"getUDCData()\"|\"admin\"")
			console.error(e);
			if(conn)
				await conn.release();
			return [];
		}
	}
	
	/**
	 * Function that extract information from the database about all teams and their descriptions 
	 * @returns {Promise<any[]>} an array of informations about each team
	 */
	async getTeamData():Promise<any[]> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"SELECT t.location as 'oras', t.teamName as 'nume_echipa', p.businessTrack as 'business_track', p.teamType as 'type', p.descriptionRO as 'descriere_RO', p.descriptionEN as 'descriere_ENG' from teams t inner join products p on p.productId = t.productId and JSON_EXTRACT(productDetails,'$.assessment20May') = 'Yes';"
	
				}
				const response:any[] = await conn.query(queryOptions);
				if(response && response.length > 0) {
					await conn.release();
					return response
				} else {
					await conn.release();
					return [];
				}
			} else {
				return [];
			}
		} catch (e) {
			console.log("Error in function \"getTeamData()\"|\"admin\"")
			console.error(e);
			if(conn)
				await conn.release();
			return [];
		}
	}

	/**
	 * Function that adds a recovery object containing the information about a users password recovery into the database
	 * @param recovery - object that contains information about the incoming recovery of password request
	 * @returns {Promise<Recovery>} - a recovery object
	 */
	async addRecovery(recovery: Recovery):Promise<Recovery | null> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				recovery.recoveryLink = this._randomRecoveryGenerator();
				const user = await this.users.getUserByEmail(recovery.email);
				if(user)
					recovery.userId = user.userId;
				else throw new Error("No such user");
				
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"INSERT INTO recoveries (recoveryId,userId,email,recoveryLink) VALUES(:recoveryId,:userId,:email,:recoveryLink)"
				}
				await conn.query(queryOptions,recovery);
				queryOptions.sql = "SELECT recoveryId,userId,email,recoveryLink FROM recoveries WHERE recoveryId=:recoveryId"
				const newRecovery:Recovery[] = await conn.query(queryOptions,{recoveryId:recovery.recoveryId});
				if(newRecovery && newRecovery.length > 0 && newRecovery[0]) {
					const msg:string = "Hello " + user.firstName + " " + user.lastName +" ,\n\n" 
					+ "Here is your activation link, please click here to reset your password.\n" 
					+ "		https://teams.innovationlabs.ro/#/recovery/"+newRecovery[0].recoveryLink + "\n"
					+ "Regards, Innovation Labs Team\n" ;
					const notification:SWNotify = {
						email:user.email,
						notifyType:NotificationType.EMAIL,
						msgType:MessageType.RESETPASS,
						text:msg,
						date:new Date()
					}
					const newNotification:SWNotify | null = await daemon.addNotification(notification);
					if(newNotification) {
						await conn.commit();
						await conn.release();
					} else {
						await conn.rollback();
						await conn.release();
						return null;
					}
					return newRecovery[0];
				}
				else throw new Error("Can't add recovery")
			} else {
				return null;
			}
		} catch (error) {
			console.log("Error in function \"addRecovery(recovery)\"|\"admin\"");
			console.error(error);
			if(conn) {
				await conn.rollback();
				await conn.release();
			}
			return null;
		}
	}

	
	/**
	 * Function that deletes a recovery object from the databse
	 * @param recoveryId - unique indentifier to find the specified recovery in the database
	 */
	async deleteRecovery(recoveryId:string):Promise<boolean> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"DELETE FROM recoveries WHERE recoveryId=:recoveryId"
				}
				await conn.query(queryOptions,{recoveryId});
				queryOptions.sql = "SELECT recoveryId FROM recoveries WHERE recoveryId=:recoveryId";
				const response:{deleted_id:string}[] = await conn.query(queryOptions, {recoveryId});
				if(response && response.length === 0) {
					await conn.commit();
					await conn.release();
					return true;
				} else {
					await conn.rollback();
					await conn.release();
					return false;
				}
			} else {
				return false;
			}
		} catch (error) {
			console.log("Error in function \"deleteRecovery(recoveryId)\"|\"admin\"");
			console.error(error);
			if(conn) {
				await conn.rollback();
				await conn.release();
			}
			return false;
		}
	}

	/**
	 * Function that finds a recovery object in the database based on it's unique id
	 * @param id - unique identifier to find the recovery object in the database
	 * @returns {Promise<Recovery>} a recovery object
	 */
	async findRecoveryById(recoveryId:string):Promise<Recovery | null> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"SELECT * FROM recoveries WHERE recoveryId=:recoveryId"
				}
				const recovery:Recovery[] = await conn.query(queryOptions,{recoveryId});
				if (recovery && recovery.length > 0 && recovery[0]) {
					await conn.release();
					return recovery[0];
				} else {
					await conn.release();
					return null;
				}

			} else {
				return null;
			}
		} catch (error) {
			console.log("Error in function \"findRecoveryById(id)\"|\"admin\"");
			console.error(error);
			if(conn)
				await conn.release();
			return null;
		}
	}

	/**
	 * Function that finds a recovery object in the databse based on it's unique recoveryLink
	 * @param recoveryLink - unique recovery link that can be only once in the database
	 * @returns {Promise<Recovery>} a recovery object
	 */
	async findRecoveryByToken(recoveryLink:string):Promise<Recovery | null> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"SELECT * FROM recoveries WHERE recoveryLink=:recoveryLink"
				}
				const recovery:Recovery[] = await conn.query(queryOptions,{recoveryLink});
				if (recovery && recovery.length > 0 && recovery[0]) {
					await conn.release();
					return recovery[0];
				} else {
					await conn.release();
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			console.log("Error in function \"findRecoveryByToken(recoveryLink)\"|\"admin\"");
			console.error(error);
			if(conn)
				await conn.release();
			return null;
		}

	}

	public static getInstance (): AdminServer
	{
		if (!this.INSTANCE)
		{
			this.INSTANCE = new AdminServer ();
		}
		return this.INSTANCE;
	}

}
/**
 * Create a public router for the admin plugin
 */
const router = Router();
const admin = AdminServer.getInstance();
	// Bypass params dictionary and send authorization Function

/**
 * Route on which a reset email is created
 */
router.post("/createResetEmail", async (req:ApiRequest<{email:string}>,res:ApiResponse<Recovery | null>) => {
	try {
		/** @type {string} Email destination string */
		const email = req.body.email;
		// Null as any -> TO discuss if we change interface to recoveryId: string|null,  userId:string|null
		const aux:Recovery = {
			recoveryId:uiidv4(),
			userId:"",
			email:email,
			recoveryLink:"",
		};
		/** @type {Recovery} Recovery object */
		const recovery:Recovery | null = await admin.addRecovery(aux);
		if(recovery) {
			res.send(recovery);	
		} else {
			res.status(401).send({err:401, data:null});
		}
		res.status(201).send({});
	} catch (error) {
		console.error("Error on route \"/createResetEmail\" in \"admin\" router");
		console.error(error);	
		res.status(500).send({err:500, data:null});
	}
});

/**
 * Route on which the reset of a user's password is being done
 * Can be accessed only by the unique token generated in the email
 * 
 */
router.post("/resetPassword", async (req:ApiRequest<{token:string,password:string}>,res:ApiResponse<{username:string} | null>) => {
	
	/** @type {string} Password reset token */
	const token = req.body.token;
	
	/** @type {string} Password */
	const password = req.body.password;

	try {
		const recovery:Recovery | null = await admin.findRecoveryByToken(token);
		if(recovery) {
			const user:User | null = await users.getUserByEmail(recovery.email);
			if(user) {
				user.password = await UsersServer.passwordGenerator(password);
				await users.modifyUser(user);
				res.status(200).send({username:user.username});
			} else {
				res.status(401).send({err:401, data:null});
			}
		} else {
			res.status(401).send({err:401, data:null});
		}	
	} catch (error) {
		console.error("Error on route \"/resetPassword\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401, data:null});
	}
	
});

/**
 * Route on which the generated token is beign verified to actually exist
 */
router.post("/checkToken", async(req:ApiRequest<{token:string}>,res:ApiResponse<{matched:boolean} | null>) => {

	/** @type {string} unique token */
	const token = req.body.token;
	try {
		const recovery:Recovery | null = await admin.findRecoveryByToken(token);
		if(recovery) {
			res.send({matched:true});
		} else {
			res.send({matched:false});
		}
	} catch (error) {
		console.error("Error on route \"/checkToken\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401, data:null});
	}
});

/**
 * Route on which a recovery is deleted based on it's unique token
 */
router.post("/deleteRecovery", async(req:ApiRequest<{token:string}>,res:ApiResponse<boolean>) => {

	/** @type {string} unique token */
	const token = req.body.token;
	try {
		const recovery:Recovery | null = await admin.findRecoveryByToken(token);
		if(recovery) {
			await admin.deleteRecovery(recovery.recoveryId);
			res.status(200).send(true);
		} else {
			res.status(401).send(false);
		}
	} catch (error) {
		console.error("Error on route \"/deleteRecovery\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401, data:false});
	}
});

/**
 * Create a private router for the admin plugin
 */
const authFunct = getAuthorizationFunction();
if(authFunct)
	router.use(authFunct);



router.post("/updateDescriptionCSV",async(req:ApiRequest<{encode:string}>,res:ApiResponse<boolean>) => {
	try {
		/** @type {string} base64 string of the data found in the .csv */
		const encoded = req.body.encode;
		/** @type {Buffer} Buffer with the data retrieved from the base64 string */
		const buffer = Buffer.from(encoded,"base64");
		/** @type {string} string in utf8 format of the data */
		const string  = buffer.toString("utf-8");
		/** @type {unknown} array with entries represented by each line of data in the .csv file */

		const parsed = Papa.parse<Array<string | undefined>>(string).data;
		parsed.splice(0,1);
		for(const arr of parsed) {
			if(arr) {
				const object = admin.parseUpdateCSV(...(arr));
				if(object !== null) {
					const team = await teams.getTeamByYearAndLocation((new Date()).getFullYear(), object.location, object.teamName);
					if(team) {
						const product = await teams.getProductByTeamId(team.teamId);
						if(product) {
							if(object.descEN !== "")
								product.descriptionEN = object.descEN;
							if(object.descRO !== "")
								product.descriptionRO = object.descRO;
							await teams.updateProduct(product);
						} else {
							console.error("\"/updateDescriptionCSV\" : Fetch Product Failed");
						}
					} else {
						console.error("\"/updateDescriptionCSV\" : Fetch Team Failed");
					}
				} else {
					console.error("\"/updateDescriptionCSV\" : Parse Function Failed");
				}
			} else {
				console.error("\"/updateDescriptionCSV\" : Papa Parse Failed");
			}
			// WORKAROUND for parsing the csv data. TODO -> Create interface for parsing
		}
		res.status(200).send({err:200, data:true});
	} catch (error) {
		console.error("Error on route \"/updateDescriptionCSV\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401, data:false});
	}
});
/**
 * Route on which information found in a .csv file is being uploaded into the database 
 */	// TODO SEE RETURN TYPE
router.post("/uploadCSV", async(req:ApiRequest<{encode:string}>,res:ApiResponse<any>) => {
	try {

		/** @type {string} base64 string of the data found in the .csv */
		const encoded = req.body.encode;
		
		/** @type {Buffer} Buffer with the data retrieved from the base64 string */
		const buffer = Buffer.from(encoded,"base64");
		
		/** @type {string} string in utf8 format of the data */
		const string  = buffer.toString("utf-8");
		
		/** @type {unknown} array with entries represented by each line of data in the .csv file */

		const parsed = Papa.parse<Array<string | undefined>>(string).data;

		parsed.splice(0,1);
		
		const obj:ParsedCSV[] = [];
		for(const arr of parsed) {
			if(arr) {
				const object = admin.parseCSVData(...(arr));
				if(object !== null)
					obj.push(object)
			}
			// WORKAROUND for parsing the csv data. TODO -> Create interface for parsing
			
		}
		const newObj = _.groupBy(obj,"teamId");
		for(const key in newObj) {
			// WORKAROUND for parsing the csv data. TODO -> Create interface for parsing
			for(const entry of newObj[key]) {
				let team:Team | null = null;
				if(entry.team && entry.product) {
					const mentorEmail:string = entry.team.teamDetails["mentor"];
					const mentor:User | null = await users.getUserByEmail(mentorEmail);
					let mentorUsername = "";
					if(mentorEmail !== undefined) {
						mentorUsername = mentorEmail.split("@")[0]
					}
					if(mentor) {
						entry.product.mentorId = mentor.userId;
					} else if(mentorUsername !== "") {
						const password = admin.randomPassword();
						let user:User | null = await users.addUser({
							// as any -> todo -> discuss if we change to userId: string|null 
							userId:uiidv4(),
							firstName: mentorUsername,
							lastName: "",
							username: mentorUsername, 
							password: password, 
							email: mentorEmail,
							phone: "",
							socialMedia: {}, 
							birthDate: new Date(), 
							userDetails: {
								"location":entry.team.teamDetails["location"]
							},
							role: "Mentor",
							avatarUu:"",
							lastLogin:new Date()
						});
						if(user) {
							const msg:string = "Hello " + user.firstName + " " + user.lastName +" ,\n\n" 
								+ "Here is your new account, please do not disclose these informations to anyone.\n" 
								+ "		Username: " +user.username + "\n"
								+ "		Password: " +password + "\n" 
								+ "Use these credidentials to login on "+ process.env.HOSTNAME +"\n\n"
								+ "Regards, Innovation Labs Team\n";
							const notification:SWNotify = {
								email:user.email,
								notifyType:NotificationType.EMAIL,
								msgType:MessageType.WELCOME,
								text:msg,
								date:new Date()
							}
							await daemon.addNotification(notification);
							entry.product.mentorId = user.userId;
						}
					}
					team = await teams.getTeamByYearAndLocation(entry.team.year, entry.team.location, entry.team.teamName);
					if(team === null) {
						team = await teams.addTeam(entry.team,entry.product);
					}
				}
				let user:User | null = null;
				if(entry.user) {
					user = await users.getUserByEmail(entry.user.email);
					if(user == null) {
						const password = admin.randomPassword();
						entry.user.password = password;
						const msg:string = "Hello " + entry.user.firstName + " " + entry.user.lastName +" ,\n\n" 
							+ "Here is your new account, please do not disclose these informations to anyone.\n" 
							+ "		Username: " +entry.user.username + "\n"
							+ "		Password: " +password + "\n" 
							+ "Use these credidentials to login on "+ process.env.HOSTNAME +"\n\n"
							+ "Regards, Innovation Labs Team\n";
						const notification:SWNotify = {
							email:entry.user.email,
							notifyType:NotificationType.EMAIL,
							msgType:MessageType.WELCOME,
							text:msg,
							date:new Date()
						}
						await daemon.addNotification(notification);
						if(entry.product)
							entry.product.mentorId = entry.user.userId;
						user = await users.addUser(entry.user);
					}
				}
				let userTeam:UserTeams | null = null;
				if(user && team)
					userTeam = await teams.getUserInTeam(user.userId,team.teamId);
				if(userTeam === null && user !== null && team !== null)
				{
					let role = user.role;
					let teamUser:UserTeams | null = null;
					if(user && team && role !== undefined && role !== null)
						teamUser = await teams.addUserToTeam(user, team, role);
					let initDate;
					if(team.teamDetails["location"] === "Bucharest"){
						initDate = moment("2021-03-02");
					} else {
						initDate = moment("2021-03-09");
					}
					for(let i = 0; i < 10; i++) {
						const aux = moment(initDate.toDate());
						const date = aux.add(7*i,"days").toDate();
						let userActivity:UserActivity;
						if(user !== null && teamUser !== null) {
							userActivity = {
								activityId:uiidv4(),
								userId:user.userId,
								teamId:teamUser.teamId,
								noOfHours:0,
								date:date,
								description:""
							}
							const response = await teams.addActivityForUser((userActivity as UserActivity));
							if(!response){
								console.error("Error on route \"/uploadCSV\" in \"admin\" router");
								console.error("No activity added NO RESPONSE");
								break;
							}
						} else {
							console.error("Error on route \"/uploadCSV\" in \"admin\" router");
							console.error("No activity added NO TEAM");
							break;
						}
					}
				}
			}
		}
		
		res.send(newObj);
	} catch (error) {
		console.error("Error on route \"/uploadCSV\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401, data:null});
	}
});

/**
 * Route on which a new user activity is added into the database
 */
router.post("/newUserActivity", async (req:ApiRequest<UserActivity[]>,res:ApiResponse<boolean>) => {
	try {
		/** @type {UserActivity[]} the user activity to be added */
		const userActivities:UserActivity[] = req.body;

		if(userActivities) {
			for(const activity of userActivities) {
				const response:UserActivity | null = await teams.addActivityForUser((activity as UserActivity));
				if(!response) {
					console.error("Error on route \"/newUserActivity\" in \"admin\" router");
					console.error("No user activity added!");
					res.status(401).send({err:401, data:false});
				}
			}
		} else {
			console.error("Error on route \"/newUserActivity\" in \"admin\" router");
			console.error("No user activity sent to be added!");
			res.status(401).send({err:401, data:false});
		}
	} catch (error) {
		console.error("Error on route \"/newUserActivity\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401, data:false});
	}
	res.status(200).send(true);
});

/**
 * 	Route on which information about users/uploads/teams is sent to be downloaded 
 */
router.post("/download/udc/data", async (req:ApiRequest<undefined>,res:ApiResponse<string | null>) => {
	try {
		const usersString = await admin.getUDCData();
		const array = [];
		for(const row of usersString) {
			array.push(row);
		}
		const csv = Papa.unparse(array);
		if(csv) {
			res.send(csv);
		} else {
			console.error("Error on route \"/download/udc/data\" in \"admin\" router");
			console.error("No csv unparsed!");
			res.status(401).send({err:401, data:null});
		}
	} catch (error) {
		console.error("Error on route \"/download/udc/data\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401, data:null});
	}
});

/**
 * 	Route on which information about specific teams is sent to be downloaded 
 */
router.post("/download/team/data", async (req:ApiRequest<undefined>,res:ApiResponse<string | null>) => {
	try {
		const usersString = await admin.getTeamData();
		const array = [];
		for(const row of usersString) {
			array.push(row);
		}
		const csv = Papa.unparse(array);
		if(csv) {
			res.send(csv);
		} else {
			console.error("Error on route \"/download/team/data\" in \"admin\" router");
			console.error("No csv unparsed!");
			res.status(401).send({err:401, data:null});
		}
	} catch (error) {
		console.error("Error on route \"/download/team/data\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401, data:null});
	}
});

/**
 * 	Route on which we get all the users from the database based on a specified location
 */
router.get("/users/:location", async (req:ApiRequest<undefined>,res:ApiResponse<(User & UserTeams)[]>) => {
	
	/** @type {(Team & Product)[]} array containing all the teams to be sent back to the frontend */
	let teamsArray:(Team & Product)[] = [];

	try {
		if(req.params.location === "all") {
			teamsArray = await teams.getTeams();
		} else {
			teamsArray = await teams.getTeamsByLocation(req.params.location);
		}
		const users:(User & UserTeams)[] = [];
		for(const team of teamsArray) {
			const auxUsers:(User & UserTeams)[] = await teams.getUsersByTeamId(team.teamId);
			users.push(...auxUsers);
		}

		if(users) {
			res.send(users);
		} else {
			console.error("Error on route \"/users/:" + req.params.location + "\" in \"admin\" router");
			console.error("Error no users!");
			res.status(401).send({err:401, data:[]});
		}
	} catch (error) {
		console.error("Error on route \"/users/:" + req.params.location + "\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401, data:[]});
	}
});

/**
 * 	Route on which we get all the users from the database
 */
router.get("/users", async (req:ApiRequest<undefined>,res:ApiResponse<(User & UserTeams)[]>) => {
	try {
		let teamsArray:Team[] = await teams.getTeams();
		const users:(User & UserTeams)[] = [];
		for(const team of teamsArray) {
			const auxUsers = await teams.getUsersByTeamId(team.teamId);
			users.push(...auxUsers);
		}
		if(users) {
			for(let user of users) {
				user.socialMedia = JSON.parse((user.socialMedia as any) as string);
				user.userDetails = JSON.parse((user.userDetails as any) as string);
			}
			res.send(users);
		} else {
			console.error("Error on route \"/users/\" in \"admin\" router");
			console.error("Error no users!");
			res.status(401).send({err:401, data:[]});
		}
	} catch (error) {
		console.error("Error on route \"/users/\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401, data:[]});
	}
});

/**
 * 	Route on which we get all the teams from the database based on a specified location 
 */
router.get("/teams/:location", async (req:ApiRequest<undefined>,res:ApiResponse<(Team & Product)[]>) => {
	try {
		let teamsArray:(Team & Product)[] = [];
		if(req.params.location === "all" || req.params.location === "undefined") {
			teamsArray = await teams.getTeams();
		} else {
			teamsArray = await teams.getTeamsByLocation(req.params.location);
		}
		for(let team of teamsArray) {
			team.productDetails = JSON.parse((team.productDetails as any) as string);
			team.teamDetails = JSON.parse((team.teamDetails as any) as string);
		}
		if(teamsArray) {
			res.send(teamsArray);
		} else {
			res.status(401).send({err:401, data:[]});
		}
	} catch (error) {
		console.error("Error on route \"/teams/:" + req.params.location + "\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401, data:[]});
	}
});

/**
 * 	Route on which we get all the teams from the database
 */
router.get("/teams", async (req:ApiRequest<undefined>,res:ApiResponse<Team[]>) => {
	try {
		const teamsArray:Team[] = await teams.getTeams();
		if(teamsArray) {
			res.send(teamsArray);
		} else {
			res.status(401).send({err:401, data:[]});
		}
	} catch (error) {
		console.error("Error on route \"/teams/\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401, data:[]});
	}
});

/**
 * 	Route on which we get all the team reviews based on the type of user requesting them
 */

router.post("/teams/review", async (req:ApiRequest<{type:string,location:string,id:string}>,res:ApiResponse<Review[]>) => {

	/** @type {string} - the type of user requesting the teams reviews */
	const type = req.body.type;
	
	/** @type {string} - the location of the requested teams */
	const location = req.body.location;

	try {
		let teamsArray:(Team & Product)[] =[];
		if(type === "admin") 
			teamsArray = await teams.getTeamsByLocation(location);
		else if(type === "mentor")
			teamsArray = await teams.getTeamAndProductByMentorId(req.body.id);
		else if(type === "superAdmin") {
			teamsArray = await teams.getTeams();
		}
		const reviews:Review[] = [];
		for (const team of teamsArray) {
			// as any because TODO parse json in backend
			const mentor:User | null = await users.getUserByEmail(JSON.parse(team.teamDetails as any)["mentor"]);
			const product = JSON.parse(team.productDetails as any);
			let review:Review;
			if(mentor && product) {
				let assesFinals = false;
				let assesSemifinals = false;
				if(product.assessment20May !== undefined) {
					assesFinals = product.assessment20May;
				}
				if(product.assessment12Oct !== undefined) {
					assesSemifinals = product.assessment12Oct;
				}
				review = {
					location:team.location,
					workshopNr:team.workshopDay,
					mentor:mentor.email,
					teamTrack:team.teamType,
					businessTrack:team.businessTrack,
					startupName:team.startupName,
					description:team.descriptionEN,
					webLink:product.website,
					teamId:team.teamId,
					mentorNotes:product.mentorNotes,
					adminNotes:product.adminNotes,
					assessment20May:assesFinals,
					assessment12Oct:assesSemifinals,
					updatedAt: admin.formatDate(team.updatedAt),
					lastMentorUpdate: admin.formatDate(team.lastMentorUpdate)
				}
				reviews.push(review);
			};
		}
		if(reviews) {
			reviews.sort((a:Review,b:Review) => {
				return a.startupName.localeCompare(b.startupName);
			})
			res.send(reviews);
		} else {
			console.error("Error on route \"/teams/review\" in \"admin\" router");
			console.error("Error, no reviews!");
			res.status(401).send({err:401, data:[]});
		}
	} catch (error) {
		console.error("Error on route \"/teams/review\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401, data:[]});
	}
});

/**
 * Route on which we request the update of selected reviews
 */
router.post("/teams/review/update", async (req:ApiRequest<{reviews:Review[],type:string}>,res:ApiResponse<Review[]>) => {
	/** @type {Review[]} - teams reviews array */
	const revRes = [];

	/** @type {Review[]} - reviews to be updated */
	const reviews:Review[] = req.body.reviews;

	/** @type {string} - type of user requesting the update*/
	const type:string = req.body.type;

	try {
		for (const review of reviews) {
			const product:(Product | null) = await teams.getProductByTeamId(review.teamId);
			const team:(Team | null) = await teams.getTeamById(review.teamId);
			if(product && team) {
				if(type && type === "mentor") {
					product.productDetails["mentorNotes"] = review.mentorNotes;
				} else if(type && type === "admin") {
					product.productDetails["adminNotes"] = review.adminNotes;
				}
				team.location=review.location;
				team.teamName=review.startupName;
				team.teamDetails = JSON.parse((team.teamDetails as any) as string);
				team.teamDetails["mentor"] = review.mentor;
	
				const newTeam = await teams.updateTeam(team);
				if(!newTeam) {
					console.error("Error on route \"/teams/review/update\" in \"admin\" router");
					console.error("Error, team not updated");
					res.status(401).send({err:401});
				}
				product.startupName = review.startupName;
				product.teamType = (review.teamTrack as TeamType);
				product.businessTrack = (review.businessTrack  as BusinessTrack);
				product.workshopDay = (review.workshopNr as WorkshopDay);
				product.descriptionEN = review.description;
				product.productDetails = JSON.parse((product.productDetails as any) as string);
				product.productDetails["website"] = review.webLink;
				product.productDetails["assessment20May"] = review.assessment20May;
				product.productDetails["assessment12Oct"] = review.assessment12Oct;
				product.lastMentorUpdate = new Date(review.lastMentorUpdate);
				product.updatedAt = new Date(review.updatedAt);
				const prodRes:(Product | null) = await teams.updateProduct(product);
				if(prodRes) {
					revRes.push(review);
				}
			}
		}
		if(revRes) {
			res.send(revRes);
		} else {
			console.error("Error on route \"/teams/review/update\" in \"admin\" router");
			console.error("Error, no reviews updated");
			res.status(401).send({err:401, data:[]});
		}
	} catch (error) {
		console.error("Error on route \"/teams/review/update\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401, data:[]});
	}
});

/**
 * Route on which we request the change of role for a selected user
 */
router.post("/changeRole", async (req:ApiRequest<{user:User,userTeam:UserTeams}>,res:ApiResponse<UserTeams | null>) => {
	
	/** @type {User} - the user of which role should be changed */
	const user:User = req.body.user;
	/** @type {UserTeams} - the user role datatype */
	const userTeam:UserTeams = req.body.userTeam;

	try {
		if(user) {
			await users.modifyUser(user);
			if(userTeam)
				await teams.updateUserTeamDetails(userTeam);
			else {
				console.error("Error on route \"/changeRole\" in \"admin\" router");
				console.error("Error, no userteam datatype");
				res.status(204).send(null);
			}
		} else {
			console.error("Error on route \"/changeRole\" in \"admin\" router");
			console.error("Error, no user to change role to");
			res.status(204).send(null);
		}
		res.status(200).send(userTeam);
	} catch (error) {
		console.error("Error on route \"/changeRole\" in \"admin\" router");
		console.error(error);
		res.status(500).send({err:500, data:null});
	}
	
});

/**
 * Route on which we request to add a new workshop into the database
 */
router.post("/add/workshop", async (req,res) => {
	const workshop = req.body.workshop;
	if(workshop) {
		//TODO
		res.send(workshop);
	} else {
		res.status(401).send({err:401});
	}
	res.status(201).send({});
});

/**
 * Route on which we request to add new workshop instances in the database
 */
router.post("/add/workshop/Instances", async (req,res) => {
	const instances = req.body.instances;
	
	if(instances) {
		//TODO
		res.send(instances);
	} else {
		res.status(401).send({err:401});
	}
	res.status(201).send({});
});

/**
 * Route on which we request to add new workshop instances in the database
 */
router.post("/request/user", async (req:ApiRequest<{from:string,email:string,firstName:string,lastName:string,teamId:string}>,res:ApiResponse<boolean>) => {
	const from = req.body.from;
	const email = req.body.email;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const teamId = req.body.teamId;
	const team = await teams.getTeamById(teamId);
	const product = await teams.getProductByTeamId(teamId);
	let mentor;
	if(product)
		mentor = await users.getUserById(product.mentorId);
	if(mentor && team) {
		const msg:string = "		From:" + from + "\n" 
			+ "		First Name: " +firstName + "\n"
			+ "		Last Name: " +lastName + "\n" 
			+ "		Email: " + email + "\n"
			+ "		Team: " + team.teamName + "\n" 
			+ "		Location: " + team.location + "\n"
			+ "		Mentor: " + mentor.email + "\n"
		const notification:SWNotify = {
			email:"marius.andrei.aluculesei@gmail.com",
			notifyType:NotificationType.EMAIL,
			msgType:MessageType.REQUESTUSER,
			text:msg,
			date:new Date()
		}
		await daemon.addNotification(notification);
		res.status(200).send(true);
	} else {
		res.status(400).send(false);
	}
});
router.post("/add/user", async (req:ApiRequest<{user:User,option:string,teamId:string}>,res:ApiResponse<boolean>) => {
	try {
		const user = req.body.user;
		const option = req.body.option;
		user.password = admin.randomPassword();
		const msg:string = "Hello " + user.firstName + " " + user.lastName +" ,\n\n" 
			+ "Here is your new account, please do not disclose these informations to anyone.\n" 
			+ "		Username: " +user.username + "\n"
			+ "		Password: " +user.password + "\n" 
			+ "Use these credidentials to login on "+ process.env.HOSTNAME +"\n\n"
			+ "Regards, Innovation Labs Team\n" 
		const notification:SWNotify = {
			email:user.email,
			notifyType:NotificationType.EMAIL,
			msgType:MessageType.WELCOME,
			text:msg,
			date:new Date()
		}
		await daemon.addNotification(notification);
		if(user) {
			let newUser = await users.addUser((user as User));
			if(newUser) {
				if(option === "team") {
					const teamId = req.body.teamId;
					const team = await teams.getTeamById(teamId);
					let userTeam;
					if(team) {
						userTeam = await teams.getUserInTeam(newUser.userId,team.teamId);
					}	
					if(userTeam)
					{
						let role = newUser.role;
						if(team) {
							let initDate;
							const teamUser = await teams.addUserToTeam(newUser, team,role);
							if(teamUser) {
								if(team.teamDetails["location"] === "Bucharest"){
									initDate = moment("2020-03-02");
								} else {
									initDate = moment("2020-03-09");
								}
								for(let i = 0; i < 10; i++) {
									const aux = moment(initDate.toDate());
									const date = aux.add(7*i,"days").toDate();
									const userActivity = {
										userId:newUser.userId,
										teamId:teamUser.teamId,
										noOfHours:0,
										date:date,
										description:""
									}
									await teams.addActivityForUser((userActivity as UserActivity));
								}
							}
						}
						
					}
				}
				res.status(200).send(true);
			} else {
				res.status(401).send({err:401,data:false});
			}
		} else {
			res.status(401).send({err:401,data:false});
		}
		res.status(201).send(false);
	} catch (error) {
		console.error(error);
		res.status(500).send({err:500,data:false});
	}
});
router.post("/update/user", async (req:ApiRequest<{user:User,changedPass:boolean}>,res:ApiResponse<boolean>) => {
	const user = req.body.user;
	const changedPass = req.body.changedPass;
	if(changedPass) {
		const msg:string = "Hello " + user.firstName + " " + user.lastName +" ,\n\n" 
			+ "Here is your new password, please do not disclose these informations to anyone.\n" 
			+ "		Username: " +user.username + "\n"
			+ "		Password: " +user.password + "\n" 
			+ "Use these credidentials to login on "+ process.env.HOSTNAME +"\n\n"
			+ "Regards, Innovation Labs Team\n"
		const notification:SWNotify = {
			email:user.email,
			notifyType:NotificationType.EMAIL,
			msgType:MessageType.WELCOME,
			text:msg,
			date:new Date()
		}
		await daemon.addNotification(notification);
		user.password = UsersServer.passwordGenerator(user.password);
	}
	
	if(user) {
		let resp = await users.modifyUser(user);
		if(resp) {
			res.status(200).send(true);
		} else {
			res.status(401).send({err:401,data:false});
		}
	} else {
		res.status(401).send({err:401,data:false});
	}
	res.status(201).send(true);
});
router.post("/delete/user", async (req:ApiRequest<{user:User}>,res:ApiResponse<boolean>) => {
	const user = req.body.user;
	if(user) {
		//TODO
		res.send(true);
	} else {
		res.status(401).send({err:401, data:false});
	}
	res.status(201).send(true);
});
router.post("/request/user/team", async(req:ApiRequest<{user:User,team:Team}>,res:ApiResponse<undefined>) => {
	const user = req.body.user;
	const team = req.body.team;
	if(user && team) {
		const userTeam = await teams.getUserInTeam(user.userId,team.teamId);	
		if(userTeam)
		{
			let role = user.role
			const teamUser = await teams.addUserToTeam(user, team,role);
			if(teamUser) {
				let initDate;
		
				if(team.teamDetails["location"] === "Bucharest"){
					initDate = moment("2020-03-02");
				} else {
					initDate = moment("2020-03-09");
				}
				for(let i = 0; i < 10; i++) {
					const aux = moment(initDate.toDate());
					const date = aux.add(7*i,"days").toDate();
					const userActivity = {
						userId:user.userId,
						teamId:teamUser.teamId,
						noOfHours:0,
						date:date,
						description:""
					}
					await teams.addActivityForUser((userActivity as UserActivity));
				}
			}
		}
	}
});

const server = Server.getInstance ();
server.registerRouterAPI (1, router, "/admin");