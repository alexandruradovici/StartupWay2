export enum BusinessTrack {
	NONE = "NONE",
    AGRICULTURE = "Agriculture",
    CYBERSECURITY = "CyberSecurity",
    FINTECH = "FinTech",
    HL = "Health&Lifestyle",
    RETAIL = "Retail",
    SMARTCITY = "SmartCity",
    SMARTMOBILITY = "SmartMobility",
    OTHER = "Other"
}

export enum TeamType {
	NONE = "NONE",
	SPIN = "Spin-off",
	START = "Start-up",
	SCLAE = "Scale-up"
}

export enum BucharestWorkshop {
    MONDAY="Mon",
    WEDNESDAY="Wed",
    THURSDAY="Thu",
}

export enum OthersWorkshop {
    TUESDAY="Tue",
    WEDNESDAY="Wed",
    THURSDAY="Thu",
}

export enum WorkshopDay {
	NONE = "NONE",
    MONDAY="Mon",
    TUESDAY="Tue",
    WEDNESDAY="Wed",
    THURSDAY="Thu",
    FRIDAY="Fri",
    SATURDAY="Sat",
    SUNDAY="Sun"
    
}

export interface UserActivity {
	activityId:number,
	userId:number,
	teamId:number,
	noOfHours:number,
	date: Date,
	description:string
}

export interface ProductDetails {
    [key: string]: any;
}

export interface TeamDetails
{
    [key: string]: any;
}

export interface Team {
    teamId: number,
    productId: number,
    teamName: string,
	teamDetails: TeamDetails,
	location:string,
	year:number,
    reproductId?:number
}

export interface UserTeams {
    userProductId: number,
    teamId: number,
    userId: number,
    role: string
}

export interface Product {
	productId: number,
	startupName: string,
	businessTrack: BusinessTrack,
    teamType: TeamType,
    workshopDay: WorkshopDay,
    mentorId: number,
    descriptionEN: string,
    descriptionRO: string,
    pendingDescriptionEN: string,
    pendingDescriptionRO: string,
    productDetails: ProductDetails,
    updatedAt: Date,
    lastMentorUpdate: Date
}


export interface VisualUser {
	faculty:string,
	group:string,
	participant:string,
	pitcher:string,
	transport:string,
	image:string
}