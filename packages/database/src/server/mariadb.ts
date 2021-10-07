import {createPool, Pool, PoolConnection, QueryOptions} from "mariadb";
import dotenv from 'dotenv';
dotenv.config();
import { DB_NAME, DB_COLLATE, DB_CHARSET } from './tables';
export class MariaDBServer {
	private static INSTANCE?: MariaDBServer;
	public pool:Pool;
	public conn:PoolConnection;
	private constructor () {
		this.createDB().then(async (ret:boolean)=>{
			if (ret) {
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
				idleTimeout: 0,
				rowsAsArray:false
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
    // private async createConn():Promise<boolean> {
	// 	try {
	// 		if (this.pool !== undefined) {
	// 			this.conn = await this.pool.getConnection();
	// 		}
	// 		return true;
	// 	} catch (error) {
	// 		console.error(error);
	// 		return false;
	// 	}
	// }
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
				sql: `SELECT schema_name FROM information_schema.schemata WHERE schema_name = :db`
			};
			// Get DB schemba name 
			const r:any[] = await auxConn.query(queryOptions, {db:process.env.DB_NAME});
			if (r[0] === undefined || r[0].length < 1) {
				queryOptions = {
					namedPlaceholders:true,
					sql:`CREATE DATABASE ${DB_NAME} CHARACTER SET ${DB_CHARSET} COLLATE ${DB_COLLATE}`
				};
				await auxConn.query(queryOptions);
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
				await tableConn.query("CREATE TABLE `users` (`userId` varchar(100) NOT NULL, `firstName` varchar(50) NOT NULL,`lastName` varchar(50) NOT NULL,`username` varchar(120) NOT NULL,`password` varchar(90) NOT NULL,`email` varchar(100) NOT NULL,`phone` varchar(15) NOT NULL,`birthDate` datetime NOT NULL,`avatarUu` varchar(100) NOT NULL,`socialMedia` text NOT NULL,`userDetails` text NOT NULL,`role` text NOT NULL,`lastLogin` datetime NOT NULL,PRIMARY KEY (`userId`),UNIQUE KEY `username` (`username`),UNIQUE KEY `username_password` (`username`,`password`)) ENGINE=InnoDB");
				// products
				await tableConn.query("CREATE TABLE `products` (`productId` varchar(100) NOT NULL, `startupName` varchar(30) NOT NULL,`businessTrack` varchar(60) NOT NULL,`teamType` varchar(30) NOT NULL,`workshopDay` varchar(30) NOT NULL,`mentorId` varchar(100) NOT NULL,`descriptionRO` varchar(600) NOT NULL,`descriptionEN` varchar(600) NOT NULL,`pendingDescriptionRO` varchar(600) NOT NULL,`pendingDescriptionEN` varchar(600) NOT NULL,`userId` varchar(100) DEFAULT NULL,`productDetails` text NOT NULL,`updatedAt` timestamp NOT NULL,`lastMentorUpdate` timestamp NOT NULL,PRIMARY KEY (`productId`),UNIQUE KEY `startupName` (`startupName`),KEY `FK_99d90c2a483d79f3b627fb1d5e9` (`userId`),CONSTRAINT `FK_99d90c2a483d79f3b627fb1d5e9` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB");
				// teams
				await tableConn.query("CREATE TABLE `teams` (`teamId` varchar(100) NOT NULL, `productId` varchar(100) NOT NULL,`year` int(11) NOT NULL,`location` varchar(100) NOT NULL,`teamName` varchar(120) NOT NULL,`teamDetails` text NOT NULL,PRIMARY KEY (`teamId`),UNIQUE KEY `teamName` (`teamName`),UNIQUE KEY `REL_004cf2c4fc89735735b1e77a6d` (`productId`),CONSTRAINT `FK_004cf2c4fc89735735b1e77a6db` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB");
				// sessions
				await tableConn.query("CREATE TABLE `sessions` (`userId` varchar(100) NOT NULL,`sessionId` varchar(100) NOT NULL, `token` varchar(150) NOT NULL,`createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),PRIMARY KEY (`sessionId`),KEY `FK_57de40bc620f456c7311aa3a1e6` (`userId`),CONSTRAINT `FK_57de40bc620f456c7311aa3a1e6` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB");
				// userTeams
				await tableConn.query("CREATE TABLE `userTeams` (`userProductId` varchar(100) NOT NULL, `userId` varchar(100) NOT NULL,`teamId` varchar(100) NOT NULL,`role` varchar(10) NOT NULL,PRIMARY KEY (`userProductId`),KEY `FK_83be579ba81c5f68b6792c4fe4f` (`userId`),KEY `FK_be4217fd0c329929e298f276f3e` (`teamId`),CONSTRAINT `FK_83be579ba81c5f68b6792c4fe4f` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `FK_be4217fd0c329929e298f276f3e` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB");
				// userActivities
				await tableConn.query("CREATE TABLE `userActivities` (`activityId` varchar(100) NOT NULL, `userId` varchar(100) NOT NULL,`teamId` varchar(100) NOT NULL,`date` datetime NOT NULL,`description` varchar(1000) NOT NULL,`noOfHours` int(11) NOT NULL,PRIMARY KEY (`activityId`),KEY `FK_274a34b4f5e47d9ca5ddeccc922` (`userId`),KEY `FK_ba771a2ce2af5e6cfa9e552b6db` (`teamId`),CONSTRAINT `FK_274a34b4f5e47d9ca5ddeccc922` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `FK_ba771a2ce2af5e6cfa9e552b6db` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB");
				// bModelCanvas
				await tableConn.query("CREATE TABLE `bModelCanvas` (`modelId` varchar(100) NOT NULL, `productId` varchar(100) NOT NULL,`date` datetime NOT NULL,`fields` text NOT NULL,PRIMARY KEY (`modelId`),KEY `FK_9b5ad0d5379a1f0e9165fc40408` (`productId`),CONSTRAINT `FK_9b5ad0d5379a1f0e9165fc40408` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB");
				// workshops
				await tableConn.query("CREATE TABLE `workshops` (`workshopId` varchar(100) NOT NULL, `workshopName` varchar(120) NOT NULL,PRIMARY KEY (`workshopId`),UNIQUE KEY `workshopName` (`workshopName`)) ENGINE=InnoDB ");
				// workshopInstances
				await tableConn.query("CREATE TABLE `workshopInstances` (`workshopInstanceId` varchar(100) NOT NULL, `workshopId` varchar(100) NOT NULL,`teamId` varchar(100) NOT NULL,`trainerName` varchar(100) NOT NULL,`workshopDate` datetime NOT NULL,`workshopDetails` text NOT NULL,PRIMARY KEY (`workshopInstanceId`),UNIQUE KEY `workshopInstanceId` (`workshopInstanceId`),KEY `FK_2e20c0c8114652d2f442cedc6e1` (`workshopId`),KEY `FK_49ca002b40c714b757ae74c323a` (`teamId`),CONSTRAINT `FK_2e20c0c8114652d2f442cedc6e1` FOREIGN KEY (`workshopId`) REFERENCES `workshops` (`workshopId`) ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `FK_49ca002b40c714b757ae74c323a` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB");
				// workshopAttendances
				await tableConn.query("CREATE TABLE `workshopAttendances` (`attendanceId` varchar(100) NOT NULL, `workshopInstanceId` varchar(100) NOT NULL,`attendanceDate` datetime NOT NULL,`userId` varchar(100) NOT NULL,PRIMARY KEY (`attendanceId`),UNIQUE KEY `attendanceId` (`attendanceId`),KEY `FK_eb9bcf0843c6ac3782a9f2fa4cf` (`workshopInstanceId`),KEY `FK_772b3a178a351d44ea62d230f53` (`userId`),CONSTRAINT `FK_772b3a178a351d44ea62d230f53` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `FK_eb9bcf0843c6ac3782a9f2fa4cf` FOREIGN KEY (`workshopInstanceId`) REFERENCES `workshopInstances` (`workshopInstanceId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB");
				// uploadDownload
				await tableConn.query("CREATE TABLE `uploadDownload` (`uuid` varchar(100) NOT NULL,`productId` varchar(100) NOT NULL,`fileType` varchar(255) NOT NULL,`extension` varchar(255) NOT NULL,`uploadTime` datetime NOT NULL,PRIMARY KEY (`uuid`),KEY `FK_0af268615f35d00781c400254ae` (`productId`),CONSTRAINT `FK_0af268615f35d00781c400254ae` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB");
				// recoveries
				await tableConn.query("CREATE TABLE `recoveries` (`recoveryId` varchar(100) NOT NULL, `userId` varchar(100) NOT NULL,`email` varchar(100) NOT NULL,`recoveryLink` varchar(100) NOT NULL,PRIMARY KEY (`recoveryId`),UNIQUE KEY `token` (`recoveryLink`),KEY `FK_7902dfcee5a16cb1377e04d3d7a` (`userId`),CONSTRAINT `FK_7902dfcee5a16cb1377e04d3d7a` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB");
				// feeds
				await tableConn.query("CREATE TABLE `feeds` (`feedId` varchar(100) NOT NULL,  `teamId` varchar(100) NOT NULL, `feedType` varchar(30) NOT NULL, `text` text NOT NULL, `date` datetime NOT NULL, PRIMARY KEY (`feedId`), KEY `FK_87caf98485e27800f1e171ccf6c` (`teamId`), CONSTRAINT `FK_87caf98485e27800f1e171ccf6c` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB")
				// notifications
				await tableConn.query("CREATE TABLE `notifications` (`email` varchar(100) NOT NULL,  `notifyType` varchar(30) NOT NULL, `msgType` varchar(30) NOT NULL, `text` text NOT NULL, `date` datetime NOT NULL, PRIMARY KEY (`email`,`msgType`,`notifyType`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB")

				await tableConn.release();
				await tablePool.end();

				console.log("Database created succsessfuly");
			}

			await auxConn.release();
			await auxPool.end();

			const respPool = await this.createPoolConn();
			if (respPool)
				return true;
			else
				return false;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	public async start():Promise<boolean> {
		if (this.pool === undefined) {
			const respPool = await this.createPoolConn();
			if (respPool) {
				// const respPoolConn = await this.createConn();
				// if (respPoolConn) {
				return true;
				// } else {
				// 	return false;
				// }
			} else {
				return false;
			}
		}
		return false;
		// else {
		// 	if (this.conn === undefined) {
		// 		const respConn = await this.createConn();
		// 		if (respConn) {
		// 			return true;
		// 		} else {
		// 			return false;
		// 		}
		// 	} else {
		// 		return true;
		// 	}
		// }
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