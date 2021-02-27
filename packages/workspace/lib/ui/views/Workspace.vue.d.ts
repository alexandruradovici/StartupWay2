import Vue from "vue";
import moment from "moment";
import { UI } from "@startupway/main/lib/ui";
import { ToolbarButton } from "../../common/";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    badge: any;
    role: boolean;
    userMenu: {
        title: string;
        subtitle: string;
    };
    router: boolean;
    show: boolean;
    id: number;
    tabs: {
        key: number;
        title: string;
        icon: string;
        link: string;
    }[];
    type: string;
    loadingPage: boolean;
    loading: boolean;
    logoImage: any;
}, {
    moment(): moment.Moment;
    pushToTabs(tab: {
        key: number;
        title: string;
        icon: string;
        link: string;
    }): void;
    checkRoute(): boolean;
    pushBack(): void;
}, {
    toolbarButtonsRight: ToolbarButton[];
    toolbarButtonsLeft: ToolbarButton[];
    toolbarButtons: any;
    _token: any;
    user: any;
    currentTeam: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=Workspace.vue?rollup-plugin-vue=script.d.ts.map