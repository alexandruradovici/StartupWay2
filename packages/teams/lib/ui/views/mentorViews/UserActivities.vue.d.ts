import Vue from "vue";
import { Team, Product, UserActivity } from "../../../common";
import { User, UserTeams } from "@startupway/users/lib/ui";
import moment from "moment";
import { UI } from '@startupway/main/lib/ui';
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    teams: Team[] | (Team & Product)[];
    location: string;
    activities: UserActivity[];
    weeks: UserActivity[];
    editDialog: boolean;
    viewDialog: boolean;
    users: User[];
    allUsers: User[];
    userId: string;
    teamId: string;
    edited: UserActivity | null;
    mentoredUser: {};
    team: string;
    loadingPage: boolean;
    extendedImage: string;
    extendDialog: boolean;
}, {
    extendImage(image: string): void;
    formatDate(date: Date): string;
    moment(): moment.Moment;
    hasUser(user: (User & UserTeams) | User): boolean;
    getUsers(teamId: string): Promise<boolean>;
    getAllUsers(): Promise<boolean>;
    modifyUsers(users: (User[] | (User & UserTeams)[])): (User[] | (User & UserTeams)[]);
    getUserImage(avatar: string, userId: string): Promise<string>;
    editActivity(week: UserActivity): void;
    viewActivity(week: UserActivity): void;
    saveActivity(week: UserActivity): Promise<void>;
    denyActivity(): void;
    closeView(): void;
}, {
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=UserActivities.vue?rollup-plugin-vue=script.d.ts.map