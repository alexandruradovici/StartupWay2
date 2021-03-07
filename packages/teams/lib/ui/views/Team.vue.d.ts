import Vue from "vue";
import { UI } from '@startupway/main/lib/ui';
import { VisualUser } from "../../common";
import { User, UserTeams } from "@startupway/users/lib/ui";
import { SnackBarOptions } from "@startupway/menu/lib/ui";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    emailRules: (((e: string) => true | "You have entered an invalid email address!") | ((f: string) => true | "Filed cannot be empty!") | undefined)[];
    userValid: boolean;
    extendedImage: string;
    extendDialog: boolean;
    toDel: User & UserTeams;
    faculty: string;
    group: string;
    email: string;
    role: string;
    universities: string[];
    roles: string[];
    teamId: string;
    userRole: string;
    selected: never[];
    singleSelect: boolean;
    users: (User & UserTeams)[] | User[];
    search1: string;
    item: User & UserTeams & VisualUser;
    loadingPage: boolean;
    dialog: boolean;
    remove: boolean;
    add: boolean;
    allUsers: (User & UserTeams)[] | User[];
    addUsersDialog: boolean;
    acceptDialog: boolean;
    singleSelect2: boolean;
    singleSelect1: boolean;
    loading: boolean;
    toAdd: (User & UserTeams)[] | User[];
    toRemove: (User & UserTeams)[] | User[];
    headers1: ({
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
    search2: string;
    headers2: ({
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
    requestFirstName: string;
    requestLastName: string;
    requestEmail: string;
    requestDialog: boolean;
    snackOptions: SnackBarOptions;
    snackbar: boolean;
}, {
    extendImage(image: string): void;
    modifyUsers(users: ((User & UserTeams)[] | User[])): Promise<(User & UserTeams)[] | User[]>;
    getUserImage(avatar: string, userId: string): Promise<string>;
    hasUser(user: User | (User & UserTeams)): boolean;
    getAllUsers(): Promise<boolean>;
    removeUsers(): Promise<void>;
    getUsers(teamId: string): Promise<boolean>;
    updateUserInfo(userParam?: (User & UserTeams & VisualUser) | undefined): Promise<void>;
    openDialog(user: any): void;
    openRequestDialog(): void;
    exitDialog(): void;
    openLink(link: string): void;
    requestUser(): Promise<void>;
    addUsers(): Promise<void>;
    accept(type: string): void;
    deny(): void;
    cancel(): void;
    update(prop: boolean): void;
    refreshLists(): Promise<boolean>;
}, {
    currentTeam: any;
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=Team.vue?rollup-plugin-vue=script.d.ts.map