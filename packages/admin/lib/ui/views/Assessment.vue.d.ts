import Vue from "vue";
import moment from "moment";
import { UI } from "@startupway/main/lib/ui";
import { Team, Product } from "@startupway/teams/lib/ui";
import { ModifiedTeam, Review } from "../../common";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    teamId: string;
    role: string;
    drawer: boolean;
    mini: boolean;
    router: boolean;
    show: boolean;
    currentContent: boolean;
    mentoredTeams: ModifiedTeam[];
    selectedMentoredTeam: Team;
    id: string;
    editElement: boolean;
    dialog: boolean;
    team: (Team & Product) | null;
    reviews: Review[];
    type: string;
    loadingPage: boolean;
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
    loading: boolean;
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
    teams: (Team & Product & {
        assesFinals: boolean;
        assesSemiFinals: boolean;
    })[];
}, {
    moment(): moment.Moment;
    formatDate(date: Date): string;
    openDialog(item: (Team & Product)): void;
    _enumToData(enumData: any, name: string): void;
    clearFilters(): void;
    openLink(item: Review): void;
    goToTeam(item: Review): Promise<void>;
    modifyTeams(newTeams: (Team & Product & {
        assesFinals: boolean;
        assesSemiFinals: boolean;
    })[]): (Team & Product & {
        assesFinals: boolean;
        assesSemiFinals: boolean;
    })[];
    checkRoute(): boolean;
    updateProduct(item: (Team & Product & {
        assesFinals: boolean;
        assesSemiFinals: boolean;
    })): Promise<void>;
}, {
    sortByAssessment: string | string[];
    sortDescAssessment: string | string[];
    searchAssessment: string;
    semifinalsFilterAssessment: boolean | null;
    finalsFilterAssessment: boolean | null;
    businessTracksFilterAssessment: string;
    teamTypeFilterAssessment: string;
    locationFilterAssessment: string;
    filteredTeams: (Team & Product & {
        assesFinals: boolean;
        assesSemiFinals: boolean;
    })[];
    _token: any;
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=Assessment.vue?rollup-plugin-vue=script.d.ts.map