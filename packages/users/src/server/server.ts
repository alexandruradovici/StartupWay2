
import { Session, NO_SESSION, User, NO_USER, NO_TOKEN } from '../common';
import { Server } from "@startupway/main/lib/server";
import { getPool } from '@startupway/database/lib/server';
import {QueryOptions, Connection} from 'mariadb';
import {Router} from "express";
import { createHash } from 'crypto';
import { generate } from 'randomstring';
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

	_passwordGenerator (password: string): string {
		const hash = createHash('sha256');
		hash.update(password);
		return hash.digest('hex');
	}

	async addUser(user: User): Promise<User> {
		try {
			user.password = this._passwordGenerator (user.password);

			const queryOptions:QueryOptions = {
				sql: "INSERT INTO users columns(firstName,lastName,username,password,email,phone,birthDate,avatarUu,socialMedia,userDetails,role,lastLogin) values(?,?,?,?,?,?,?,?,?,?,?,?)"
			}
			const values = [
				user.firstName, user.lastName, user.username,
				user.password, user.email, user.phone,
				user.birthDate, user.avatarUu, user.socialMedia,
				user.userDetails, user.role, user.lastLogin
			];
			const response = await this.conn.query(queryOptions,values);
			if(response) {
				const newUser = await this.getUserByUsername(user.username);
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
				sql: "DELETE FROM users where userId=?"
			}
			const values:number[] = [user.userId];
			await this.conn.query(queryOptions,values);
		} catch (error) {
			// TODO add user back if failed
			await this.addUser(user);
			console.error(error);
		}
	}

	async createSession(username: string, password: string): Promise<Session> {
		password = this._passwordGenerator (password);
		try {
			let queryOptions:QueryOptions = {
				sql: "SELECT username FROM users WHERE username=?"
			}
			const resUsername:{username:string}[] = await this.conn.query(queryOptions,[username]) as {username:string}[];
			if(resUsername[0]) {
				queryOptions = {
					sql: "SELECT * FROM users WHERE username=? AND password=?"
				}
				const user:User[] = await this.conn.query(queryOptions,[username, password]) as User[];
				if(user[0]!== undefined && user[0].userId !== 0) {
					const userId:number = user[0].userId;
					const token:string =generate({ length: 100 });
					queryOptions = {
						sql: "INSERT INTO sessions (userId, token) values(?,?)"
					}
					const resSession:Session[] =await this.conn.query(queryOptions,[userId, token]) as Session[];
					if(resSession) {
						queryOptions = {
							sql: "SELECT * FROM sessions WHERE userId=?"
						}
						const session:Session[] = await this.conn.query(queryOptions,[userId]) as Session[];
						if(session[0])
							return session[0];
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
			console.error(e);
			const errorSession = NO_SESSION;
			errorSession.token = "error";
			return errorSession;
		}
	}

	async modifyUser(user: User) {
		try {
			const queryOptions:QueryOptions = {
				sql: "UPDATE users SET firstName=?, lastName=?, username=?, password=?,email=?,phone=?,socialMedia=?,birthDate=?,userDetails=?,role=?,avatarUu=?,lastLogin=? where userId=?"
			}
			const values:(string|number|Date|{[key:string]:string})[] = [
				user.firstName,user.lastName,user.username,
				user.password,user.email,user.phone,
				user.socialMedia,user.birthDate,user.userDetails,
				user.role,user.avatarUu,user.lastLogin,
				user.userId
			];
			await this.conn.query(queryOptions,values);
		} catch (error) {
			console.error(error);
		}
	}

	async getUserByUsername(username: string): Promise<User> {
		try {
			const queryOptions:QueryOptions = {
				sql: "SELECT * FROM users WHERE username=?"
			}
			const values:string[] = [username];
			const user:User[] = await this.conn.query(queryOptions,values) as User[];
			if(user.length > 0) {
				if (user[0].userId !== 0)
					return user[0];
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
	async getUserByEmail(email: string): Promise<User> {
		try {
			const queryOptions:QueryOptions = {
				sql: "SELECT * FROM users WHERE email=?"
			}
			const values:string[] = [email];
			const user:User[] = await this.conn.query(queryOptions,values) as User[];
			if(user.length > 0) {
				if (user[0].userId !== 0)
					return user[0];
				else
					return NO_USER;
			} else {
				return NO_USER;
			}
		}
		catch (error) {
			console.error(error);
			return NO_USER;
		}
	}

	async getUserById(userId: number): Promise<User> {
		try {
			const queryOptions:QueryOptions = {
				sql: "SELECT * FROM users WHERE userId=?"
			}
			const values:number[] = [userId];
			const user:User[] = await this.conn.query(queryOptions,values) as User[];
			if(user.length > 0) {
				if (user[0].userId !== 0)
					return user[0];
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

	async deleteSession(token: string, sessionId?: number): Promise<void> {
		try {
			const queryOptions:QueryOptions = {
				sql: ""
			}
			const values:(string|number)[] = [];
			if(sessionId){
				queryOptions.sql = "DELETE FROM users WHERE token=? AND sessionID=?";
				values.push(token,sessionId);
			}
			else {
				queryOptions.sql = "DELETE FROM users WHERE token=?";
				values.push(token);
			}
			await this.conn.query(queryOptions,values);
		} catch (error) {
			console.error(error);
		}
	}


	async getUserLastSession(userId: number): Promise<Session> {
		try {
			const queryOptions:QueryOptions = {
				sql: "SELECT * FROM session where userId=?"
			}
			const values:(number)[] = [userId];
			const session:Session[] = await this.conn.query(queryOptions,values) as Session[];
			if(session[0])
				return session[0];
			return NO_SESSION;
		} catch (error) {
			console.error(error);
			return NO_SESSION;
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

	async getSessionUser(token: string): Promise<User> {
		try {
			let queryOptions:QueryOptions = {
				sql: "SELECT userId FROM sessions where token=?"
			}
			const session:{userId:number}[] =  await this.conn.query(queryOptions,[token]) as {userId:number}[];
			if(session[0]) {
				queryOptions = {
					sql: "SELECT * FROM users WHERE userId=?"
				}
				const user:User[] = await this.conn.query(queryOptions,[session[0].userId]) as User[];// where data de azi mai noua decat expirare
				if(user[0])
					return user[0];
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
		const session:Session = await usersServer.createSession(req.body.username, req.body.password);
		const user = await usersServer.getUserByUsername(req.body.username);
		if(user.userId && user.userId !== 0) {
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
		const email = req.params.email;
		const user = await usersServer.getUserByEmail(email);
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
});

router.get("/user", async (req, res, next) => {
	res.send((req as any).user);
});


router.post("/user/update", async (req,res) => {
	const user = req.body.newUser;
	const changedPass = req.body.changedPass;
	if(changedPass) {
		user.password = usersServer._passwordGenerator(user.password);
	}
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
		await usersServer.modifyUser((user as User));
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

router.post("/users/logout", async (req, res, next) => {
	if(req.body.sessionId)
		await usersServer.deleteSession((req as any).token, req.body.sessionId);
	else
		await usersServer.deleteSession((req as any).token);
	res.send({});
});
router.get("/session/:userId", async (req,res) => {
	try {
		// const userId = req.params.userId;
		const session: Session = await usersServer.getUserLastSession(Number(req.params.userId));
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
