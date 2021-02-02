import { Transporter, createTransport, SendMailOptions} from "nodemailer";
import AWS from "aws-sdk"
import { Recovery, Review } from "../common";
import * as _ from "lodash";
import * as Papa from "papaparse";
import moment from "moment";
import randomstring from "randomstring";

import { Router } from "express";
import { Server, ApiResponse, ApiRequest } from "@startupway/main/lib/server";
import { getPool } from "@startupway/database/lib/server";
import { QueryOptions, Connection } from "mariadb";
import { getAuthorizationFunction, User, UsersServer } from "@startupway/users/lib/server";
import { UserActivity, UserTeams, BusinessTrack, Team, Product, TeamType, WorkshopDay, TeamsServer } from "@startupway/teams/lib/server";
const users = UsersServer.getInstance();
const teams = TeamsServer.getInstance();
export class AdminServer {

	private static INSTANCE?: AdminServer;
	private conn: Connection;
	private users: UsersServer = users;
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
	 * @param shortDesc - team short description
	 * @param birthDate - user birthdate
	 * @param faculty - user faculty
	 * @param group - user group at faculty
	 * @param findProgram - shot description on how the user found the program
	 * @returns { teamId:number, workshop:WorkshopObj, team:{}, product:{}, user:{} } parsedCSV | null - contains all the info about the user and it's asociated team and product
	 */
	public parseCSVData(loc?:string ,workshopNo?:string ,teamMentor?:string ,teamId?:string ,teamTrack?:string ,businessTrack?:string ,teamName?:string ,pitcher?:string ,
		role?:string ,firstName?:string ,lastName?:string , email?:string ,phone?:string ,facebook?:string ,linkedin?:string ,
		shortDesc?:string ,birthDate?:string ,faculty?:string ,group?:string ,findProgram?:string ):{ teamId:string| undefined, team:{}, product:{}, user:{} }
	{
		try {
			if(teamMentor === undefined || firstName === undefined || lastName === undefined || email === undefined)
				return (null as any);
			const parsedCSV = {
				teamId:teamId,
				workshop:{},
				team:{},
				product:{},
				user:{}
			}
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
			parsedCSV.team = {
				teamName:(teamName as string),
				location:loc,
				year:new Date().getFullYear(),
				teamDetails:{
					"mentor":teamMentor,
					"pitcher":pitcher
				},
			}
			let bT = "";
			if(businessTrack !== undefined) {
				bT = (businessTrack as string).toUpperCase().replace(/\s+/g, '');
			}
			let tT = "";
			if(teamTrack !== undefined) {
				tT = (teamTrack as string).split("-")[0].toUpperCase();
			}
			parsedCSV.product = {
				startupName:(teamName as string),
				mentorId:0,
				businessTrack:(BusinessTrack as any)[bT],
				teamType:(TeamType as any)[tT],
				workshopDay:(WorkshopDay as any)[days[parseInt(workshopNo as string)]],
				descriptionEN:(shortDesc as string),
				descriptionRO:"", 
				pendingDescriptionEN: "",
				pendingDescriptionRO: "",
				productDetails: {
					website: "",
					linkedin: "",
					facebook: "",
					mentorNotes: "",
					adminNotes: "",
					assesment20May: "",
					assesment12Oct: ""
				},
				updatedAt:"",
				lastMentorUpdate:"",
			}

			let username = "";
			if(email !== undefined)
				username = (email as string).split("@")[0].toLowerCase();
			let aux = new Date().toISOString().split('T')[0];
			try {
				if(birthDate !== undefined)
					aux = new Date((birthDate as string)).toISOString().split('T')[0];
			} catch (e) {
				console.error(e);
			}
			parsedCSV.user = {
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
				role:{
					[(role as string)]:true
				},
				avatarUu:"",
				lastLogin:""
			}
			return parsedCSV;
		} catch (error) {
			console.error("Error in function \"_parseCSVData(...array of params)\"|\"admin\" ")
			console.error(error);
			return (null as any);
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
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				nestTables:"_",
				sql:"SELECT IF(JSON_EXTRACT(productDetails,'$.assessment20May') = \"Yes\",\"DA\",\ Echipa,JSON_EXTRACT(t.teamDetails,'$.mentor') as Mentor,IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"pres\")>0,\"DA\",\"NU\") as 'Au prezentare pptx incarcata?',IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"image\")>0,(SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"image\"),0) as 'Au poze la \"Product Images\"?',IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"demoVid\")>0,\"DA\",\"NU\") as 'Au \"Tehnic Demo Video\" incarcat?', IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"presVid\")>0,\"DA\",\"NU\") as 'Au \"Product Presentation Video\" incarcat?',IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"logo\")>0,\"DA\",\"NU\") as 'Au \"Logo\" incarcat?',IF((JSON_EXTRACT(p.productDetails,'$.website')=''),'NU','DA') as 'Au link catre pagina web a produsului?',IF((JSON_EXTRACT(p.productDetails,'$.facebook')=''),'NU','DA') as 'Au link catre pagina de facebook a produsului?',DATE_FORMAT(p.lastMentorUpdate, \"%d %M %Y\") as \"Ultima actualizare a descrierii RO\",DATE_FORMAT(p.lastMentorUpdate, \"%d %M %Y\") as \"Ultima actualizare a descrierii ENG\",CONCAT((SELECT count(*) from (SELECT u.avatarUu, t1.teamId,IF(u.avatarUu!='',\"Yes\",\"No\") as has from users u inner join userTeams uT on u.userId = uT.userId inner join teams t1 on t1.teamId = uT.teamId ) as t2 where t2.teamId = t.teamId and t2.has =\"Yes\" ),'|',(SELECT count(*) from (SELECT u.avatarUu, t1.teamId, IF(u.avatarUu!='',\"Yes\",\"No\") as has from users u inner join userTeams uT on u.userId = uT.userId inner join teams t1 on t1.teamId = uT.teamId ) as t2 where t2.teamId = t.teamId)) as \"Au toti membrii echipei poza incarcata?\", IFNULL(DATE_FORMAT(tab.date, '%d %M %Y'),'') as \"Ultima actualizare a Lean Model Canvas\",DATE_FORMAT(p.updatedAt, \"%d %M %Y\") as \"Ultima actualizare\" from teams t inner join products p on t.productId = p.productId and JSON_EXTRACT(productDetails,'$.assessment20May') = \"Yes\" left join (SELECT date, productId from bModelCanvas group by productId) as tab on p.productId = tab.productId;"
			}
			const response = await this.conn.query(queryOptions);
			if(response)
				return response;
			else
				return [];
		} catch (e) {
			console.log("Error in function \"getUDCData()\"|\"admin\"")
			console.error(e);
			return [];
		}
	}
	
	/**
	 * Function that extract information from the database about all teams and their descriptions 
	 * @returns {Promise<any[]>} an array of informations about each team
	 */
	async getTeamData():Promise<any[]> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql:"SELECT t.location as 'oras', t.teamName as 'nume_echipa', p.businessTrack as 'business_track', p.teamType as 'teams_type', p.descriptionRO as 'descriere_RO', p.descriptionEN as 'descriere_ENG' from teams t inner join products p on p.productId = t.productId and JSON_EXTRACT(productDetails,'$.assessment20May') = 'Yes';"

			}
			const response = await this.conn.query(queryOptions);
			if(response)
				return response;
			else 
				return [];
		} catch (e) {
			console.log("Error in function \"getTeamData()\"|\"admin\"")
			console.error(e);
			return [];
		}
	}
	
	/**
	 * Function that creates an AWS.SES mail transport used to automatically send emails
	 * @returns {Transporter} an AWS.SES transporter
	 */
	createMailTransporter():Transporter | null {
		try {
			AWS.config.update({
				region: process.env.REGION, 
				accessKeyId: process.env.AKEY, 
				secretAccessKey: process.env.ASECRETKEY
			});
			const transporter = createTransport({
				SES: new AWS.SES({
					apiVersion: '2010-12-01'
				}),
				sendingRate: 10
			});
			return transporter
		} catch (error) {
			console.log("Error in function \"createMailTransporter()\"|\"admin\"");
			console.error(error);
			return null;
		}
	}
	
	/**
	 * Function that sends a mail via the AWS.SES transporter 
	 * @param transporter the AWS.SES transporter object
	 * @param mailOptions an instance of type SendMailOptions in which information about where to send the email is found
	 * @returns {boolean} true if mail was sent, false otherwise
	 */
	sendMail(transporter:Transporter,mailOptions:SendMailOptions):boolean {
		try {
			let response = {};
			transporter.sendMail(mailOptions, function(error:any, info:any){
				if (error) {
					console.log("Error in function \"sendMail(transporter, mailOptions)\"|\"admin\"");
					console.error(error);
				} else {
					console.log('Email sent: ' + info.response);
					response = info.response;
				}
			});
			if(response !== {})
				return true;
			else
				return false;
		} catch (error) {
			console.log("Error in function \"sendMail(transporter, mailOptions)\"|\"admin\"");
			console.error(error);
			return false;
		}
	}
	
	/**
	 * Function that creates an object of type SendMailOptions for the AWS.SES transporter
	 * @param from - sending email address
	 * @param to - receiving email address
	 * @param subject - subject of email
	 * @param text - email text
	 * @returns {SendMailOptions} - the mail options
	 */
	createMailOptions(from:string,to:string,subject:string,text:string):SendMailOptions {
		const mailOptions:SendMailOptions = {
			from:from,
			to:to,
			subject:subject,
			text:text
		}
		return mailOptions
	}

	/**
	 * Function that adds a recovery object containing the information about a users password recovery into the database
	 * @param recovery - object that contains information about the incoming recovery of password request
	 * @returns {Promise<Recovery>} - a recovery object
	 */
	async addRecovery(recovery: Recovery):Promise<Recovery> {
		try {
			recovery.recoveryLink = this._randomRecoveryGenerator();
			const user = await this.users.getUserByEmail(recovery.email);
			if(user)
				recovery.userId = user.userId;
			else throw new Error("No such user");
			
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql:"INSERT INTO recoveries (userId,email,recoveryLink) VALUES(:userId,:email,:recoveryLink)"
			}
			await this.conn.query(queryOptions,recovery);
			queryOptions.sql="SELECT LAST_INSERT_ID()";
			const id:{"LAST_INSERT_ID()":number}[] = await this.conn.query(queryOptions);
			queryOptions.sql="SELECT * FROM recoveries WHERE recoveries.recoveryId=:id"
			const newRecovery:Recovery[] = await this.conn.query(queryOptions,{id:id[0]["LAST_INSERT_ID()"]});
			if(newRecovery[0]) {
				// const options = admin.createMailOptions(
				// 	(process.env.MAIL_USER as string),
				// 	user.email,
				// 	"Innovation Labs Platform Password Reset",
				// 	"Hello " + user.firstName + " " + user.lastName +" ,\n\n" 
				// 	+ "Here is your activation link, please click here to reset your password.\n" 
				// 	+ "		https://teams.innovationlabs.ro/#/recovery/"+newRecovery[0].recoveryLink + "\n"
				// 	+ "Regards, Innovation Labs Team\n" 
				// );
				// const transporter = admin.createMailTransporter();
				// if(transporter)
				// 	admin.sendMail(transporter,options);
				return newRecovery[0];
			}
			else throw new Error("Can't add recovery")
		} catch (error) {
			console.log("Error in function \"addRecovery(recovery)\"|\"admin\"");
			console.error(error);
			return {recoveryId:0} as Recovery
		}
	}

	
	/**
	 * Function that deletes a recovery object from the databse
	 * @param recoveryId - unique indentifier to find the specified recovery in the database
	 */
	async deleteRecovery(recoveryId:number):Promise<boolean> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql:"DELETE FROM recoveries WHERE recoveryId=:recoveryId"
			}
			await this.conn.query(queryOptions,{recoveryId});
			return true;
		} catch (error) {
			console.log("Error in function \"deleteRecovery(recoveryId)\"|\"admin\"");
			console.error(error);
			return false;
		}
	}

	/**
	 * Function that finds a recovery object in the database based on it's unique id
	 * @param id - unique identifier to find the recovery object in the database
	 * @returns {Promise<Recovery>} a recovery object
	 */
	async findRecoveryById(recoveryId:number):Promise<Recovery | null> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql:"SELECT * FROM recoveries WHERE recoveryId=:recoveryId"
			}
			const recovery:Recovery[] = await this.conn.query(queryOptions,{recoveryId});
			if (recovery[0])
				return recovery[0];
			else
				return null;
		} catch (error) {
			console.log("Error in function \"findRecoveryById(id)\"|\"admin\"");
			console.error(error);
			return null;
		}
	}

	/**
	 * Function that finds a recovery object in the databse based on it's unique recoveryLink
	 * @param recoveryLink - unique recovery link that can be only once in the database
	 * @returns {Promise<Recovery>} a recovery object
	 */
	async findRecoveryByToken(recoveryLink:string):Promise<Recovery | null> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql:"SELECT * FROM recoveries WHERE recoveryLink=:recoveryLink"
			}
			const recovery:Recovery[] = await this.conn.query(queryOptions,{recoveryLink});
			if (recovery[0])
				return recovery[0];
			else
				return null;
		} catch (error) {
			console.log("Error in function \"findRecoveryByToken(recoveryLink)\"|\"admin\"");
			console.error(error);
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
router.post("/createResetEmail", async (req:ApiRequest<{email:string}>,res:ApiResponse<Recovery>) => {
	try {
		/** @type {string} Email destination string */
		const email = req.body.email;
		const aux:Recovery = {
			recoveryId:(null as any),
			userId:(null as any),
			email:email,
			recoveryLink:"",
		};
		/** @type {Recovery} Recovery object */
		const recovery:Recovery = await admin.addRecovery(aux);
		if(recovery) {
			res.send(recovery);	
		} else {
			res.status(401).send({err:401});
		}
		res.status(201).send({});
	} catch (error) {
		console.error("Error on route \"/createResetEmail\" in \"admin\" router");
		console.error(error);	
		res.status(500).send({err:500});
	}
});

/**
 * Route on which the reset of a user's password is being done
 * Can be accessed only by the unique token generated in the email
 * 
 */
router.post("/resetPassword", async (req:ApiRequest<{token:string,password:string}>,res:ApiResponse<{username:string}>) => {
	
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
				res.status(401).send({err:401});
			}
		} else {
			res.status(401).send({err:401});
		}	
	} catch (error) {
		console.error("Error on route \"/resetPassword\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401});
	}
	
});

