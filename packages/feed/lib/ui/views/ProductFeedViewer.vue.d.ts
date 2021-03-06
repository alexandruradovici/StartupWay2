import Vue from "vue";
import { Team, Product } from "@startupway/teams/lib/ui";
import { User, UserTeams } from "@startupway/users/lib/ui";
import { Feed, FeedTypes } from "../../common";
import moment from "moment";
import { UI } from '@startupway/main/lib/ui';
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    loadingPage: boolean;
    teams: Team[] | (Team & Product)[];
    location: string;
    users: (User & UserTeams)[];
    allUsers: User[];
    teamId: string;
    team: string;
    productUpdates: Feed[] | null;
    FeedTypes: typeof FeedTypes;
}, {
    moment(): moment.Moment;
    formatDate(date: Date): string;
    hasUser(user: (User & UserTeams)): boolean;
    getUsers(teamId: string): Promise<boolean>;
    getAllUsers(): Promise<boolean>;
    modifyUsers(users: (User[] | (User & UserTeams)[])): (User[] | (User & UserTeams)[]);
}, {
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=ProductFeedViewer.vue?rollup-plugin-vue=script.d.ts.map