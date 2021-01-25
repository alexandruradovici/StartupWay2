
import { Session, NO_SESSION, User, NO_USER, NO_TOKEN } from '../common';
import { Server } from "@startupway/main/lib/server";
import { getPool } from '@startupway/database/lib/server';
import { QueryOptions, Connection } from 'mariadb';
import { NextFunction, Router, Request, Response } from "express";
import { createHash } from 'crypto';
import { generate } from 'randomstring';
import { TABLE_USERS } from './tables';

export class UsersServer {

	private static INSTANCE?: UsersServer;
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

	private passwordGenerator (password: string): string {
		const hash = createHash('sha256');
		hash.update(password);
		return hash.digest('hex');
	}

	async addUser(user: User): Promise<User | null> {
		try {
			user.password = this.passwordGenerator (user.password);

			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: `INSERT INTO ${TABLE_USERS} COLUMNS(firstName,lastName,username,password,email,phone,birthDate,avatarUu,socialMedia,userDetails,role,lastLogin) values(:firstName,:lastName,username,password,email,phone,birthDate,avatarUu,socialMedia,userDetails,role,lastLogin)`
			}
			const response = await this.conn.query(queryOptions,user);
			if(response) {
				const newUser = await this.getUserByUsername(user.username);
				if(newUser)
					return newUser;
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
	async getAllUserTeams(): Promise<User[]> {
		try {
			const queryOptions:QueryOptions = {
				sql: "SELECT users.*, userTeams.teamId as userTeams_teamID, userTeams.role as userTeams_role FROM users INNER JOIN userTeams ON user.userId!=:userTeams.userId"
			}
			const allUserTeams = await this.conn.query(queryOptions);
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
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "DELETE FROM users where userId=:userId"
			}
			const values = {
				userId:user.userId
			};
			await this.conn.query(queryOptions,values);
		} catch (error) {
			// TODO add user back if failed
			await this.addUser(user);
			console.error(error);
		}
	}

	async createSession(username: string, password: string): Promise<Session | null> {
		password = this.passwordGenerator (password);
		try {
			let queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT username FROM users WHERE username=:username"
			}
			const resUsername:{username:string}[] = await this.conn.query(queryOptions,{username:username}) as {username:string}[];
			if(resUsername[0]) {
				queryOptions = {
					namedPlaceholders:true,
					sql: "SELECT * FROM users WHERE username=:username AND password=:password"
				}
				const user:User[] = await this.conn.query(queryOptions,{username:username,password:password}) as User[];
				if(user[0]!== undefined && user[0].userId !== 0) {
					const userId:number = user[0].userId;
					const token:string =generate({ length: 100 });
					queryOptions = {
						namedPlaceholders:true,
						sql: "INSERT INTO sessions (userId, token) values(:userId,:token)"
					}
					const resSession:Session[] =await this.conn.query(queryOptions,{userId:userId, token:token}) as Session[];
					if(resSession) {
						queryOptions = {
							namedPlaceholders:true,
							sql: "SELECT * FROM sessions WHERE userId=:userId"
						}
						const session:Session[] = await this.conn.query(queryOptions,{userId:userId}) as Session[];
						if(session[0])
							return session[0];
						else
							return null;
					} else {
						return null;
					}
				} else {
					return {sessionId:0,token:"cred",userId:0,createdAt: new Date(0)};
				}
			} else {
				return {sessionId:0,token:"cred",userId:0,createdAt: new Date(0)};
			}
		} catch(e) {
			console.error(e);
			const errorSession = NO_SESSION;
			errorSession.token = "error";
			return errorSession;
		}
	}