/**
 * Route on which the generated token is beign verified to actually exist
 */
router.post("/checkToken", async(req:ApiRequest<{token:string}>,res:ApiResponse<{matched:boolean}>) => {

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
		res.status(401).send({err:401});
	}
});

/**
 * Route on which a recovery is deleted based on it's unique token
 */
router.post("/deleteRecovery", async(req:ApiRequest<{token:string}>,res:ApiResponse<{}>) => {

	/** @type {string} unique token */
	const token = req.body.token;
	try {
		const recovery:Recovery | null = await admin.findRecoveryByToken(token);
		if(recovery) {
			await admin.deleteRecovery(recovery.recoveryId);
			res.status(200);
		} else {
			res.status(401);
		}
	} catch (error) {
		console.error("Error on route \"/deleteRecovery\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401});
	}
});

/**
 * Create a private router for the admin plugin
 */
const authFunct = getAuthorizationFunction();
if(authFunct)
	router.use((authFunct as any));



/**
 * Route on which information found in a .csv file is being uploaded into the database 
 */
router.post("/uploadCSV", async(req:ApiRequest<{encoded:string,buffer:Buffer,string:string,parsed:unknown}>,res:ApiResponse<{}>) => {
	try {

		/** @type {string} base64 string of the data found in the .csv */
		const encoded = req.body.encoded;
		
		/** @type {Buffer} Buffer with the data retrieved from the base64 string */
		const buffer = Buffer.from(encoded,"base64");
		
		/** @type {string} string in utf8 format of the data */
		const string  = buffer.toString("utf-8");
		
		/** @type {unknown} array with entries represented by each line of data in the .csv file */
		const parsed = Papa.parse(string).data;

		parsed.splice(0,1);
		
		const obj:object[] = [];
		for(const arr of parsed) {
			const object = admin.parseCSVData(...(arr as any));
			if(object !== null)
				obj.push(object)
		}
		const newObj = _.groupBy(obj,"teamId");
		for(const key in newObj) {
			for(const entry of (newObj[key] as any[])) {
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
						role: {
							"Mentor":true
						},
						avatarUu:"",
						lastLogin:""
					} as any);
					if(user) {
						// const options = admin.createMailOptions(
						// 	(process.env.MAIL_USER as string),
						// 	user.email,
						// 	"Innovation Labs Platform Password",
						// 	"Hello " + user.firstName + " " + user.lastName +" ,\n\n" 
						// 	+ "Here is your new account, please do not disclose these informations to anyone.\n" 
						// 	+ "		Username: " +user.username + "\n"
						// 	+ "		Password: " +password + "\n" 
						// 	+ "Use these credidentials to login on "+ process.env.HOSTNAME +"\n\n"
						// 	+ "Regards, Innovation Labs Team\n" 
						// );
						// const transporter = admin.createMailTransporter();
						// if(transporter)
						// 	admin.sendMail(transporter,options);
						entry.product.mentorId = user.userId;
					}
				}
				let team = await teams.getTeamByYearAndLocation(entry.team.year, entry.team.location, entry.team.teamName);
				if(!team) {
					team = await teams.addTeam(entry.team,entry.product);
				}

				let user = await users.getUserByEmail(entry.user.email);
				if(!user) {
					const password = admin.randomPassword();
					entry.user.password = password;
					// const options = admin.createMailOptions(
					// 	(process.env.MAIL_USER as string),
					// 	entry.user.email,
					// 	"Innovation Labs Platform Password",
					// 	"Hello " + entry.user.firstName + " " + entry.user.lastName +" ,\n\n" 
					// 	+ "Here is your new account, please do not disclose these informations to anyone.\n" 
					// 	+ "		Username: " +entry.user.username + "\n"
					// 	+ "		Password: " +password + "\n" 
					// 	+ "Use these credidentials to login on "+ process.env.HOSTNAME +"\n\n"
					// 	+ "Regards, Innovation Labs Team\n" 
					// );
					// const transporter = admin.createMailTransporter()
					// if(transporter)
					// 	admin.sendMail(transporter,options);
					// entry.product.mentorId = user.userId;
					user = await users.addUser(entry.user);
				}
				let userTeam;
				if(user && team)
					userTeam = await teams.getUserInTeam(user.userId,team.teamId);
				if(!userTeam && user)
				{
					let role = "";
					for(const x in user.role) {
						role = x;
					}
					let teamUser;
					if(user && team && role)
						teamUser = await teams.addUserToTeam(user, team, role);
					let initDate;
					if(entry.team.teamDetails["location"] === "Bucharest"){
						initDate = moment("2020-03-02");
					} else {
						initDate = moment("2020-03-09");
					}
					for(let i = 0; i < 10; i++) {
						const aux = moment(initDate.toDate());
						const date = aux.add(7*i,"days").toDate();
						let userActivity;
						if(user && teamUser)
							userActivity = {
								userId:user.userId,
								teamId:teamUser.teamId,
								noOfHours:0,
								date:date,
								description:""
							}
						const response = await teams.addActivityForUser((userActivity as UserActivity));
						if(!response){
							console.error("Error on route \"/uploadCSV\" in \"admin\" router");
							console.error("No activity added")
							res.status(401).send({err:401});
						}
					}
				}
			}
		}
		
		res.send(newObj);
	} catch (error) {
		console.error("Error on route \"/uploadCSV\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401});
	}
});

