import Vue from "vue";
import moment from "moment";
import { Team, Product, UserTeams } from "../../../common";
import { User } from "@startupway/users/lib/ui";
import { UI } from '@startupway/main/lib/ui';
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    productValid: boolean;
    startupRules: ((value: string) => true | "Team needs a name")[];
    rulesDesc: ((value: string) => true | "Description must have at most 600 characters")[];
    extendedImage: string;
    extendDialog: boolean;
    teams: Team[] | (Team & Product)[];
    location: string;
    users: User[];
    allUsers: User[];
    teamId: string;
    team: string;
    product: Product;
    teamTracks: never[];
    businessTracks: never[];
    teamTypes: never[];
    workshopDays: never[];
    loadingPage: boolean;
    images: {
        data: string;
        type: string;
        ext: string;
        uuid: string;
    }[];
    logo: {
        data: string;
        type: string;
        ext: string;
        uuid: string;
    };
    presVid: {
        data: string;
        type: string;
        ext: string;
        uuid: string;
    };
    demoVid: {
        data: string;
        type: string;
        ext: string;
        uuid: string;
    };
    pres: {
        data: string;
        type: string;
        ext: string;
        uuid: string;
    };
}, {
    extendImage(image: string): void;
    moment(): moment.Moment;
    _enumToData(enumData: any, name: string): void;
    hasUser(user: (User & UserTeams)): boolean;
    getUsers(teamId: string): Promise<boolean>;
    getAllUsers(): Promise<boolean>;
    modifyUsers(users: (User[] | (User & UserTeams)[])): (User[] | (User & UserTeams)[]);
    updateProduct(product: Product): Promise<void>;
    approveDescription(): Promise<void>;
    editProduct(): Promise<void>;
    download(uuid: string): Promise<void>;
}, {
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=ProductDetails.vue?rollup-plugin-vue=script.d.ts.map