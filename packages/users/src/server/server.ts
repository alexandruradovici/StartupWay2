
import { Session, NO_SESSION, User, NO_USER, NO_TOKEN } from '../common/common';
import { Server } from "@startupway/main/lib/server";
import { DatabaseServer } from '@startupway/database/lib/server';
import express from "express";
import { createHash } from 'crypto';
import { generate } from 'randomstring';
export class UsersServer {

	private static INSTANCE?: UsersServer;
	private static dbserver: DatabaseServer = DatabaseServer.getInstance();
    
	_passwordGenerator (password: string): string {
		const hash = createHash('sha256');
		hash.update(password);
		return hash.digest('hex');
	}

	async addUser(user: User): Promise<User> {
		try {
			user.password = this._passwordGenerator (user.password);
	
			//TODO SEE IF YOU CAN REPLACE WITH FOR (Object.entries -> split in two arrays -> push both as values and columns)
			let response = await UsersServer.dbserver.insert(
				"users",
				[user.firstName, user.lastName, user.username, user.password, user.email, user.phone, user.birthDate, user.avatarUu, user.socialMedia, user.userDetails, user.role, user.lastLogin],
				["firstName","lastName","username","password","email","phone","birthDate","avatarUu","socialMedia","userDetails","role","lastLogin"]
			);
			if(response) {
				let newUser = await this.getUserByUsername(user.username);
				if(newUser)
					return newUser;
				else
					return NO_USER;
			} else {
				return NO_USER;
			}
		} catch (error) {
			console.error(error);
			return NO_USER;
		}
	}
	
