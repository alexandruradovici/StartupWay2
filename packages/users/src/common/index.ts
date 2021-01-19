export const NO_TOKEN = "";
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
    userId: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    socialMedia: UserSocialMedia;
    birthDate: Date;
    userDetails: UserDetails;
    role: Roles;
    avatarUu:string;
    lastLogin: Date;

}


export interface UserTeams {
    userProductId: number,
    teamId: number,
    userId: number,
    role: string
}

export interface UserExtended extends User {
	programmingDetails:UserDetails;
}
export const NO_USER: User = {
    userId: 0,
    firstName: 'no_firstName',
    lastName: 'no_lastName',
    username: 'no_username',
    password: 'no_password',
    email: 'no_email',
    phone: 'no_phone',
    socialMedia: {},
    birthDate: new Date(),
    userDetails: {},
    role: {},
    avatarUu:"",
    lastLogin: new Date()

};
export const NO_SESSION: Session = {
    sessionId: 0,
    userId: 0,
    token:'',
    createdAt: new Date()
}
export interface UserSocialMedia
{
    [website: string]: string;
}

export interface UserDetails
{
    [key: string]: any;
}

export interface Roles
{
    [key: string]: boolean;
}

export interface Session {
    sessionId: number;
    token: string;
    userId: number;
    createdAt: Date;
}

export interface ErrorApi {
    err: number,
    description?: string
}

export type ServerResponse<T> = T | ErrorApi;