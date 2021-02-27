import { Pool, Connection } from "mariadb";
export declare class MariaDBServer {
    private static INSTANCE?;
    pool: Pool;
    conn: Connection;
    private constructor();
    private createPoolConn;
    private createDB;
    start(): Promise<boolean>;
    static getInstance(): MariaDBServer;
}
export declare function getPool(): Pool;
//# sourceMappingURL=mariadb.d.ts.map