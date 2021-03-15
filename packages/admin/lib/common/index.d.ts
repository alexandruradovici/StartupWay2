import { BusinessTrack, TeamType, Team, Product } from '@startupway/teams/lib/common/';
import { Workshop } from '@startupway/workshop/lib/common/';
import { User } from '@startupway/users/lib/common/';
export declare type TeamId = Exclude<number, 0>;
export interface ParsedCSV {
    teamId: TeamId;
    team?: Team;
    product?: Product;
    user?: User;
    workshop?: Workshop;
}
export interface Recovery {
    recoveryId: string;
    userId: string;
    email: string;
    recoveryLink: String;
}
export interface Review {
    location: string;
    workshopNr: string;
    mentor: string;
    teamTrack: string;
    businessTrack: string;
    startupName: string;
    description: string;
    webLink: string;
    teamId: string;
    mentorNotes: string;
    adminNotes: string;
    assessment20May: boolean;
    assessment12Oct: boolean;
    updatedAt: string;
    lastMentorUpdate: string;
}
export interface ModifiedTeam {
    teamId: string;
    productId: string;
    year: number;
    location: string;
    teamName: string;
    mentor: string;
    description: string;
    teamDetails: {
        [key: string]: string;
    };
    businessTrack: BusinessTrack | string;
    teamType: TeamType | string;
    pendingDescriptionRO: string;
    pendingDescriptionEN: string;
    updatedAt: Date;
    lastMentorUpdate: Date;
}
//# sourceMappingURL=index.d.ts.map