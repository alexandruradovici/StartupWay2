
import { Session, User, UserTeams} from '../common';
import { Server, ApiRequest, ApiResponse } from "@startupway/main/lib/server";
import { getPool } from '@startupway/database/lib/server';
import { QueryOptions, Connection } from 'mariadb';
import { NextFunction, Router, Request, Response } from "express";
import { createHash } from 'crypto';
import { generate } from 'randomstring';
import { TABLE_USERS } from './tables';
import { v4 as uiidv4 } from 'uuid';

export class UsersServer {

	private static INSTANCE?: UsersServer;

	public static passwordGenerator (password: string): string {
		const hash = createHash('sha256');
		hash.update(password);
		return hash.digest('hex');
	}

	async addUser(user: User): Promise<User | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				user.password = UsersServer.passwordGenerator (user.password);
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: `INSERT INTO ${TABLE_USERS} (userId,firstName,lastName,username,password,email,phone,birthDate,avatarUu,socialMedia,userDetails,role,lastLogin) VALUES(:userId,:firstName,:lastName,:username,:password,:email,:phone,:birthDate,:avatarUu,:socialMedia,:userDetails,:role,:lastLogin)`
				}
				await conn.query(queryOptions, user);
				queryOptions.sql = `SELECT userId,firstName,lastName,username,email,phone,birthDate,avatarUu,socialMedia,userDetails,role,lastLogin FROM ${TABLE_USERS} WHERE userId=:userId`;
				const response:User[] = await conn.query(queryOptions, user);
				if(response && response.length > 0 && response[0]) {
					await conn.commit();
					await conn.end();
					return response[0];
				} else {
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return null;
		}
	}
	async getAllUserTeams(): Promise<User[]> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			const queryOptions:QueryOptions = {
				sql: "SELECT users.*, userTeams.teamId, userTeams.role FROM users INNER JOIN userTeams ON user.userId!=:userTeams.userId"
			}
			const allUserTeams:(User&UserTeams)[] = await conn.query(queryOptions);
			if(allUserTeams && allUserTeams.length > 0) {
				await conn.end();
				return allUserTeams;
			} else { 
				await conn.end();
				return [];
			}
		} catch (error) {
			console.error(error);
			if(conn)
				await conn.end();
			return [];
		}
	}

	async deleteUser(user: User): Promise<boolean> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: "DELETE FROM users WHERE userId=:userId"
				}
				await conn.query(queryOptions, user);
				queryOptions.sql = "SELECT userId as deleted_id FROM users WHERE userId=:userId";
				const response:{deleted_id:string}[] = await conn.query(queryOptions, user);
				if(response && response.length === 0) {
					await conn.commit();
					await conn.end();
					return true;
				} else {
					await conn.end();
					return false;
				}
			} else {
				return false;
			}
		} catch (error) {
			console.error(error);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return false;
		}
	}

	async createSession(username: string, password: string): Promise<Session | null> {
		password = UsersServer.passwordGenerator (password);
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			let queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT username FROM users WHERE username=:username"
			}
			const resUsername:{username:string}[] = await conn.query(queryOptions,{username}) as {username:string}[];
			if(resUsername && resUsername.length > 0 && resUsername[0]) {
				queryOptions = {
					namedPlaceholders:true,
					sql: "SELECT * FROM users WHERE username=:username AND password=:password"
				}
				const user:User[] = await conn.query(queryOptions,{username,password}) as User[];
				if(user && user.length > 0 && user[0]) {
					try {
						await conn.beginTransaction();
						const sessionId:string = uiidv4();
						const userId:string = user[0].userId;
						const token:string = generate({ length: 100 });
						queryOptions = {
							namedPlaceholders:true,
							sql: "INSERT INTO sessions (sessionId, userId, token) VALUES(:sessionId,:userId,:token)"
						}
						await conn.query(queryOptions, {sessionId, userId, token});
						queryOptions.sql = "SELECT sessionId, userId, token FROM sessions WHERE sessionId=:sessionId"
						const resSession:Session[] = await conn.query(queryOptions,{sessionId}) as Session[];
						if(resSession && resSession.length > 0 && resSession[0]) {
							await conn.commit();
							await conn.end();
							return resSession[0];
						}
					} catch (error) {
						console.error(error);
						const errorSession:Session = {
							sessionId: "",
							token: "",
							userId: "",
							createdAt: new Date(),
						};
						errorSession.token = "error";
						if(conn) {
							await conn.rollback();
							await conn.end();
							return errorSession;
						}
					}
				} else {
					await conn.end();
					return {sessionId:"",token:"cred",userId:"",createdAt: new Date(0)};
				}
			} else {
				await conn.end();
				return {sessionId:"",token:"cred",userId:"",createdAt: new Date(0)};
			}
		} catch(e) {
			console.error(e);
			const errorSession:Session = {
				sessionId: "",
				token: "",
				userId: "",
				createdAt: new Date(),
			};
			errorSession.token = "error";
			if(conn)
				await conn.end();
			return errorSession;
		}
		if(conn)
			await conn.end();
		return null;
	}

	async modifyUser(user: User, changedPass?: string):Promise<boolean> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: "UPDATE users SET firstName=:firstName, lastName=:lastName, username=:username, email=:email, phone=:phone, socialMedia=:socialMedia, birthDate=:birthDate, userDetails=:userDetails, role=:role, avatarUu=:avatarUu, lastLogin=:lastLogin WHERE userId=:userId"
				}
				if(changedPass) {
					user.password = UsersServer.passwordGenerator(user.password);
					queryOptions.sql = "UPDATE users SET firstName=:firstName, lastName=:lastName, username=:username, password=:password, email=:email, phone=:phone, socialMedia=:socialMedia, birthDate=:birthDate, userDetails=:userDetails, role=:role, avatarUu=:avatarUu, lastLogin=:lastLogin WHERE userId=:userId";
				}
				await conn.query(queryOptions, user);
				queryOptions.sql = "SELECT userId,firstName,lastName,username,email,phone,birthDate,avatarUu,socialMedia,userDetails,role,lastLogin FROM users WHERE userId=:userId";
				const resp:User[] = await conn.query(queryOptions, user);
				if(resp && resp.length > 0 && resp[0]) {
					await conn.commit();
					await conn.end();
					return true;
				}
			}
		} catch (error) {
			console.error(error);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return false;
		}
		if(conn)
			await conn.end();
			return false;
	}

	async getUserByUsername(username: string): Promise<User | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM users WHERE username=:username"
			};
			const user:User[] = await conn.query(queryOptions,{username}) as User[];
			if(user && user.length > 0 && user[0]) {
				if (user[0]) {
					await conn.end();
					return user[0];
				}
			}
		} catch (error) {
			console.error(error);
		}
		if(conn)
			await conn.end();
		return null;
	}
	async getUserByEmail(email: string): Promise<User | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM users WHERE email=:email"
			};
			const user:User[] = await conn.query(queryOptions,{email}) as User[];
			if(user && user.length > 0 && user[0]) {
				if (user[0]) {
					await conn.end();
					return user[0];
				}
			}
		}
		catch (error) {
			console.error(error);
		}
		if(conn)
			await conn.end();
		return null;
	}

	async getUserById(userId: string): Promise<User | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM users WHERE userId=:userId"
			};
			const user:User[] = await conn.query(queryOptions,{userId}) as User[];
			if(user && user.length > 0 && user[0]) {
				if (user[0]){
					await conn.end();
					return user[0];
				}
			}
		} catch (error) {
			console.error(error);
		}
		if(conn)
			await conn.end();
		return null;
	}

	async deleteSession(token: string, sessionId?: string): Promise<boolean> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: ""
				};
				let values:{token?:string,sessionId?:string} = {};
				if(sessionId){
					queryOptions.sql = "DELETE FROM sessions WHERE sessions.token=:token AND sessions.sessionId=:sessionId";
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
				await conn.query(queryOptions, values);
				queryOptions.sql = "SELECT sessionId as deleted_id FROM sessions WHERE token=:token";
				const response:{deleted_id:string}[] = await conn.query(queryOptions,values);
				if(response && response.length === 0) {
					await conn.commit();
					await conn.end();
					return true;
				}
			} else {
				return false;
			}
		} catch (error) {
			console.error(error);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return false;
		}
		if(conn)
			await conn.end();
		return false;
	}


	async getUserLastSession(userId: string): Promise<Session | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM session where userId=:userId"
			}
			const session:Session[] = await conn.query(queryOptions,{userId}) as Session[];
			if(session && session.length > 0 && session[0]) {
				await conn.end();
				return session[0];
			}
		} catch (error) {
			console.error(error);
		}
		if(conn)
			await conn.end();
		return null;
	}

	async getUsers():Promise<User[]> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			const queryOptions:QueryOptions = {
				sql: "SELECT * FROM users WHERE role!='Mentor' AND role!='Admin'"
			}
			const users:User[] = await conn.query(queryOptions) as User[];
			if(users && users.length > 0) {
				for(const u of users) {
					if(u.socialMedia)
						u.socialMedia = JSON.parse((u.socialMedia as any) as string);
					if(u.userDetails)
						u.userDetails = JSON.parse((u.userDetails as any) as string);
				}
				await conn.end();
				return users;
			}
		} catch (error) {
			console.error(error);
		}
		if(conn)
			await conn.end();
		return [];
	}
	async getAllUsers():Promise<User[]> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			const queryOptions:QueryOptions = {
				sql: "SELECT * FROM users"
			}
			const users:User[] = await conn.query(queryOptions) as User[];
			if(users && users.length > 0) {
				await conn.end();
				return users;
			}
		} catch (error) {
			console.error(error);
		}
		if(conn)
			await conn.end();
		return [];
	}

	async getSessionUser(token: string): Promise<User | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			let queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT userId FROM sessions where token=:token"
			}
			const session:{userId:string}[] =  await conn.query(queryOptions,{token}) as {userId:string}[];
			if(session && session.length > 0 && session[0]) {
				queryOptions = {
					namedPlaceholders:true,
					sql: "SELECT * FROM users WHERE userId=:userId"
				}
				const user:User[] = await conn.query(queryOptions,{userId:session[0].userId}) as User[];// where data de azi mai noua decat expirare
				if(user && user.length > 0 && user[0]) {
					await conn.end();
					return user[0];
				}
			}
		} catch (error) {
			console.error(error);
		}
		if(conn)
			await conn.end();
		return null;
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
			user.lastLogin = req.body.lastLogin;
			const resp = await usersServer.modifyUser(user);
			if(resp) {
				if(session === null) {
					res.send(null);
				} else if(session.token === "error") {
					res.status(500).send({err:500,data:null});
				} else {
					res.send (session);
				}
			} else {
				res.send(null);
			}
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
		const u:User | null = (req as any).user
		if(u) {
			u.socialMedia = JSON.parse((u.socialMedia as any) as string);
			u.userDetails = JSON.parse((u.userDetails as any) as string);
		}
		res.send(u);
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
			// for(let user of usersList) {
			// 	console.log(user.socialMedia);
			// 	console.log(typeof user.socialMedia);
			// 	if(typeof user.socialMedia === "string") {
			// 		user.socialMedia = JSON.parse((user.socialMedia as any) as string);
			// 	}
			// 	if(typeof user.userDetails === "string") {
			// 		user.userDetails = JSON.parse((user.userDetails as any) as string);
			// 	}
			// }
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
			for(let user of usersList) {
				user.socialMedia = JSON.parse((user.socialMedia as any) as string);
				user.userDetails = JSON.parse((user.userDetails as any) as string);
			}
			res.status(200).send(usersList);
		} else {
			res.status(204).send([]);
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err: 500,data:[]});
	}
});

router.post("/logout", async (req:ApiRequest<{sessionId:string}> & {token:string}, res:ApiResponse<boolean>, next) => {
	if(req.body.sessionId) {
		const respSession = await usersServer.deleteSession(req.token, req.body.sessionId);
		if(respSession) {
			res.status(200).send(respSession);
		} else {
			res.status(201).send(false);
		}
	} else {
		const respToken = await usersServer.deleteSession(req.token);
		if(respToken) {
			res.status(200).send(respToken);
		} else {
			res.status(201).send(false);
		}
	}
});
router.get("/session/:userId", async (req:ApiRequest<undefined>, res:ApiResponse<Session | null>) => {
	try {
		// const userId = req.params.userId;
		const session: Session | null = await usersServer.getUserLastSession(req.params.userId);
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