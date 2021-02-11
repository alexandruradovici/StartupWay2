export interface Workshop {
    workshopId: string;
    workshopName: string;
}

export interface WorkshopDetails
{
    [details: string]: any;
}

export interface WorkshopInstances {
    workshopInstanceId: string;
    workshopId: string;
    teamId: string;
    trainerName: string;
    workshopDate: Date;
    workshopDetails: WorkshopDetails;
}
export interface WorkshopInstancesExtended extends WorkshopInstances {
	
} 
export interface WorkshopAttendances {
    attendanceId: string;
    attendanceDate: Date;
    userId: string;
    workshopInstanceId: string;
}


