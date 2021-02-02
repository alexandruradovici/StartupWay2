import { Server,ApiRequest,ApiResponse } from "@startupway/main/lib/server";
import { getPool } from '@startupway/database/lib/server';
import { getAuthorizationFunction } from '@startupway/users/lib/server';
import { QueryOptions, Connection } from 'mariadb';
import { Router } from "express";
import _ from "lodash";
import { Workshop, WorkshopInstances, WorkshopAttendances } from "../common";
// import { User } from "@startupway/users/lib/server";

export class WorkshopServer {

	private static INSTANCE?: WorkshopServer;
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

	async addWorkshop(workshopParam: Workshop): Promise<Workshop | null> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql:"INSERT INTO workshops (workshopName) VALUES(:workshopName)",
			}
			const response = await this.conn.query(queryOptions,workshopParam);
			if(response) {
				queryOptions.sql = "SELECT workshops.* FROM workshops WHERE workshops.workshopName=:workshopName";
				const r = await this.conn.query(queryOptions,workshopParam);
				if(r[0] !== undefined) {
					return r;
				} else {
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async addWorkshopInstance(workshopInstance: WorkshopInstances): Promise<WorkshopInstances | null> {	
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql:"INSERT INTO workshopInstances (workshopId,teamId,trainerName,workshopDate,workshopDetails) VALUES(:workshopId,:teamId,:trainerName,:workshopDate,:workshopDetails)",
			}
			const response = await this.conn.query(queryOptions,workshopInstance);
			if(response) {
				queryOptions.sql = "SELECT workshopInstances.* from workshopInstances where workshopInstances.workshopId=:workshopId";
				const r = await this.conn.query(queryOptions,workshopInstance);
				if(r[0] !== undefined) {
					return r;
				} else {
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async addWorkshopAttendance(workshopAttendance: WorkshopAttendances): Promise<WorkshopAttendances | null> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql:"INSERT INTO WorkshopAttendances (attendanceId,attendanceDate,userId,workshopInstanceId) VALUES(:attendanceId,:attendanceDate,:userId,:workshopInstanceId)",
			}
			const response = await this.conn.query(queryOptions,workshopAttendance);
			if(response) {
				queryOptions.sql = "SELECT WorkshopAttendances.* from WorkshopAttendances where WorkshopAttendances.userId=:userId";
				const r = await this.conn.query(queryOptions,workshopAttendance);
				if(r[0] !== undefined) {
					return r;
				} else {
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async deleteWorkshopAttendance(attendanceId: number): Promise<boolean> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "DELETE FROM workshopAttendances WHERE attendanceId=:attendanceId"
			}
			await this.conn.query(queryOptions,{attendanceId});
			return true;
		} catch (error) {
			// TODO add user back if failed
			console.error(error);
			return false;
		}
	}

	async listWorkshops(): Promise<Workshop[]> {
		try {
			const queryOptions:QueryOptions = {
				sql: "SELECT workshops.* FROM workshops"
			}
			const workshops:Workshop[] = await this.conn.query(queryOptions) as Workshop[];
			if(workshops) {
				return workshops;
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	async listWorkshopInstancesByTeamIds(teamIds: number[]): Promise<WorkshopInstances[]> {
		try {
			const queryOptions:QueryOptions = {
				sql: "SELECT workshopInstances.* FROM workshopInstances WHERE workshopInstances.teamId IN (:teamIds)"
			}
			const workshops:WorkshopInstances[] = await this.conn.query(queryOptions,{teamIds}) as WorkshopInstances[];
			if(workshops) {
				return workshops;
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	async listWorkshopInstancesByWorkshopId(workshopId: number): Promise<WorkshopInstances[]> {
		try {
			const queryOptions:QueryOptions = {
				sql: "SELECT workshopInstances.* FROM workshopInstances WHERE workshopInstances.workshopId=:workshopId"
			}
			const workshopInstances:WorkshopInstances[] = await this.conn.query(queryOptions,{workshopId}) as WorkshopInstances[];
			if(workshopInstances) {
				return workshopInstances;
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	async listWorkshopAttendances(): Promise<WorkshopAttendances[]> {
		try {
			const queryOptions:QueryOptions = {
				sql: "SELECT workshopAttendances.* FROM workshopAttendances"
			}
			const workshopAttendances:WorkshopAttendances[] = await this.conn.query(queryOptions) as WorkshopAttendances[];
			if(workshopAttendances) {
				return workshopAttendances;
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	async listWorkshopAttendancesByWorkshopId(workshopId: number): Promise<WorkshopAttendances[]> {
		try {
			const queryOptions:QueryOptions = {
				nestTables:"_",
				sql: "SELECT workshopInstances.*, workshopAttendances.* FROM workshopInstances INNER JOIN ON workshopAttendances.workshopInstanceId=workshopInstances.workshopInstanceId WHERE workshopInstances.workshopId=:workshopId"
			}
			// using any beacause inner join between workshopInstances + workshopAttendances
			const workshopInstances:any[] = await this.conn.query(queryOptions,{workshopId}) as WorkshopInstances[];
			if(workshopInstances) {
				return workshopInstances;
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
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
if(authFunct)
	router.use((authFunct as any));
	// Bypass params dictionary and send authorization Function

router.get("/workshops", async (req:ApiRequest<undefined>, res:ApiResponse<Workshop[]>) => {
	try {
		let workshopsList: Workshop[] = await workshop.listWorkshops();
		if (workshopsList.length > 0) {
			res.send(workshopsList);
		} else {
			res.status(401).send({err:401,data:[]});
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({err:500,data:[]});
	}
});
router.get("/attendance/:workshopId", async (req:ApiRequest<undefined>, res:ApiResponse<WorkshopAttendances[]>) => {
	try {
		let attendanceList: WorkshopAttendances[] = await workshop.listWorkshopAttendancesByWorkshopId(parseInt(req.params.workshopId));
		if (attendanceList) {
			res.send(attendanceList);
		} else {
			res.status(401).send({err:401,data:[]});
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({err:500});
	}
})
router.post("/attendance", async (req:ApiRequest<{workshopId:number,attendance:WorkshopAttendances[]}>, res:ApiResponse<WorkshopAttendances[]>) => {
	try {
		const workshopId: number = req.body.workshopId;
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
			res.send(workshopsList);
		} else {
			res.status(401).send({err:401,data:[]});
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({err:500,data:[]});
	}
});

router.get("/mentor/instances/:workshopId", async (req:ApiRequest<undefined>, res:ApiResponse<WorkshopInstances[]>) => {
	try {
		let workshopInstancesList: WorkshopInstances[] = await workshop.listWorkshopInstancesByWorkshopId(parseInt(req.params.workshopId));
		let newArray = _.groupBy(workshopInstancesList, "workshopDate");
		if (newArray) {
			res.send(newArray);
		} else {
			res.status(401).send({err:401,data:[]});
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
		res.status(500).send({err:500});
	}
});
router.post("/add/instance", async (req:ApiRequest<{workshopId:number,teamIds:number[],date:Date,details:{[key:string]:any},trainer:string}>, res:ApiResponse<WorkshopInstances[]>) => {
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