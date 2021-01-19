

import {createPool, Pool} from "mariadb";

export class MariaDBServer {
	private static INSTANCE?: MariaDBServer;
	public pool:Pool;
	constructor () {
		this.createPoolConn();
	}
    createPoolConn () {
		try {
			this.pool = createPool({
				host:process.env.DB_HOST,
				user:process.env.DB_USER,
				password:process.env.DB_PASS,
				database:process.env.DB_NAME,
				connectionLimit:5,
				rowsAsArray:false
			});
		} catch (error) {
			console.error(error);
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

import dotenv from 'dotenv';
dotenv.config();

const dbserver = MariaDBServer.getInstance();

export function getPool() {
	return dbserver.pool;
}