	async getAllUserTeams(): Promise<any[]> {
		try {
			let onCondition:string= "users.userId!=userTeams.userId";
			let allUserTeams = <any[]> await UsersServer.dbserver.selectInnerJoin(["*"],["teamId","role"],"users","userTeams",onCondition);
			if(allUserTeams)
				return allUserTeams;
			else
				return [];
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	async deleteUser(user: User): Promise<void> {
		try {
			let where:string = "userId=\""+user.userId+"\"";
			await UsersServer.dbserver.delete("users",where);
		} catch (error) {
			//TODO add user back if failed
			//await UsersServer.dbserver.insert("users",[],[]);
			console.error(error);
		}
	}
	
	async createSession(username: string, password: string): Promise<Session> {
		password = this._passwordGenerator (password);
		try {
			let where:string = "username=\""+username+"\""; 
			let res:{username:string} = <{username:string}> await UsersServer.dbserver.select(["username"],"users",where);
			if(res) {
				let where:string = "username=\""+username+"\"" + "AND password=\""+password+"\""; 
				let user:User = <User> await UsersServer.dbserver.select(['*'],'users',where);
				if(user) {			
					let userId:string = user.userId.toString();
					let token:string = "\'" + generate({ length: 100 }) + "\'";
					let res = await UsersServer.dbserver.insert('sessions',[userId,token],['userId','token'])
					if(res) {
						let where:string = "userId=\""+user.userId+"\""; 
						let session:Session = <Session> await UsersServer.dbserver.select(['*'],'sessions',where);
						if(session) 
							return session;
						else 
							return NO_SESSION;  
					} else {
						return NO_SESSION;
					}
				} else {
					return {sessionId:0,token:"cred",userId:0,createdAt: new Date(0)};
				}
			} else {
				return {sessionId:0,token:"cred",userId:0,createdAt: new Date(0)};
			}
		} catch(e) {
			let errorSession = NO_SESSION;
			errorSession.token = "error";
			return errorSession;
		}
	}
	
	async modifyUser(user: User) {
		try {
			let whereCondition = "userId="+user.userId;
			await UsersServer.dbserver.update("users",user,whereCondition);
		} catch (error) {
			console.error(error);
		}
	}

	async getUserByUsername(username: string): Promise<User> {
		try {
			let where:string = "username=\""+username+"\""; 
			let user:User = <User> await UsersServer.dbserver.select(["*"],"users",where);
			if (user)
				return user;
			else
				return NO_USER;
		} catch (error) {
			console.error(error);
			return NO_USER;
		}
	}
	async getUserByEmail(email: string): Promise<User> {
		try {
			let where:string = "email=\""+email+"\""; 
			let user:User = <User> await UsersServer.dbserver.select(["*"],"users",where);
			if (user)
				return user;
			else
				return NO_USER; 
		}
		catch (error) {
			console.error(error);
			return NO_USER;
		}
	}

	async getUserById(userId: number): Promise<User> {
		try {
			let where:string = "userId=\""+userId+"\""; 
			let user:User = <User> await UsersServer.dbserver.select(["*"],"users",where);
			if (user)
				return user;
			else
				return NO_USER;
		} catch (error) {
			console.error(error);
			return NO_USER;
		}
	}

	async deleteSession(token: string, sessionId?: number): Promise<void> {
		try {
			if(sessionId) {
				let where:string = "token=\""+token+"\" AND sessionId=\""+sessionId+"\"";
				await UsersServer.dbserver.delete("session",where);
			}
			else {
				let where:string = "token=\""+token;
				await UsersServer.dbserver.delete("session",where);
			}
		} catch (error) {
			console.error(error);
		}
	}


	async getUserLastSession(userId: number): Promise<Session> {
		try {
			let where:string = "userId=\""+userId+"\"";
			let session:Session = <Session> await UsersServer.dbserver.select(["*"],"sessions",where);
			if(session)
				return session;
			return NO_SESSION;
		} catch (error) {
			console.error(error);
			return NO_SESSION;
		}
	}

	async getUsers():Promise<User[]> {
		try {
			let where:string = "role !='{\"Mentor\":true}' AND role !='{\"Admin\":true}'";
			let users:User[] = <User[]> await UsersServer.dbserver.select(["*"],"users",where);
			if(users) {
				return users;
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			return [];
			
		}
	}
	async getAllUsers():Promise<User[]> {
		try {
			let users:User[] = <User[]> await UsersServer.dbserver.select(["*"],"users");
			if(users) {
				return users;
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			return [];
			
		}
	}

	async getSessionUser(token: string): Promise<User> {
		try {
			let where:string = "token=\""+token+"\"";
			let session:Session = <Session> await UsersServer.dbserver.select(["userId"],"sessions",where);
			if(session) {
				let where:string = "userId=\""+session.userId+"\"";
				let user:User = <User> await UsersServer.dbserver.select(["*"],"users",where); //where data de azi mai noua decat expirare
				if(user)
					return user;
			}
			return NO_USER;
		} catch (error) {
			console.error(error);
			return NO_USER;
			
		}
	}

	public static getInstance (): UsersServer
	{
		if (!this.INSTANCE)
		{
			this.INSTANCE = new UsersServer ();
		}
		return this.INSTANCE;
	}
	
}


let server = Server.getInstance ();
let usersServer = UsersServer.getInstance();
let router = express.Router ();
router.use((req, res, next) => {
	(req as any).user = NO_USER;
	(req as any).token = NO_TOKEN;
	next();
});
	
router.post("/login", async (req, res) => {
	try {
		let session:Session = await usersServer.createSession(req.body.username, req.body.password);
		let user = await usersServer.getUserByUsername(req.body.username);
		if(user.userId !== 0) {
			user.lastLogin = req.body.lastLogin
			await usersServer.modifyUser(user)
		}
		if(session.token === "error") {
			res.status(500).send({err:500});
		} else {
			res.send (session);
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500});
	}
		
});
    
router.get("/verify/:email", async(req,res) => {
	try {
		let email = req.params.email;
		let user = await usersServer.getUserByEmail(email);
		if(user.userId !== 0) {
			res.status(200).send({accept:"Yes"});
		} else {
			res.status(404).send({err:404});
		}
		
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500});
	}
});

router.use(async (req, res, next)=> {
	let authorization = req.header("Authorization");
	let token = NO_TOKEN;
	if(authorization){
		token = authorization.split(" ")[1];
	}
	if(token !==  NO_TOKEN) {
		let user = await usersServer.getSessionUser(token);
		if(user === NO_USER)
			res.status(401).send({err:401});
		else
		{
			(req as any).user = user;
			(req as any).token = token;
			next();
		}
	}
	else
	{
		res.status(401).send({err:401});
	}
});

router.get("/user", async (req, res, next) => {
	res.send((req as any).user);
});

    
router.post("/user/update", async (req,res) => {
	let user = req.body.newUser;
	let changedPass = req.body.changedPass;
	if(changedPass) {
		user.password = usersServer._passwordGenerator(user.password);
	}
	// let options = admin.createMailOptions(
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
	// let transporter = admin.createMailTransporter()
	// admin.sendMail(transporter,options);
	
	if(user) {
		await usersServer.modifyUser((user as User));
	} else {
		res.status(401).send({err:401});
	}
	res.status(201).send({});
});
    
router.get("/user/:email", async (req,res) => {
	let email = req.params.email;
	let user = await usersServer.getUserByEmail(email);
	if(user) {
		res.send(user);
	} else {
		res.status(401).send({err:401});
	}
});
router.get("/users", async (req,res) => {
	try {
		let usersList:User[] = await usersServer.getUsers();
		if(usersList) {
			res.status(200).send(usersList);
		} else {
			res.status(204).send([]);
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}
});
router.get("/users/all", async (req,res) => {
	try {
		let usersList:User[] = await usersServer.getAllUsers();
		if(usersList) {
			res.status(200).send(usersList);
		} else {
			res.status(204).send([]);
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}
});

router.post("/users/logout", async (req, res, next) => {
	if(req.body.sessionId)
		await usersServer.deleteSession((req as any).token, req.body.sessionId);
	else
		await usersServer.deleteSession((req as any).token);
	res.send({});
});
router.get("/session/:userId", async (req,res) => {
	try {
		// let userId = req.params.userId;
		let session: Session = await usersServer.getUserLastSession(Number(req.params.userId));
		if(session) {
			res.status(200).send(session);
		} else {
			res.status(204).send({});
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500});
	}
});
server.registerRouterAPI (1, router, "/users");
