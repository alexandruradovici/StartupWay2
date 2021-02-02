import { BusinessTrack, TeamType } from '@startupway/teams/lib/common/';
export interface Recovery {
	recoveryId:number,
	userId:number,
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
	teamId:number,
	mentorNotes:string,
	adminNotes:string,
	assessment20May:string,
	assessment12Oct:string,
	updatedAt:string,
	lastMentorUpdate:string
}

export interface ModifiedTeam {
	teamId:number,
	productId:number,
	year:number,
	location:string,
	teamName:string,
	teamDetails:{[key:string]:string},
	businessTrack:BusinessTrack,
	teamType:TeamType,
	pendingDescriptionRO: string,
	pendingDescriptionEN: string,
	updatedAt: Date,
	lastMentorUpdate: Date
}