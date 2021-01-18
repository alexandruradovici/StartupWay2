

import {Connection, createPool, Pool} from "mariadb";

export class DatabaseServer {
	private static INSTANCE?: DatabaseServer;
	private pool?:Pool;
	private _conn:Connection;

	public get conn():Connection {
		if(this._conn !== undefined)
			return this._conn;
		else {
			this.createConnection();
			return this._conn;
		}
	}
    createPool () {
		try {
			this.pool = createPool({
				host:process.env.DB_HOST,
				user:process.env.DB_USER,
				password:process.env.DB_PASS,
				database:process.env.DB_NAME,
				connectionLimit:5,
				rowsAsArray:false
			})
		} catch (error) {
			console.error(error);
		}
	}

    async createConnection ():Promise<void> {
		try {
			if(this.pool !== undefined) {
				this._conn = await this.pool.getConnection();
			}
		} catch (error) {
			console.error(error);
		}
	}

	async select(columns:string[], from:string, whereCondition?:string):Promise<object[]|object|undefined> {
		try {
			let query:string = "";
			if(whereCondition !== undefined) {
				query = "SELECT "+ columns.toString() + " from " + from + " where " + whereCondition;
			} else {
				query = "SELECT "+ columns.toString() + " from " + from;
			}
			const response = await this.conn.query(query);
			if(response) {
				return response[0];
			} else {
				return undefined;
			}
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	async selectInnerJoin(columns1:string[], columns2:string[], table1:string, table2:string, onCondition:string):Promise<object[]|object|undefined> {
		try {
			let query:string = "";
			columns1 = columns1.map((value)=>{ return table1+"."+value});
			columns2 = columns2.map((value)=>{ return table2+"."+value+ " as "+table2+"_"+value});
			query = "SELECT "+ columns1.toString() + columns2.toString() + " from " + table1 + " INNER JOIN " + table2 + " ON " + onCondition;
			const response = await this.conn.query(query);
			if(response) {
				return response[0];
			} else {
				return undefined;
			}
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	async insert(table:string, values:any[], columns?:string[]):Promise<object|undefined> {
		try {
			let query:string = "";
			if(columns !== undefined)
				query = "INSERT INTO "+table+" ("+JSON.stringify(columns).slice(1,-1)+") values("+JSON.stringify(values).slice(1,-1)+")";
			else
				query = "INSERT INTO "+table+" values("+JSON.stringify(values).slice(1,-1)+") ";
			const response = await this.conn.query(query);
			if(response) {
				return response;
			} else {
				return undefined;
			}
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	async update(table:string, rowObject:object, whereCondition:string):Promise<object|undefined> {
		try {
			let updateStatement:string = "";
			for(const column in rowObject) {
				const value = (rowObject as any)[column];
				if(typeof value === "number") {
					updateStatement +=column+"="+value+","
				} else {
					updateStatement +=column+"='"+value+"',"
				}
			}
			updateStatement = updateStatement.slice(0,-1);
			let query:string = "";
			query = "UPDATE " + table + " SET " + updateStatement + " WHERE " + whereCondition;

			const response = await this.conn.query(query);
			if(response) {
				return response;
			} else {
				return undefined;
			}
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}
	async delete(table:string, whereCondition:string):Promise<object|undefined> {
		try {
			let query:string = "";
			query = "DELETE FROM " + table + " WHERE " + whereCondition;

			const response = await this.conn.query(query);
			if(response) {
				return response;
			} else {
				return undefined;
			}
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	public static getInstance (): DatabaseServer
	{
		if (!this.INSTANCE)
		{
			this.INSTANCE = new DatabaseServer ();
		}
		return this.INSTANCE;
	}


}


import { Server } from "@startupway/main/lib/server";
import express from "express";
import dotenv from 'dotenv';
dotenv.config();


const server = Server.getInstance ();
const dbserver = DatabaseServer.getInstance();

dbserver.createPool();
dbserver.createConnection();
const router = express.Router ();

router.get("/get", async (req, res) => {
	res.status(200).send({});
});
server.registerRouterAPI (1, router, "/database");