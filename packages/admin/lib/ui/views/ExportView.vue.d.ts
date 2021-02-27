import Vue from "vue";
import { Team } from "@startupway/teams/lib/ui";
import { SnackBarOptions } from "@startupway/menu/lib/ui";
import { UI } from "@startupway/main/lib/ui";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    preset: string;
    presetTeams: {
        text: string;
        value: number[];
    }[];
    city: string;
    cities: string[];
    teamDate: string;
    cityDate: string;
    date: string;
    dates: {
        text: string;
        value: string;
    }[];
    team: string;
    teams: Team[];
    loadingPage: boolean;
    snackOptions: SnackBarOptions;
    snackbar: boolean;
    responded: boolean;
    toStop: boolean;
    option: string;
    options: {
        text: string;
        value: string;
    }[];
}, {
    update(prop: boolean): void;
    exportTeamZip(type: string, option?: string | undefined): Promise<void>;
    exportZip(type: string): Promise<void>;
    exportUDC(): Promise<void>;
    exportTDD(): Promise<void>;
    openUrl(url: string): void;
}, {
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=ExportView.vue?rollup-plugin-vue=script.d.ts.map