import {createPool, Pool, Connection, QueryOptions} from "mariadb";
import dotenv from 'dotenv';
dotenv.config();
export class MariaDBServer {
	private static INSTANCE?: MariaDBServer;
	public pool:Pool;
	public conn:Connection;
	private constructor () {
		this.createDB().then(async (ret:boolean)=>{
			if(ret) {
				console.log("Database initialized");
			} else {
				console.log("Database not initialized");
			}
		}).catch(error => {
			console.log("Database was not initialized");
			console.error(error);
		});
	}

    private createPoolConn():boolean {
		try {
			this.pool = createPool({
				host:process.env.DB_HOST,
				user:process.env.DB_USER,
				password:process.env.DB_PASS,
				database:process.env.DB_NAME,
				connectionLimit:10,
				rowsAsArray:false
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
    private async createConn():Promise<boolean> {
		try {
			if(this.pool !== undefined) {
				this.conn = await this.pool.getConnection();
			}
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
	private async createDB():Promise<boolean> {
		try {
			const auxPool = createPool({
				host:process.env.DB_HOST,
				user:process.env.DB_USER,
				password:process.env.DB_PASS,
				connectionLimit:5,
				rowsAsArray:true
			});
			const auxConn = await auxPool.getConnection();

			let queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT schema_name FROM information_schema.schemata WHERE schema_name = :db"
			};
			let values:{db?:string,charset?:string,collate?:string} = {
				db:process.env.DB_NAME
			};

			const r:any[] = await auxConn.query(queryOptions, values);
			if(r[0] === undefined || r[0].length < 1) {
				queryOptions = {
					namedPlaceholders:true,
					sql:"CREATE DATABASE :db CHARACTER SET :charset COLLATE :collate"
				};
				values = {
					db:process.env.DB_NAME,
					charset:process.env.DB_CHARSET,
					collate:process.env.DB_COLLATE
				};
				await auxConn.query(queryOptions,values);
				const tablePool = createPool({
					host:process.env.DB_HOST,
					user:process.env.DB_USER,
					password:process.env.DB_PASS,
					database:process.env.DB_NAME,
					connectionLimit:5,
					rowsAsArray:false
				});
				const tableConn = await tablePool.getConnection();
				// TODO each package register it's table
				// users
				await tableConn.query("CREATE TABLE `users` (`userId` int(11) NOT NULL AUTO_INCREMENT,`firstName` varchar(50) NOT NULL,`lastName` varchar(50) NOT NULL,`username` varchar(120) NOT NULL,`password` varchar(90) NOT NULL,`email` varchar(100) NOT NULL,`phone` varchar(15) NOT NULL,`birthDate` datetime NOT NULL,`avatarUu` varchar(100) NOT NULL,`socialMedia` text NOT NULL,`userDetails` text NOT NULL,`role` text NOT NULL,`lastLogin` datetime NOT NULL,PRIMARY KEY (`userId`),UNIQUE KEY `username` (`username`),UNIQUE KEY `username_password` (`username`,`password`)) ENGINE=InnoDB AUTO_INCREMENT=78");
				// products
				await tableConn.query("CREATE TABLE `products` (`productId` int(11) NOT NULL AUTO_INCREMENT,`startupName` varchar(30) NOT NULL,`businessTrack` varchar(60) NOT NULL,`teamType` varchar(30) NOT NULL,`workshopDay` varchar(30) NOT NULL,`mentorId` int(11) NOT NULL,`descriptionRO` varchar(600) NOT NULL,`descriptionEN` varchar(600) NOT NULL,`pendingDescriptionRO` varchar(600) NOT NULL,`pendingDescriptionEN` varchar(600) NOT NULL,`userId` int(11) DEFAULT NULL,`productDetails` text NOT NULL,`updatedAt` timestamp NOT NULL,`lastMentorUpdate` timestamp NOT NULL,PRIMARY KEY (`productId`),UNIQUE KEY `startupName` (`startupName`),KEY `FK_99d90c2a483d79f3b627fb1d5e9` (`userId`),CONSTRAINT `FK_99d90c2a483d79f3b627fb1d5e9` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB AUTO_INCREMENT=7051999");
				// teams
				await tableConn.query("CREATE TABLE `teams` (`teamId` int(11) NOT NULL AUTO_INCREMENT,`productId` int(11) NOT NULL,`year` int(11) NOT NULL,`location` varchar(100) NOT NULL,`teamName` varchar(120) NOT NULL,`teamDetails` text NOT NULL,PRIMARY KEY (`teamId`),UNIQUE KEY `teamName` (`teamName`),UNIQUE KEY `REL_004cf2c4fc89735735b1e77a6d` (`productId`),CONSTRAINT `FK_004cf2c4fc89735735b1e77a6db` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB AUTO_INCREMENT=6");
				// sessions
				await tableConn.query("CREATE TABLE `sessions` (`userId` int(11) NOT NULL,`sessionId` int(11) NOT NULL AUTO_INCREMENT,`token` varchar(150) NOT NULL,`createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),PRIMARY KEY (`sessionId`),KEY `FK_57de40bc620f456c7311aa3a1e6` (`userId`),CONSTRAINT `FK_57de40bc620f456c7311aa3a1e6` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB AUTO_INCREMENT=714");
				// userTeams
				await tableConn.query("CREATE TABLE `userTeams` (`userProductId` int(11) NOT NULL AUTO_INCREMENT,`userId` int(11) NOT NULL,`teamId` int(11) NOT NULL,`role` varchar(10) NOT NULL,PRIMARY KEY (`userProductId`),KEY `FK_83be579ba81c5f68b6792c4fe4f` (`userId`),KEY `FK_be4217fd0c329929e298f276f3e` (`teamId`),CONSTRAINT `FK_83be579ba81c5f68b6792c4fe4f` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `FK_be4217fd0c329929e298f276f3e` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB AUTO_INCREMENT=111");
				// userActivities
				await tableConn.query("CREATE TABLE `userActivities` (`activityId` int(11) NOT NULL AUTO_INCREMENT,`userId` int(11) NOT NULL,`teamId` int(11) NOT NULL,`date` datetime NOT NULL,`description` varchar(1000) NOT NULL,`noOfHours` int(11) NOT NULL,PRIMARY KEY (`activityId`),KEY `FK_274a34b4f5e47d9ca5ddeccc922` (`userId`),KEY `FK_ba771a2ce2af5e6cfa9e552b6db` (`teamId`),CONSTRAINT `FK_274a34b4f5e47d9ca5ddeccc922` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `FK_ba771a2ce2af5e6cfa9e552b6db` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB AUTO_INCREMENT=1141");
				// bModelCanvas
				await tableConn.query("CREATE TABLE `bModelCanvas` (`modelId` int(11) NOT NULL AUTO_INCREMENT,`productId` int(11) NOT NULL,`date` datetime NOT NULL,`fields` text NOT NULL,PRIMARY KEY (`modelId`),KEY `FK_9b5ad0d5379a1f0e9165fc40408` (`productId`),CONSTRAINT `FK_9b5ad0d5379a1f0e9165fc40408` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB AUTO_INCREMENT=17");
				// workshops
				await tableConn.query("CREATE TABLE `workshops` (`workshopId` int(11) NOT NULL AUTO_INCREMENT,`workshopName` varchar(120) NOT NULL,PRIMARY KEY (`workshopId`),UNIQUE KEY `workshopName` (`workshopName`)) ENGINE=InnoDB AUTO_INCREMENT=3 ");
				// workshopInstances
				await tableConn.query("CREATE TABLE `workshopInstances` (`workshopInstanceId` int(11) NOT NULL AUTO_INCREMENT,`workshopId` int(11) NOT NULL,`teamId` int(11) NOT NULL,`trainerName` varchar(100) NOT NULL,`workshopDate` datetime NOT NULL,`workshopDetails` text NOT NULL,PRIMARY KEY (`workshopInstanceId`),UNIQUE KEY `workshopInstanceId` (`workshopInstanceId`),KEY `FK_2e20c0c8114652d2f442cedc6e1` (`workshopId`),KEY `FK_49ca002b40c714b757ae74c323a` (`teamId`),CONSTRAINT `FK_2e20c0c8114652d2f442cedc6e1` FOREIGN KEY (`workshopId`) REFERENCES `workshops` (`workshopId`) ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `FK_49ca002b40c714b757ae74c323a` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB");
				// workshopAttendances
				await tableConn.query("CREATE TABLE `workshopAttendances` (`attendanceId` int(11) NOT NULL AUTO_INCREMENT,`workshopInstanceId` int(11) NOT NULL,`attendanceDate` datetime NOT NULL,`userId` int(11) NOT NULL,PRIMARY KEY (`attendanceId`),UNIQUE KEY `attendanceId` (`attendanceId`),KEY `FK_eb9bcf0843c6ac3782a9f2fa4cf` (`workshopInstanceId`),KEY `FK_772b3a178a351d44ea62d230f53` (`userId`),CONSTRAINT `FK_772b3a178a351d44ea62d230f53` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `FK_eb9bcf0843c6ac3782a9f2fa4cf` FOREIGN KEY (`workshopInstanceId`) REFERENCES `workshopInstances` (`workshopInstanceId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB");
				// uploadDownload
				await tableConn.query("CREATE TABLE `uploadDownload` (`uuid` varchar(100) NOT NULL,`productId` int(11) NOT NULL,`fileType` varchar(255) NOT NULL,`extension` varchar(255) NOT NULL,`uploadTime` datetime NOT NULL,PRIMARY KEY (`uuid`),KEY `FK_0af268615f35d00781c400254ae` (`productId`),CONSTRAINT `FK_0af268615f35d00781c400254ae` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB");
				// recoveries
				await tableConn.query("CREATE TABLE `recoveries` (`recoveryId` int(11) NOT NULL AUTO_INCREMENT,`userId` int(11) NOT NULL,`email` varchar(100) NOT NULL,`recoveryLink` varchar(100) NOT NULL,PRIMARY KEY (`recoveryId`),UNIQUE KEY `token` (`recoveryLink`),KEY `FK_7902dfcee5a16cb1377e04d3d7a` (`userId`),CONSTRAINT `FK_7902dfcee5a16cb1377e04d3d7a` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB AUTO_INCREMENT=70");
				// feeds
				await tableConn.query("CREATE TABLE `feeds` (`feedId` int(11) NOT NULL AUTO_INCREMENT, `teamId` int(11) NOT NULL, `feedType` varchar(30) NOT NULL, `text` text NOT NULL, `date` datetime NOT NULL, PRIMARY KEY (`feedId`), KEY `FK_87caf98485e27800f1e171ccf6c` (`teamId`), CONSTRAINT `FK_87caf98485e27800f1e171ccf6c` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB AUTO_INCREMENT=63")
				await tableConn.end();
				await tablePool.end();
			}
			await auxConn.end();
			await auxPool.end();
			console.log("Database created succsessfuly");
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	public async start():Promise<boolean> {
		if(this.pool === undefined) {
			const respPool = await this.createPoolConn();
			if(respPool) {
				const respPoolConn = await this.createConn();
				if(respPoolConn) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			if(this.conn === undefined) {
				const respConn = await this.createConn();
				if(respConn) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		}
	}

	public static getInstance (): MariaDBServer
	{
		if (!this.INSTANCE)
		{
			this.INSTANCE = new MariaDBServer ();
		}
		return this.INSTANCE;
	}
}

export function getPool():Pool {
	const dbserver = MariaDBServer.getInstance();
	return dbserver.pool;
}
// const mariadbServer = MariaDBServer.getInstance();
// mariadbServer.createPoolConn();