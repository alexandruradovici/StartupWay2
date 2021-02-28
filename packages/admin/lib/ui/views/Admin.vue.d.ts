import Vue from "vue";
import { User } from "@startupway/users/lib/ui";
import { Team, Product } from "@startupway/teams/lib/ui";
import { UI } from '@startupway/main/lib/ui';
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    allUsers: User[];
    teams: (Team & Product)[];
    viewTeams: {
        name: string;
        value: string;
    }[];
    loadingPage: boolean;
}, {
    modifyUsers(users: User[]): User[];
    getAllUsers(): Promise<boolean>;
}, {
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=Admin.vue?rollup-plugin-vue=script.d.ts.map