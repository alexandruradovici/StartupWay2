export interface RootState {
    version: string;
}
export declare const universities: string[];
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
    avatarUu: string;
    lastLogin: Date;
}
export interface UserTeams {
    userProductId: string;
    teamId: string;
    userId: string;
    role: string;
}
export interface UserExtended extends User {
    programmingDetails: UserDetails;
}
export interface UserSocialMedia {
    [website: string]: string;
}
export interface UserDetails {
    [key: string]: any;
}
export interface Session {
    sessionId: string;
    token: string;
    userId: string;
    createdAt: Date;
}
export interface ErrorApi {
    err: number;
    description?: string;
}
export declare type ServerResponse<T> = T | ErrorApi;
//# sourceMappingURL=index.d.ts.map