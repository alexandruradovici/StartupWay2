import Vue from "vue";
import { User, UserTeams } from "@startupway/users/lib/ui";
import { Team } from "@startupway/teams/lib/ui";
import { UI } from "@startupway/main/lib/ui";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    teams: Team[];
    viewTeams: {
        name: string;
        value: string;
    }[];
    users: (User & UserTeams)[];
    selectedTeam: string;
    search: string;
    headers: ({
        text: string;
        align: string;
        sortable: boolean;
        value: string;
    } | {
        text: string;
        value: string;
        align?: undefined;
        sortable?: undefined;
    })[];
}, {
    getUsers(teamId: string): Promise<void>;
}, {
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=TeamsEdit.vue?rollup-plugin-vue=script.d.ts.map