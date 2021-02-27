import { Team, UserTeams, UserActivity, Product } from "../common";
import { User } from "@startupway/users/lib/server";
export declare class TeamsServer {
    private static INSTANCE?;
    addTeam(team: Team, product: Product): Promise<Team & Product | null>;
    deleteTeam(team: Team): Promise<boolean>;
    modifyTeam(team: Team): Promise<Team | null>;
    addUserToTeam(user: User, team: Team, role: string): Promise<UserTeams | null>;
    deleteUserFromTeam(user: User, team: Team): Promise<boolean>;
    getUserTeams(userId: string): Promise<(Team & UserTeams)[]>;
    getTeams(): Promise<(Team & Product)[]>;
    getTeamsByLocation(location: string): Promise<(Team & Product)[]>;
    getTeamById(teamId: string): Promise<Team | null>;
    getTeamByProductId(productId: string): Promise<Team | null>;
    getTeamsByIdList(list: string[]): Promise<Team[]>;
    /**
        OGOR 28 49
        iccguard 35 56
        PacketCloud 36 57
        Rungutan 105 127
        Exigo 32 53
        LEDD 40 61
        Synovius 101 123
        Vatis Tech 34 55
        actevanzarimasini 26 47
        ESENCA 15 34
        ParkingWizzard 67 88
        Themis 25 46
        KidsFinance 21 42
        HereItIs 106 128
        PolyMore 89 111
        Tire2Tire 18 37
    */
    tempF(): Promise<string[]>;
    getProductById(productId: string): Promise<Product | null>;
    getUserInTeam(userId: string, teamId: string): Promise<UserTeams | null>;
    getTimestampProduct(productId: string): Promise<Product | null>;
    getTeamByYearAndLocation(year: number, location: string, teamName: string): Promise<Team | null>;
    isTeamInDate(date: string, productId: string): Promise<boolean>;
    getUsersByTeamId(teamId: string): Promise<(User & UserTeams)[]>;
    getProductByTeamId(teamId: string): Promise<Product | null>;
    getTeamAndProductByMentorId(mentorId: string): Promise<(Team & Product)[]>;
    getTeamByMentorId(mentorId: string): Promise<(Team & Product)[]>;
    getProductByMentorId(mentorId: string): Promise<Product[]>;
    updateProduct(product: Product): Promise<Product | null>;
    updateTeam(team: Team): Promise<Team | null>;
    approveDescription(product: Product): Promise<Product | null>;
    getUserActivity(userId: string, teamId: string): Promise<UserActivity[]>;
    addActivityForUser(userActivity: UserActivity): Promise<UserActivity | null>;
    modifyActivityForUser(userActivity: UserActivity): Promise<UserActivity | null>;
    updateActivity(userActivity: UserActivity): Promise<UserActivity | null>;
    updateUserTeamDetails(userTeam: UserTeams): Promise<UserTeams | null>;
    static getInstance(): TeamsServer;
}
//# sourceMappingURL=server.d.ts.map