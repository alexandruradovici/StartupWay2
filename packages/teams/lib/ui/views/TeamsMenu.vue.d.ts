import Vue from "vue";
import { Team } from "../../common";
import { UI } from '@startupway/main/lib/ui';
import { SnackBarOptions, SimpleMenuOptions } from "@startupway/menu/lib/ui";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    length: boolean;
    options: SimpleMenuOptions;
    snackOptions: SnackBarOptions;
    snackbar: boolean;
    img: {
        data: string;
    };
}, {
    getTeamImage(team: Team): Promise<void>;
    click(id: number): void;
    update(prop: boolean): void;
}, {
    teams: Team[];
    currentTeam: any;
    _teams: any;
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=TeamsMenu.vue?rollup-plugin-vue=script.d.ts.map