	async modifyUser(user: User, changedPass?: string) {
		try {
			if(changedPass) {
				user.password = this.passwordGenerator(user.password);
			}
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "UPDATE users SET firstName=:firstName, lastName=:lastName, username=:username, password=:password, email=:email, phone=:phone, socialMedia=:socialMedia, birthDate=:birthDate, userDetails=:userDetails, role=:role, avatarUu=:avatarUu, lastLogin=:lastLogin WHERE userId=:userId"
			}
			await this.conn.query(queryOptions,user);
		} catch (error) {
			console.error(error);
		}
	}

	async getUserByUsername(username: string): Promise<User | null> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM users WHERE username=?"
			}
			const values = {
				username:username
			};
			const user:User[] = await this.conn.query(queryOptions,values) as User[];
			if(user.length > 0) {
				if (user[0].userId !== 0)
					return user[0];
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
	async getUserByEmail(email: string): Promise<User | null> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM users WHERE email=?"
			}
			const values= {
				email:email
			};
			const user:User[] = await this.conn.query(queryOptions,values) as User[];
			if(user.length > 0) {
				if (user[0].userId !== 0)
					return user[0];
				else
					return null;
			} else {
				return null;
			}
		}
		catch (error) {
			console.error(error);
			return null;
		}
	}

	async getUserById(userId: number): Promise<User | null> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM users WHERE userId=?"
			}
			const values = {
				userId:userId
			}
			const user:User[] = await this.conn.query(queryOptions,values) as User[];
			if(user.length > 0) {
				if (user[0].userId !== 0)
					return user[0];
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

	async deleteSession(token: string, sessionId?: number): Promise<void> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: ""
			}
			let values:{token?:string,sessionId?:number} = {};
			if(sessionId){
				queryOptions.sql = "DELETE FROM users WHERE token=:token AND sessionID=:sessionID";
				values = {
					token:token,
					sessionId:sessionId
				}
			}
			else {
				queryOptions.sql = "DELETE FROM users WHERE token=:token";
				values = {
					token:token,
				}
			}
			await this.conn.query(queryOptions,values);
		} catch (error) {
			console.error(error);
		}
	}


	async getUserLastSession(userId: number): Promise<Session | null> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM session where userId=:userId"
			}
			const values = {
				userId:userId
			}
			const session:Session[] = await this.conn.query(queryOptions,values) as Session[];
			if(session[0])
				return session[0];
			return null;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async getUsers():Promise<User[]> {
		try {
			const queryOptions:QueryOptions = {
				sql: "SELECT * FROM users where role!='{\"Mentor\":true}' AND role!='{\"Admin\":true}'"
			}
			const users:User[] = await this.conn.query(queryOptions) as User[];
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
			const queryOptions:QueryOptions = {
				sql: "SELECT * FROM users"
			}
			const users:User[] = await this.conn.query(queryOptions) as User[];
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

	async getSessionUser(token: string): Promise<User | null> {
		try {
			let queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT userId FROM sessions where token=:token"
			}
			const session:{userId:number}[] =  await this.conn.query(queryOptions,{token:token}) as {userId:number}[];
			if(session[0]) {
				queryOptions = {
					namedPlaceholders:true,
					sql: "SELECT * FROM users WHERE userId=:userId"
				}
				const user:User[] = await this.conn.query(queryOptions,{userId:session[0].userId}) as User[];// where data de azi mai noua decat expirare
				if(user[0])
					return user[0];
			}
			return null;
		} catch (error) {
			console.error(error);
			return null;
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


const server = Server.getInstance ();
const usersServer = UsersServer.getInstance();
const router = Router ();

router.use((req, res, next) => {
	(req as any).user = NO_USER;
	(req as any).token = NO_TOKEN;
	next();
});

router.post("/login", async (req, res) => {
	try {
		const session:Session | null = await usersServer.createSession(req.body.username, req.body.password);
		const user = await usersServer.getUserByUsername(req.body.username);
		if(user) {
			user.lastLogin = req.body.lastLogin
			await usersServer.modifyUser(user)
		}
		if(session === null) {
			res.send("");
		} else if(session.token === "error") {
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
		const email = req.params.email;
		const user = await usersServer.getUserByEmail(email);
		if(user) {
			res.status(200).send({accept:"Yes"});
		} else {
			res.status(404).send({err:404});
		}

	} catch (e) {
		console.error(e);
		res.status(500).send({err:500});
	}
});

const authFunct = getAuthorizationFunction();
if(authFunct)
	router.use((authFunct as any));
	// Bypass params dictionary and send authorization Function

router.get("/user", async (req, res, next) => {
	res.send((req as any).user);
});


router.post("/user/update", async (req,res) => {
	const user:User = req.body.newUser;
	const changedPass = req.body.changedPass;
	console.log("Changed" + changedPass);
	console.log(user);
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
	// const transporter = admin.createMailTransporter()
	// admin.sendMail(transporter,options);

	if(user) {
		await usersServer.modifyUser(user, changedPass);
	} else {
		res.status(401).send({err:401});
	}
	res.status(201).send({});
});

router.get("/user/:email", async (req,res) => {
	const email = req.params.email;
	const user = await usersServer.getUserByEmail(email);
	if(user) {
		res.send(user);
	} else {
		res.status(401).send({err:401});
	}
});
router.get("/users", async (req,res) => {
	try {
		const usersList:User[] = await usersServer.getUsers();
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
		const usersList:User[] = await usersServer.getAllUsers();
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

router.post("/logout", async (req, res, next) => {
	if(req.body.sessionId)
		await usersServer.deleteSession((req as any).token, req.body.sessionId);
	else
		await usersServer.deleteSession((req as any).token);
	res.send({});
});
router.get("/session/:userId", async (req,res) => {
	try {
		// const userId = req.params.userId;
		const session: Session | null = await usersServer.getUserLastSession(Number(req.params.userId));
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


export function getAuthorizationFunction(): Function | null {
	try {
		let f = async (req:Request, res:Response, next:NextFunction)=> {
			const authorization = req.header("Authorization");
			let token = NO_TOKEN;
			if(authorization){
				token = authorization.split(" ")[1];
			}
			if(token !==  NO_TOKEN) {
				const user = await usersServer.getSessionUser(token);
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
		}
		return f;
	} catch(error) {
		console.error(error);
		return null;
	}
};