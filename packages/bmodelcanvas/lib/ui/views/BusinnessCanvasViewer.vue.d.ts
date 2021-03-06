import Vue from "vue";
import moment from "moment";
import { Team, Product, UserTeams } from "@startupway/teams/lib/ui";
import { User } from "@startupway/users/lib/ui";
import { BModelCanvas } from "../../common";
import { UI } from '@startupway/main/lib/ui';
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    loadingPage: boolean;
    teams: Team[] | (Team & Product)[];
    location: string;
    users: User[];
    allUsers: User[];
    teamId: string;
    team: string;
    canvases: BModelCanvas[] | null;
}, {
    moment(): moment.Moment;
    formatDate(date: Date): string;
    hasUser(user: (User & UserTeams)): boolean;
    getUsers(teamId: string): Promise<boolean>;
    getAllUsers(): Promise<boolean>;
    modifyUsers(users: (User[] | (User & UserTeams)[])): ((User & UserTeams)[] | User[]);
}, {
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=BusinnessCanvasViewer.vue?rollup-plugin-vue=script.d.ts.map