import Vue from "vue";
import { User, UserDetails } from "@startupway/users/lib/ui";
import { Team, Product } from "@startupway/teams/lib/ui";
import { Workshop, WorkshopInstances, WorkshopAttendances } from "@startupway/workshop/lib/ui";
import { UI } from '@startupway/main/lib/ui';
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    dateMenu: boolean;
    allUsers: User[];
    workshops: Workshop[];
    viewWorkshops: {
        name: string;
        value: string;
    }[];
    teams: Team[];
    viewTeams: {
        name: string;
        value: string;
    }[];
    auxViewTeams: {
        name: string;
        value: string;
    }[];
    allTeams: (Team & Product)[];
    date: string;
    instanceDialog: boolean;
    workshopDialog: boolean;
    workshop: string;
    trainer: string;
    details: string;
    workshopName: string;
    activeUsers: UserDetails;
    instances: {
        [key: string]: WorkshopInstances;
    };
    teamIds: string[];
    selected: string;
    attendance: WorkshopAttendances[];
}, {
    modifyUsers(users: User[]): User[];
    getWorkshopInstances(newWorkshopId: string): Promise<boolean>;
    getAttendance(newWorkshopId: string): Promise<boolean>;
    openWorkshopDialog(): void;
    openInstanceDialog(): void;
    addInstance(): Promise<void>;
    addWorkshop(): Promise<void>;
    deny(type: string): void;
    getAllUsers(): Promise<void>;
}, {
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=WorkshopsEdit.vue?rollup-plugin-vue=script.d.ts.map