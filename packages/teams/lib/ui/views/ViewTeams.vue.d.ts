import Vue from "vue";
import { UI } from "@startupway/main/lib/ui";
import { Team, Product, Tab } from "../../common";
import { User, UserTeams } from "@startupway/users/lib/ui";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    role: string;
    router: boolean;
    mentoredTeams: (Team & Product)[];
    selectedMentoredTeam: Team | (Team & Product) | undefined;
    id: string;
    tabs: Tab[];
    type: string;
    location: string;
    component: string;
    teamId: string;
    userId: string;
    teams: Team[] | (Team & Product)[];
    team: string;
    product: Product | null;
    viewTeams: {
        name: string;
        value: string;
    }[];
    selectedTeam: string;
    selected: User;
    users: (User & UserTeams)[] | User[];
    allUsers: (User & UserTeams)[] | User[];
    item: {};
    loadingPage: boolean;
    badge: any;
}, {
    pushToTabs(tab: {
        key: number;
        title: string;
        icon: string;
        link: string;
    }): void;
    changeRoute(link: string): void;
    getUsers(teamId: string): Promise<boolean>;
    hasUser(user: (User & UserTeams) | User): boolean;
    getAllUsers(): Promise<boolean>;
    modifyUsers(users: (User | (User & UserTeams))[]): (User | (User & UserTeams))[];
}, {
    user: any;
    currentTeam: any;
    mentoredTeam: any;
    toolbarButtons: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=ViewTeams.vue?rollup-plugin-vue=script.d.ts.map