import Vue from "vue";
import moment from "moment";
import { UI } from "@startupway/main/lib/ui";
import { Team } from "../../common";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    teamId: string;
    role: boolean;
    loadingPage: boolean;
    userMenu: {
        title: string;
        subtitle: string;
    };
}, {
    moment(): moment.Moment;
}, {
    teams: Team[];
    _token: any;
    user: any;
    currentTeam: any;
    _teams: any;
    feed: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=FrontPage.vue?rollup-plugin-vue=script.d.ts.map