export interface Workshop {
    workshopId: number;
    workshopName: string;
}

export interface WorkshopDetails
{
    [details: string]: any;
}

export interface WorkshopInstances {
    workshopInstanceId: number;
    workshopId: number;
    teamId: number;
    trainerName: string;
    workshopDate: Date;
    workshopDetails: WorkshopDetails;
}
export interface WorkshopInstancesExtended extends WorkshopInstances {
	
} 
export interface WorkshopAttendances {
    attendanceId: number;
    attendanceDate: Date;
    userId: number;
    workshopInstanceId: number;
}


