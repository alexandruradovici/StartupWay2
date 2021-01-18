
import { Session, NO_SESSION, User, NO_USER, NO_TOKEN } from '../common';
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

			// TODO SEE IF YOU CAN REPLACE WITH FOR (Object.entries -> split in two arrays -> push both as values and columns)
			const response = await UsersServer.dbserver.insert(
				"users",
				[user.firstName, user.lastName, user.username, user.password, user.email, user.phone, user.birthDate, user.avatarUu, user.socialMedia, user.userDetails, user.role, user.lastLogin],
				["firstName","lastName","username","password","email","phone","birthDate","avatarUu","socialMedia","userDetails","role","lastLogin"]
			);
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

	async getAllUserTeams(): Promise<any[]> {
		try {
			const onCondition:string= "users.userId!=userTeams.userId";
			const allUserTeams = await UsersServer.dbserver.selectInnerJoin(["*"],["teamId","role"],"users","userTeams",onCondition) as any[];
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
			const where:string = "userId=\""+user.userId+"\"";
			await UsersServer.dbserver.delete("users",where);
		} catch (error) {
			// TODO add user back if failed
			// await UsersServer.dbserver.insert("users",[],[]);
			console.error(error);
		}
	}

	async createSession(username: string, password: string): Promise<Session> {
		password = this._passwordGenerator (password);
		try {
			const where:string = "username=\""+username+"\"";
			const res:{username:string} = await UsersServer.dbserver.select(["username"],"users",where) as {username:string};
			if(res) {
				const where:string = "username=\""+username+"\"" + "AND password=\""+password+"\"";
				const user:User = await UsersServer.dbserver.select(['*'],'users',where) as User;
				if(user) {
					const userId:string = user.userId.toString();
					const token:string = "\'" + generate({ length: 100 }) + "\'";
					const res = await UsersServer.dbserver.insert('sessions',[userId,token],['userId','token'])
					if(res) {
						const where:string = "userId=\""+user.userId+"\"";
						const session:Session = await UsersServer.dbserver.select(['*'],'sessions',where) as Session;
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
			const errorSession = NO_SESSION;
			errorSession.token = "error";
			return errorSession;
		}
	}

	async modifyUser(user: User) {
		try {
			const whereCondition = "userId="+user.userId;
			await UsersServer.dbserver.update("users",user,whereCondition);
		} catch (error) {
			console.error(error);
		}
	}

	async getUserByUsername(username: string): Promise<User> {
		try {
			const where:string = "username=\""+username+"\"";
			const user:User = await UsersServer.dbserver.select(["*"],"users",where) as User;
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
			const where:string = "email=\""+email+"\"";
			const user:User = await UsersServer.dbserver.select(["*"],"users",where) as User;
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
			const where:string = "userId=\""+userId+"\"";
			const user:User = await UsersServer.dbserver.select(["*"],"users",where) as User;
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
				const where:string = "token=\""+token+"\" AND sessionId=\""+sessionId+"\"";
				await UsersServer.dbserver.delete("session",where);
			}
			else {
				const where:string = "token=\""+token;
				await UsersServer.dbserver.delete("session",where);
			}
		} catch (error) {
			console.error(error);
		}
	}


	async getUserLastSession(userId: number): Promise<Session> {
		try {
			const where:string = "userId=\""+userId+"\"";
			const session:Session = await UsersServer.dbserver.select(["*"],"sessions",where) as Session;
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
			const where:string = "role !='{\"Mentor\":true}' AND role !='{\"Admin\":true}'";
			const users:User[] = await UsersServer.dbserver.select(["*"],"users",where) as User[];
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
			const users:User[] = await UsersServer.dbserver.select(["*"],"users") as User[];
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
			const where:string = "token=\""+token+"\"";
			const session:Session = await UsersServer.dbserver.select(["userId"],"sessions",where) as Session;
			if(session) {
				const where:string = "userId=\""+session.userId+"\"";
				const user:User = await UsersServer.dbserver.select(["*"],"users",where) as User; // where data de azi mai noua decat expirare
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


const server = Server.getInstance ();
const usersServer = UsersServer.getInstance();
const router = express.Router ();
router.use((req, res, next) => {
	(req as any).user = NO_USER;
	(req as any).token = NO_TOKEN;
	next();
});

router.post("/login", async (req, res) => {
	try {
		const session:Session = await usersServer.createSession(req.body.username, req.body.password);
		const user = await usersServer.getUserByUsername(req.body.username);
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
		// let userId = req.params.userId;
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