/**
 * Route on which a new user activity is added into the database
 */
router.post("/newUserActivity", async (req:ApiRequest<UserActivity[]>,res:ApiResponse<Boolean>) => {
	try {
		/** @type {UserActivity[]} the user activity to be added */
		const userActivities:UserActivity[] = req.body;

		if(userActivities) {
			for(const activity of userActivities) {
				const response:UserActivity | null = await teams.addActivityForUser((activity as UserActivity));
				if(!response) {
					console.error("Error on route \"/newUserActivity\" in \"admin\" router");
					console.error("No user activity added!");
					res.status(401).send({err:401});
				}
			}
		} else {
			console.error("Error on route \"/newUserActivity\" in \"admin\" router");
			console.error("No user activity sent to be added!");
			res.status(401).send({err:401});
		}
	} catch (error) {
		console.error("Error on route \"/newUserActivity\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401});
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
			const auxUsers:(User & UserTeams)[] = await teams.getUsersByTeamId((team as any).teams_teamId);
			users.push(...auxUsers);
		}

		if(users) {
			res.send(users);
		} else {
			console.error("Error on route \"/users/:" + req.params.location + "\" in \"admin\" router");
			console.error("Error no users!");
			res.status(401).send({err:401});
		}
	} catch (error) {
		console.error("Error on route \"/users/:" + req.params.location + "\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401});
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
			const auxUsers = await teams.getUsersByTeamId((team as any).teams_teamId);
			users.push(...auxUsers);
		}
		if(users) {
			res.send(users);
		} else {
			console.error("Error on route \"/users/\" in \"admin\" router");
			console.error("Error no users!");
			res.status(401).send({err:401});
		}
	} catch (error) {
		console.error("Error on route \"/users/\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401});
	}
});

/**
 * 	Route on which we get all the teams from the database based on a specified location 
 */
router.get("/teams/:location", async (req:ApiRequest<undefined>,res:ApiResponse<(Team & Product)[]>) => {
	try {
		let teamsArray:(Team & Product)[] = [];
		if(req.params.location === "all") {
			teamsArray = await teams.getTeams();
		} else {
			teamsArray = await teams.getTeamsByLocation(req.params.location);
		}
		if(teamsArray) {
			res.send(teamsArray);
		} else {
			res.status(401).send({err:401});
		}
	} catch (error) {
		console.error("Error on route \"/teams/:" + req.params.location + "\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401});
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
			res.status(401).send({err:401});
		}
	} catch (error) {
		console.error("Error on route \"/teams/\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401});
	}
});

/**
 * 	Route on which we get all the team reviews based on the type of user requesting them
 */

router.post("/teams/review", async (req:ApiRequest<{type:string,location:string,id:number}>,res:ApiResponse<Review[]>) => {

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
		console.log(type);
		console.log(teamsArray);
		for (const team of teamsArray) {
			const mentor:User | null = await users.getUserByEmail(JSON.parse((team as any).teams_teamDetails)["mentor"]);
			const product = JSON.parse((team as any).products_productDetails);
			let review:Review;
			if(mentor && product) {
				let asses20May = "";
				let asses12Oct = "";
				if(product.assessment20May !== undefined) {
					asses20May = product.assessment20May;
				}
				if(product.assessment12Oct !== undefined) {
					asses12Oct = product.assessment12Oct;
				}
				review = {
					location:(team as any).teams_location,
					workshopNr:(team as any).products_workshopDay,
					mentor:mentor.email,
					teamTrack:(team as any).products_teamType,
					businessTrack:(team as any).products_businessTrack,
					startupName:(team as any).products_startupName,
					description:(team as any).products_descriptionEN,
					webLink:product.website,
					teamId:(team as any).teams_teamId,
					mentorNotes:product.mentorNotes,
					adminNotes:product.adminNotes,
					assessment20May:asses20May,
					assessment12Oct:asses12Oct,
					updatedAt: admin.formatDate((team as any).products_updatedAt),
					lastMentorUpdate: admin.formatDate((team as any).products_lastMentorUpdate)
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
			res.status(401).send({err:401});
		}
	} catch (error) {
		console.error("Error on route \"/teams/review\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401});
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
				team.teamDetails["mentor"] = review.mentor;
	
				const newTeam = await teams.modifyTeam(team);
				if(newTeam) {
					console.error("Error on route \"/teams/review/update\" in \"admin\" router");
					console.error("Error, team not updated");
					res.status(401).send({err:401});
				}
				product.startupName = review.startupName;
				product.teamType = (review.teamTrack as TeamType);
				product.businessTrack = (review.businessTrack  as BusinessTrack);
				product.workshopDay = (review.workshopNr as WorkshopDay);
				product.descriptionEN = review.description;
				product.productDetails["website"] = review.webLink;
				product.productDetails["assessment20May"] = review.assessment20May;
				product.productDetails["assessment12Oct"] = review.assessment12Oct;
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
			res.status(401).send({err:401});
		}
	} catch (error) {
		console.error("Error on route \"/teams/review/update\" in \"admin\" router");
		console.error(error);
		res.status(401).send({err:401});
	}
});

/**
 * Route on which we request the change of role for a selected user
 */
router.post("/changeRole", async (req:ApiRequest<{user:User,userTeam:UserTeams}>,res:ApiResponse<UserTeams>) => {
	
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
				res.status(204).send({});
			}
		} else {
			console.error("Error on route \"/changeRole\" in \"admin\" router");
			console.error("Error, no user to change role to");
			res.status(204).send({});
		}
		res.status(200).send(userTeam);
	} catch (error) {
		console.error("Error on route \"/changeRole\" in \"admin\" router");
		console.error(error);
		res.status(500).send({err:500});
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
router.post("/request/user", async (req:ApiRequest<{from:string,email:string,firstName:string,lastName:string,teamId:number}>,res:ApiResponse<boolean>) => {
	// const from = req.body.from;
	// const email = req.body.email;
	// const firstName = req.body.firstName;
	// const lastName = req.body.lastName;
	const teamId = req.body.teamId;
	const team = await teams.getTeamById(teamId);
	const product = await teams.getProductByTeamId(teamId);
	let mentor;
	if(product)
		mentor = await users.getUserById(product.mentorId);
	if(mentor && team) {
		// const options = admin.createMailOptions(
		// 	(process.env.MAIL_USER as string),
		// 	"marius.andrei.aluculesei@gmail.com",
		// 	"Innovation Labs User Request",
		// 		"		From:" + from + "\n" 
		// 	+ "		First Name: " +firstName + "\n"
		// 	+ "		Last Name: " +lastName + "\n" 
		// 	+ "		Email: " + email + "\n"
		// 	+ "		Team: " + team.teamName + "\n" 
		// 	+ "		Location: " + team.location + "\n"
		// 	+ "		Mentor: " + mentor.email + "\n"
			
		// );
		// const transporter = admin.createMailTransporter();
		// if(transporter)
		// 	admin.sendMail(transporter,options);
		res.status(200).send(true);
	} else {
		res.status(400).send(false);
	}
});
router.post("/add/user", async (req:ApiRequest<{user:User,option:string,teamId:number}>,res:ApiResponse<boolean>) => {
	const user = req.body.user;
	const option = req.body.option;
	user.password = admin.randomPassword();
	// const options = admin.createMailOptions(
	// 	(process.env.MAIL_USER as string),
	// 	user.email,
	// 	"Innovation Labs Platform Password",
	// 	"Hello " + user.firstName + " " + user.lastName +" ,\n\n" 
	// 	+ "Here is your new account, please do not disclose these informations to anyone.\n" 
	// 	+ "		Username: " +user.username + "\n"
	// 	+ "		Password: " +user.password + "\n" 
	// 	+ "Use these credidentials to login on "+ process.env.HOSTNAME +"\n\n"
	// 	+ "Regards, Innovation Labs Team\n" 
	// );
	// const transporter = admin.createMailTransporter();
	// if(transporter)
	// 	admin.sendMail(transporter,options);
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
					let role = "";
					for(const x in newUser.role) {
						role = x;
					}
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
			res.status(401).send({data:false,err:401});
		}
	} else {
		res.status(401).send({data:false,err:401});
	}
	res.status(201).send(false);
});
router.post("/update/user", async (req:ApiRequest<{user:User,changedPass:boolean}>,res:ApiResponse<boolean>) => {
	const user = req.body.user;
	const changedPass = req.body.changedPass;
	if(changedPass) {
		user.password = UsersServer.passwordGenerator(user.password);
		// const options = admin.createMailOptions(
		// 	(process.env.MAIL_USER as string),
		// 	user.email,
		// 	"Innovation Labs Platform Password",
		// 	"Hello " + user.firstName + " " + user.lastName +" ,\n\n" 
		// 	+ "Here is your new password, please do not disclose these informations to anyone.\n" 
		// 	+ "		Username: " +user.username + "\n"
		// 	+ "		Password: " +user.password + "\n" 
		// 	+ "Use these credidentials to login on "+ process.env.HOSTNAME +"\n\n"
		// 	+ "Regards, Innovation Labs Team\n" 
		// );
		// const transporter = admin.createMailTransporter();
		// if(transporter)
		// 	admin.sendMail(transporter,options);
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
			let role = "";
			for(const x in user.role) {
				role = x;
			}
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