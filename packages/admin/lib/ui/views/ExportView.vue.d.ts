import Vue from "vue";
import { Team } from "@startupway/teams/lib/ui";
import { SnackBarOptions } from "@startupway/menu/lib/ui";
import { UI } from "@startupway/main/lib/ui";
import "../style/style.css";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    city: string;
    cityExp: string;
    cities: string[];
    workshopNo: string;
    days: {
        value: string;
        text: string;
    }[];
    businessTrack: string;
    businessTracks: string[];
    semiFinals: boolean;
    finals: boolean;
    teamDate: string;
    cityDate: string;
    date: string;
    exportType: string;
    exportTypes: {
        text: string;
        value: string;
    }[];
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
    exportCEO(): Promise<void>;
    exportTeamZip(type: string, option?: string | undefined): Promise<void>;
    exportCertainZip(type: string): Promise<void>;
    exportZip(city: string): Promise<void>;
    openUrl(url: string): void;
}, {
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=ExportView.vue?rollup-plugin-vue=script.d.ts.map