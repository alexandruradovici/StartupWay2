import { Pool, PoolConnection } from "mariadb";
export declare class MariaDBServer {
    private static INSTANCE?;
    pool: Pool;
    conn: PoolConnection;
    private constructor();
    private createPoolConn;
    private createDB;
    start(): Promise<boolean>;
    static getInstance(): MariaDBServer;
}
export declare function getPool(): Pool;
//# sourceMappingURL=mariadb.d.ts.map