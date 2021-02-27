import { Session, User } from '../common';
import { NextFunction, Request, Response } from "express";
export declare class UsersServer {
    private static INSTANCE?;
    static passwordGenerator(password: string): string;
    addUser(user: User): Promise<User | null>;
    getAllUserTeams(): Promise<User[]>;
    deleteUser(user: User): Promise<boolean>;
    createSession(username: string, password: string): Promise<Session | null>;
    modifyUser(user: User, changedPass?: string): Promise<boolean>;
    getUserByUsername(username: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(userId: string): Promise<User | null>;
    deleteSession(token: string, sessionId?: string): Promise<boolean>;
    getUserLastSession(userId: string): Promise<Session | null>;
    getUsers(): Promise<User[]>;
    getAllUsers(): Promise<User[]>;
    getSessionUser(token: string): Promise<User | null>;
    static getInstance(): UsersServer;
}
export declare function getAuthorizationFunction(): ((req: Request, res: Response, next: NextFunction) => Promise<void>) | null;
//# sourceMappingURL=server.d.ts.map