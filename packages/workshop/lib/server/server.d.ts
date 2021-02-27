import { Workshop, WorkshopInstances, WorkshopAttendances } from "../common";
export declare class WorkshopServer {
    private static INSTANCE?;
    addWorkshop(workshopParam: Workshop): Promise<Workshop | null>;
    addWorkshopInstance(workshopInstance: WorkshopInstances): Promise<WorkshopInstances | null>;
    addWorkshopAttendance(workshopAttendance: WorkshopAttendances): Promise<WorkshopAttendances | null>;
    deleteWorkshopAttendance(attendanceId: string): Promise<boolean>;
    listWorkshops(): Promise<Workshop[]>;
    listWorkshopInstancesByTeamIds(teamIds: number[]): Promise<WorkshopInstances[]>;
    listWorkshopInstancesByWorkshopId(workshopId: string): Promise<WorkshopInstances[]>;
    listWorkshopAttendances(): Promise<WorkshopAttendances[]>;
    listWorkshopAttendancesByWorkshopId(workshopId: string): Promise<(WorkshopInstances & WorkshopAttendances)[]>;
    static getInstance(): WorkshopServer;
}
//# sourceMappingURL=server.d.ts.map