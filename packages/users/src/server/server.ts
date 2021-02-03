
import { Session, User} from '../common';
import { Server, ApiRequest, ApiResponse } from "@startupway/main/lib/server";
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

	public static passwordGenerator (password: string): string {
		const hash = createHash('sha256');
		hash.update(password);
		return hash.digest('hex');
	}

	async addUser(user: User): Promise<User | null> {
		try {
			user.password = UsersServer.passwordGenerator (user.password);
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: `INSERT INTO ${TABLE_USERS} (firstName,lastName,username,password,email,phone,birthDate,avatarUu,socialMedia,userDetails,role,lastLogin) VALUES(:firstName,:lastName,:username,:password,:email,:phone,:birthDate,:avatarUu,:socialMedia,:userDetails,:role,:lastLogin)`
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
				nestTables:"_",
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
			await this.conn.query(queryOptions,user);
		} catch (error) {
			// TODO add user back if failed
			await this.addUser(user);
			console.error(error);
		}
	}

	async createSession(username: string, password: string): Promise<Session | null> {
		password = UsersServer.passwordGenerator (password);
		try {
			let queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT username FROM users WHERE username=:username"
			}
			const resUsername:{username:string}[] = await this.conn.query(queryOptions,{username}) as {username:string}[];
			if(resUsername[0]) {
				queryOptions = {
					namedPlaceholders:true,
					sql: "SELECT * FROM users WHERE username=:username AND password=:password"
				}
				const user:User[] = await this.conn.query(queryOptions,{username,password}) as User[];
				if(user[0]!== undefined && user[0].userId !== 0) {
					const userId:number = user[0].userId;
					const token:string = generate({ length: 100 });
					queryOptions = {
						namedPlaceholders:true,
						sql: "INSERT INTO sessions (userId, token) values(:userId,:token)"
					}
					const resSession:Session[] =await this.conn.query(queryOptions,{userId, token}) as Session[];
					if(resSession) {
						queryOptions = {
							namedPlaceholders:true,
							sql: "SELECT * FROM sessions WHERE userId=:userId"
						}
						const session:Session[] = await this.conn.query(queryOptions,{userId}) as Session[];
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
			let errorSession:Session = {
				sessionId: 0,
				token: "",
				userId: 0,
				createdAt: new Date(),

			};
			errorSession.token = "error";
			return errorSession;
		}
	}

	async modifyUser(user: User, changedPass?: string):Promise<boolean> {
		try {
			if(changedPass) {
				user.password = UsersServer.passwordGenerator(user.password);
			}
			// TODO TRANSACTION
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "UPDATE users SET firstName=:firstName, lastName=:lastName, username=:username, password=:password, email=:email, phone=:phone, socialMedia=:socialMedia, birthDate=:birthDate, userDetails=:userDetails, role=:role, avatarUu=:avatarUu, lastLogin=:lastLogin WHERE userId=:userId"
			}
			await this.conn.query(queryOptions,user);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async getUserByUsername(username: string): Promise<User | null> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM users WHERE username=:username"
			};
			const user:User[] = await this.conn.query(queryOptions,{username}) as User[];
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
				sql: "SELECT * FROM users WHERE email=:email"
			};
			const user:User[] = await this.conn.query(queryOptions,{email}) as User[];
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
				sql: "SELECT * FROM users WHERE userId=:userId"
			};
			const user:User[] = await this.conn.query(queryOptions,{userId}) as User[];
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
			};
			let values:{token?:string,sessionId?:number} = {};
			if(sessionId){
				queryOptions.sql = "DELETE FROM sessions WHERE sessions.token=:token AND sessions.sessionID=:sessionID";
				values = {
					token,
					sessionId
				}
			}
			else {
				queryOptions.sql = "DELETE FROM sessions WHERE sessions.token=:token";
				values = {
					token,
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
			const session:Session[] = await this.conn.query(queryOptions,{userId}) as Session[];
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
				sql: "SELECT * FROM users WHERE role!='{\"Mentor\":true}' AND role!='{\"Admin\":true}'"
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
			const session:{userId:number}[] =  await this.conn.query(queryOptions,{token}) as {userId:number}[];
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
	(req as any).user = null;
	(req as any).token = "";
	next();
});

