import { Feed } from "../common";
export declare class FeedServer {
    private static INSTANCE?;
    addFeed(feedParam: Feed): Promise<Feed | null>;
    updateFeed(feedParam: Feed): Promise<Feed | null>;
    deleteFeed(feedParam: Feed): Promise<boolean>;
    getFeedByTeamId(teamId: string): Promise<Feed[]>;
    static getInstance(): FeedServer;
}
//# sourceMappingURL=server.d.ts.map