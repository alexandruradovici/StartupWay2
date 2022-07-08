import { BusinessTrack, TeamType, Team, Product } from '@startupway/teams/lib/common/';
import { Workshop } from '@startupway/workshop/lib/common/';
import { User } from '@startupway/users/lib/common/';

export type TeamId = Exclude<number,0>;

export enum NotificationType {
	EMAIL = "EMAIL",
	SMS = "SMS",
	WHATSAPP = "WTS"
}
export enum MessageType {
	WELCOME = "WELCOME",
	RESETPASS = "RESETPASS",
	REQUESTUSER = "REQUESTUSER",
	NOTIFICATION = "NOTIFICATION"
} 
export interface SWNotify {
	email:string,
	notifyType:NotificationType,
	msgType:MessageType,
	text:string
	date:Date,
}
export interface ParsedCSV {
	teamId:TeamId, 
	team?:Team, 
	product?:Product, 
	user?:User,
	workshop?:Workshop
}
export interface UpdateCSV {
	teamName:string,
	location:string,
	descRO:string,
	descEN:string,
}
export interface Recovery {
	recoveryId:string,
	userId:string,
	email: string,
	recoveryLink:String
} 
export interface Review {
	location:string,
	workshopNr:string,
	mentor:string,
	teamTrack:string,
	businessTrack:string,
	startupName:string,
	description:string,
	webLink:string,
	teamId:string,
	productId:string,
	mentorNotes:string,
	adminNotes:string,
	assessmentSemifinals:boolean,
	assessmentFinals:boolean,
	updatedAt:string,
	lastMentorUpdate:string,
	logo?:string,
}

export interface ModifiedTeam {
	teamId:string,
	productId:string,
	year:number,
	location:string,
	teamName:string,
	mentor:string,
	description:string,
	teamDetails:{[key:string]:string},
	businessTrack:BusinessTrack | string,
	teamType:TeamType | string,
	pendingDescriptionRO: string,
	pendingDescriptionEN: string,
	updatedAt: Date,
	lastMentorUpdate: Date
}