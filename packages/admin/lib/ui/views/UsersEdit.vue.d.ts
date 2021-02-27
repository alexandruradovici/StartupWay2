import Vue from "vue";
import { User, UserTeams } from "@startupway/users/lib/ui";
import { UI } from "@startupway/main/lib/ui";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    allUsers: User[];
    search: string;
    dialog: boolean;
    show: boolean;
    dateMenu: boolean;
    showPass: boolean;
    roles: string[];
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
    item: User & UserTeams;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    date: Date;
    birthDate: Date;
    facebookLink: string;
    linkedinLink: string;
    webpageLink: string;
    details: string;
}, {
    formatDate(date: Date): string;
    modifyUsers(users: (User)[] | (User & UserTeams)[]): Promise<(User)[] | (User & UserTeams)[]>;
    getAllUsers(): Promise<boolean>;
    addUser(): Promise<void>;
    openDialog(user: (User & UserTeams)): void;
    editUser(): Promise<void>;
    exitDialog(): void;
}, {
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=UsersEdit.vue?rollup-plugin-vue=script.d.ts.map