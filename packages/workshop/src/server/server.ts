import { Server,ApiRequest,ApiResponse } from "@startupway/main/lib/server";
import { getPool } from '@startupway/database/lib/server';
import { getAuthorizationFunction } from '@startupway/users/lib/server';
import { QueryOptions, PoolConnection } from 'mariadb';
import { Router } from "express";
import _ from "lodash";
import { Workshop, WorkshopInstances, WorkshopAttendances } from "../common";
// import { User } from "@startupway/users/lib/server";

export class WorkshopServer {

	private static INSTANCE?: WorkshopServer;

	async addWorkshop(workshopParam: Workshop): Promise<Workshop | null> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if (conn) {
				await conn.beginTransaction();
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"INSERT INTO workshops (workshopId, workshopName) VALUES(:workshopId,:workshopName)",
				}
				await conn.query(queryOptions,workshopParam);
				queryOptions.sql = "SELECT workshopId, workshopName FROM workshops WHERE workshopId=:workshopId";
				const response:Workshop[] = await conn.query(queryOptions,{workshopId:workshopParam.workshopId});
				if (response && response.length > 0 && response[0]) {
					await conn.commit();
					await conn.release();
					return response[0];
				} else {
					await conn.rollback();
					await conn.release();
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			if (conn) {
				await conn.rollback();
				await conn.release();
			}
			return null;
		}
	}

	async addWorkshopInstance(workshopInstance: WorkshopInstances): Promise<WorkshopInstances | null> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if (conn) {
				await conn.beginTransaction();
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"INSERT INTO workshopInstances (workshopInstanceId,workshopId,teamId,trainerName,workshopDate,workshopDetails) VALUES(:workshopInstanceId,:workshopId,:teamId,:trainerName,:workshopDate,:workshopDetails)",
				}
				await conn.query(queryOptions, workshopInstance);
				queryOptions.sql = "SELECT workshopInstanceId,workshopId,teamId,trainerName,workshopDate,workshopDetails FROM workshopInstances WHERE workshopInstanceId=:workshopInstanceId";
				const response:WorkshopInstances[] = await conn.query(queryOptions,{workshopInstanceId:workshopInstance.workshopInstanceId});
				if (response && response.length > 0 && response[0]) {
					await conn.commit();
					await conn.release();
					return response[0];
				} else {
					await conn.rollback();
					await conn.release();
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			if (conn) {
				await conn.rollback();
				await conn.release();
			}
			return null;
		}
	}

	async addWorkshopAttendance(workshopAttendance: WorkshopAttendances): Promise<WorkshopAttendances | null> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if (conn) {
				await conn.beginTransaction();
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"INSERT INTO workshopAttendances (attendanceId,attendanceDate,userId,workshopInstanceId) VALUES(:attendanceId,:attendanceDate,:userId,:workshopInstanceId)",
				}
				await conn.query(queryOptions,workshopAttendance);
				queryOptions.sql = "SELECT attendanceId,attendanceDate,userId,workshopInstanceId FROM workshopAttendances WHERE attendanceId=:attendanceId";
				const response:WorkshopAttendances[] = await conn.query(queryOptions,{attendanceId:workshopAttendance.attendanceId});
				if (response && response.length > 0 && response[0]) {
					await conn.commit();
					await conn.release();
					return response[0];
				} else {
					await conn.rollback();
					await conn.release();
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			if (conn) {
				await conn.rollback();
				await conn.release();
			}
			return null;
		}
	}

	async deleteWorkshopAttendance(attendanceId: string): Promise<boolean> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if (conn) {
				await conn.beginTransaction();
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: "DELETE FROM workshopAttendances WHERE attendanceId=:attendanceId"
				}
				await conn.query(queryOptions, {attendanceId});
				queryOptions.sql = "SELECT attendanceId as deleted_id FROM workshopAttendances WHERE attendanceId=:attendanceId";
				const response:{deleted_id:string}[] = await conn.query(queryOptions,{attendanceId});
				if (response && response.length === 0) {
					await conn.commit();
					await conn.release(); 
					return true;
				} else {
					await conn.rollback();
					await conn.release();
					return false;
				}
			} else {
				return false;
			}
		} catch (error) {
			console.error(error);
			if (conn) {
				await conn.rollback();
				await conn.release();
			}
			return false;
		}
	}

	async listWorkshops(): Promise<Workshop[]> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if (conn) {
				const queryOptions:QueryOptions = {
					sql: "SELECT workshops.* FROM workshops"
				}
				const workshops:Workshop[] = await conn.query(queryOptions) as Workshop[];
				if (workshops && workshops.length > 0) {
					await conn.release();
					return workshops;
				} else {
					await conn.release();
					return [];
				}
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			if (conn)
				await conn.release();
			return [];
		}
	}

	async listWorkshopInstancesByTeamIds(teamIds: number[]): Promise<WorkshopInstances[]> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if (conn) {
				const queryOptions:QueryOptions = {
					sql: "SELECT workshopInstances.* FROM workshopInstances WHERE workshopInstances.teamId IN (:teamIds)"
				}
				const workshops:WorkshopInstances[] = await conn.query(queryOptions,{teamIds}) as WorkshopInstances[];
				if (workshops && workshops.length > 0) {
					await conn.release();
					return workshops;
				} else {
					await conn.release();
					return [];
				}
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			if (conn)
				await conn.release();
			return [];
		}
	}

	async listWorkshopInstancesByWorkshopId(workshopId: string): Promise<WorkshopInstances[]> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if (conn) {
				const queryOptions:QueryOptions = {
					sql: "SELECT workshopInstances.* FROM workshopInstances WHERE workshopInstances.workshopId=:workshopId"
				}
				const workshopInstances:WorkshopInstances[] = await conn.query(queryOptions,{workshopId}) as WorkshopInstances[];
				if (workshopInstances && workshopInstances.length > 0) {
					await conn.release();
					return workshopInstances;
				} else {
					await conn.release();
					return [];
				}
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			if (conn)
				await conn.release();
			return [];
		}
	}

	async listWorkshopAttendances(): Promise<WorkshopAttendances[]> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if (conn) {
				const queryOptions:QueryOptions = {
					sql: "SELECT workshopAttendances.* FROM workshopAttendances"
				}
				const workshopAttendances:WorkshopAttendances[] = await conn.query(queryOptions) as WorkshopAttendances[];
				if (workshopAttendances && workshopAttendances.length > 0) {
					await conn.release();
					return workshopAttendances;
				} else {
					await conn.release();
					return [];
				}
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			if (conn)
				await conn.release();
			return [];
		}
	}

	async listWorkshopAttendancesByWorkshopId(workshopId: string): Promise<(WorkshopInstances & WorkshopAttendances)[]> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if (conn) {
				const queryOptions:QueryOptions = {
					sql: "SELECT workshopInstances.*, workshopAttendances.* FROM workshopInstances INNER JOIN ON workshopAttendances.workshopInstanceId=workshopInstances.workshopInstanceId WHERE workshopInstances.workshopId=:workshopId"
				}
				const workshopInstances:(WorkshopInstances & WorkshopAttendances)[] = await conn.query(queryOptions,{workshopId});
				if (workshopInstances && workshopInstances.length > 0) {
					await conn.release();
					return workshopInstances;
				} else {
					await conn.release();
					return [];
				}
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			if (conn)
				await conn.release();
			return [];
		}
	}

	public static getInstance (): WorkshopServer
	{
		if (!this.INSTANCE)
		{
			this.INSTANCE = new WorkshopServer ();
		}
		return this.INSTANCE;
	}

}
const router = Router();
const workshop = WorkshopServer.getInstance();

