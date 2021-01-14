//import express from "express";
export class UsersServer {
    async start (port:number = 8080):Promise<void> {
		
	}
	
}

const SERVER = new UsersServer ();

export function getUsersServer (): UsersServer {
    return SERVER;
}
