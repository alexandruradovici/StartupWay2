export interface RootState {
    version: string;
}
export const universities = [
	"N/A",
	"Universitatea Politehnica Bucuresti",
	"Universitatea Politehnica Timisoara",
    "Universitatea Lucian Blaga, Sibiu",
	"Universitatea Craiova",
	"Universitatea Pitesti",
	"Universitatea Bucuresti",
	"Universitatea de Arhitectura si Urbanism Ion Mincu",
	"Universitatea Babes-Bolyai Cluj",
	"Universitatea Transilvania",
	"Universitatea Alexandru Ioan Cuza, Iasi",
	"Universitatea Ovidius",
	"Universitatea de Medicina si Farmacie Carol Davila",
	"Academia de Studii Economice",
	"Academia Tehnica Militara",
	"Academia Nationala de Informatii",
	"The Entrepreneurship Academy"
]
export interface User {
    userId: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    socialMedia: UserSocialMedia;
    birthDate: Date;
    userDetails: UserDetails;
    role: string;
    avatarUu:string;
    lastLogin: Date;

}


export interface UserTeams {
    userProductId: string,
    teamId: string,
    userId: string,
    role: string
}

export interface UserExtended extends User {
	programmingDetails:UserDetails;
}
export interface UserSocialMedia
{
    [website: string]: string;
}

export interface UserDetails
{
    [key: string]: any;
}

export interface Session {
    sessionId: string;
    token: string;
    userId: string;
    createdAt: Date;
}

export interface ErrorApi {
    err: number,
    description?: string
}

export type ServerResponse<T> = T | ErrorApi;