const authFunct = getAuthorizationFunction();
if (authFunct)
	router.use(authFunct);
	// Bypass params dictionary and send authorization Function

router.get("/workshops", async (req:ApiRequest<undefined>, res:ApiResponse<Workshop[]>) => {
	try {
		let workshopsList: Workshop[] = await workshop.listWorkshops();
		if (workshopsList.length > 0) {
			res.status(200).send(workshopsList);
		} else {
			res.status(201).send([]);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({err:500,data:[]});
	}
});
router.get("/attendance/:workshopId", async (req:ApiRequest<undefined>, res:ApiResponse<WorkshopAttendances[]>) => {
	try {
		let attendanceList: WorkshopAttendances[] = await workshop.listWorkshopAttendancesByWorkshopId(req.params.workshopId);
		if (attendanceList) {
			res.status(200).send(attendanceList);
		} else {
			res.status(201).send([]);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({err:500, data:[]});
	}
})
router.post("/attendance", async (req:ApiRequest<{workshopId:string,attendance:WorkshopAttendances[]}>, res:ApiResponse<WorkshopAttendances[]>) => {
	try {
		const workshopId: string = req.body.workshopId;
		const attendance: WorkshopAttendances[] = req.body.attendance;
		const currentAtteandance: WorkshopAttendances[] = await workshop.listWorkshopAttendancesByWorkshopId(workshopId);
		const toAdd: WorkshopAttendances[] = _.difference(attendance, currentAtteandance);
		const toRemove: WorkshopAttendances[] = _.difference(currentAtteandance, attendance);
		let workshopsList: WorkshopAttendances[] = [];
		for (let attended of toRemove) {
			const response = await workshop.deleteWorkshopAttendance(attended.attendanceId);
			if (response)
				workshopsList = currentAtteandance;
		}
		for (let attended of toAdd) {
			const res = await workshop.addWorkshopAttendance(attended);
			if (res)
				workshopsList.push(res);
		}
	
		if (workshopsList) {
			res.status(200).send(workshopsList);
		} else {
			res.status(201).send([]);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({err:500,data:[]});
	}
});

router.get("/mentor/instances/:workshopId", async (req:ApiRequest<undefined>, res:ApiResponse<WorkshopInstances[]>) => {
	try {
		let workshopInstancesList: WorkshopInstances[] = await workshop.listWorkshopInstancesByWorkshopId(req.params.workshopId);
		let newArray = _.groupBy(workshopInstancesList, "workshopDate");
		if (newArray) {
			res.status(200).send(newArray);
		} else {
			res.status(201).send([]);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({err:500,data:[]});
	}
});

router.post("/add", async (req:ApiRequest<Workshop>, res:ApiResponse<Workshop | null>) => {
	try {
		let newWorkshop = await workshop.addWorkshop(req.body);
		if (newWorkshop)
			res.send(newWorkshop);
		else
			res.status(401).send({err:401,data:null});
	} catch (error) {
		console.error(error);
		res.status(500).send({err:500, data:null});
	}
});
router.post("/add/instance", async (req:ApiRequest<{workshopId:string,teamIds:string[],date:Date,details:{[key:string]:any},trainer:string}>, res:ApiResponse<WorkshopInstances[]>) => {
	try {
		const workshopId = req.body.workshopId;
		const teamIds = req.body.teamIds;
		const date = req.body.date;
		const details = req.body.details;
		const trainer = req.body.trainer;
		const workshopInstances: WorkshopInstances[] = [];
		for (let team of teamIds) {
			const workshopInstance = await workshop.addWorkshopInstance(
				{
					workshopId: workshopId,
					teamId: team,
					trainerName: trainer,
					workshopDate: date,
					workshopDetails: details,
				} as WorkshopInstances
			);
			if (workshopInstance)
				workshopInstances.push(workshopInstance);
		}
		if (workshopInstances)
			res.send(workshopInstances);
		else
			res.status(401).send({err:401,data:[]});
	} catch (error) {
		console.error(error);
		res.status(500).send({err:500,data:[]});
	}
});

const server = Server.getInstance ();
server.registerRouterAPI (1, router, "/workshop");