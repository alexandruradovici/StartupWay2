import { BusinessTrack, TeamType } from '@startupway/teams/lib/common/';

export type TeamId = Exclude<number,0>;

export interface Profile {
	location:string,
	teamTrack:string,
	businessTrack:string,
	startupName:string,
	descriptionRO:string,
	descriptionEN:string,
	webLink:string,
	teamId:string,
	productId:string,
	productDetails: {[key:string]:string},
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