import { BModelCanvas } from "../common";
export declare class BModelCanvasServer {
    private static INSTANCE?;
    addCanvas(canvas: BModelCanvas): Promise<BModelCanvas | null>;
    getCanvasesForTeam(teamId: string): Promise<BModelCanvas[]>;
    static getInstance(): BModelCanvasServer;
}
//# sourceMappingURL=server.d.ts.map