router.post("/login", async (req:ApiRequest<{username:string,password:string,lastLogin:Date}>, res:ApiResponse<Session | null>) => {
	try {
		const session:Session | null = await usersServer.createSession(req.body.username, req.body.password);
		const user = await usersServer.getUserByUsername(req.body.username);
		if(user) {
			user.lastLogin = req.body.lastLogin
			await usersServer.modifyUser(user)
		}
		if(session === null) {
			res.send(null);
		} else if(session.token === "error") {
			res.status(500).send({err:500,data:null});
		} else {
			res.send (session);
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:null});
	}

});

router.get("/verify/:email", async(req:ApiRequest<undefined>, res:ApiResponse<{accept:string}>) => {
	try {
		const email = req.params.email;
		const user = await usersServer.getUserByEmail(email);
		if(user) {
			res.status(200).send({accept:"Yes"});
		} else {
			res.status(404).send({err:404,data:{accept:"No"}});
		}

	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:{accept:"No"}});
	}
});

const authFunct = getAuthorizationFunction();
if(authFunct)
	router.use(authFunct);

router.get("/user", async (req:ApiRequest<undefined>, res:ApiResponse<User|null>, next) => {
	if((req as any).user) {
		res.send((req as any).user);
	} else {
		res.send(null);
	}
});


router.post("/user/update", async (req:ApiRequest<{newUser:User,changedPass:string}>, res:ApiResponse<boolean>) => {
	const user:User = req.body.newUser;
	const changedPass = req.body.changedPass;
	console.log("Changed" + changedPass);
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
		const resp = await usersServer.modifyUser(user, changedPass);
		if(resp) {
			res.status(200).send(resp);
		} else {
			res.status(201).send(false);
		}
	} else {
		res.status(401).send({err:401,data:false});
	}
	res.status(201).send(false);
});

router.get("/user/:email", async (req:ApiRequest<undefined>, res:ApiResponse<User | null>) => {
	const email = req.params.email;
	const user = await usersServer.getUserByEmail(email);
	if(user) {
		res.send(user);
	} else {
		res.status(401).send({err:401,data:null});
	}
});
router.get("/users", async (req:ApiRequest<undefined>, res:ApiResponse<User[]>) => {
	try {
		const usersList:User[] = await usersServer.getUsers();
		if(usersList) {
			res.status(200).send(usersList);
		} else {
			res.status(204).send([]);
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500,data:[]});
	}
});
router.get("/users/all", async (req:ApiRequest<undefined>, res:ApiResponse<User[]>) => {
	try {
		const usersList:User[] = await usersServer.getAllUsers();
		if(usersList) {
			res.status(200).send(usersList);
		} else {
			res.status(204).send([]);
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500,data:[]});
	}
});

router.post("/logout", async (req:ApiRequest<{sessionId:number}>, res:ApiResponse<boolean>, next) => {
	if(req.body.sessionId)
		await usersServer.deleteSession((req as any).token, req.body.sessionId);
	else
		await usersServer.deleteSession((req as any).token);
	res.send(true);
});
router.get("/session/:userId", async (req:ApiRequest<undefined>, res:ApiResponse<Session | null>) => {
	try {
		// const userId = req.params.userId;
		const session: Session | null = await usersServer.getUserLastSession(Number(req.params.userId));
		if(session) {
			res.status(200).send(session);
		} else {
			res.status(204).send(null);
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500,data:null});
	}
});
server.registerRouterAPI (1, router, "/users");


export function getAuthorizationFunction(): ((req:Request,res:Response,next:NextFunction) => Promise<void>) | null {
	try {
		const f = async (req:Request, res:Response, next:NextFunction)=> {
			const authorization = req.header("Authorization");
			let token = null;
			if(authorization){
				token = authorization.split(" ")[1];
			}
			if(token !==  null) {
				const user = await usersServer.getSessionUser(token);
				if(user === null)
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