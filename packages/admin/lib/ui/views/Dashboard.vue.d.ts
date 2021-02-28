import Vue from "vue";
import moment from "moment";
import { UI } from "@startupway/main/lib/ui";
import { Team, Product, Tab } from "@startupway/teams/lib/ui";
import { ModifiedTeam, Review } from "../../common";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    changed: boolean;
    allTeams: (Team & Product)[];
    startupRules: ((value: string) => true | "Team needs a name")[];
    rulesDesc: ((value: string) => true | "Description must have at most 600 characters")[];
    drawer: boolean;
    mini: boolean;
    valid: boolean;
    validDesc: boolean;
    teamId: string;
    role: string;
    menuName: {
        title: string;
    };
    router: boolean;
    show: boolean;
    currentRoute: string;
    mentoredTeams: ModifiedTeam[];
    selectedMentoredTeam: Team;
    id: string;
    tabs: Tab[];
    editElement: boolean;
    dialog: boolean;
    team: (Team & Product) | null;
    values: ({
        text: string;
        value: boolean;
    } | {
        text: string;
        value: null;
    })[];
    teamTypes: string[];
    businessTracks: string[];
    workshopDays: never[];
    locations: string[];
    reviews: Review[];
    type: string;
    loadingPage: boolean;
    loading: boolean;
    expanded: never[];
    singleSelect: boolean;
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
    } | {
        text: string;
        value: string;
        sortable: boolean;
        align?: undefined;
    })[];
    tableOptions: {};
    existsUpdate: boolean;
    approveDescriptions: (Team & Product)[];
    updated: (Team & Product) | null;
    approveDialog: boolean;
    selectedTeam: string;
    allDescriptions: {
        [key: string]: string;
    };
}, {
    moment(): moment.Moment;
    formatDate(date: Date): string;
    openDialog(item: (Team & Product)): void;
    openForApprove(item: (Team & Product)): void;
    updateColor(item: (Team & Product)): string;
    disabledIcon(item: (Team & Product) | null): boolean;
    _enumToData(enumData: any, name: string): void;
    clearFilters(): void;
    openLink(item: Review): void;
    goToTeam(item: Review): Promise<void>;
    changeData(): Promise<void>;
    editTeam(team: Team & Product): void;
    exitDialog(): void;
    exitApproveDialog(): void;
    approveDescription(): Promise<void>;
    selectTeam(team: Team): Promise<void>;
    editProduct(team: Team): Promise<void>;
    teamActivity(team: Team): Promise<void>;
    productNewUpdates(team: Team): Promise<void>;
    openCanvas(team: Team): Promise<void>;
    modifyTeams(newTeams: (Team & Product)[]): (ModifiedTeam)[];
    pushToTabs(tab: Tab): void;
    checkRoute(): boolean;
    pushBack(): void;
    changeRoute(link: string): void;
}, {
    sortBy: string | string[];
    sortDesc: string | string[];
    search: string;
    semifinalsFilter: boolean | null;
    finalsFilter: boolean | null;
    businessTracksFilter: string;
    teamTypeFilter: string;
    locationFilter: string;
    workshopFilter: string;
    teams: Team[];
    filteredReviews: Review[];
    _token: any;
    user: any;
    currentTeam: any;
    mentoredTeam: any;
    _teams: any;
    feed: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=Dashboard.vue?rollup-plugin-vue=script.d.ts.map