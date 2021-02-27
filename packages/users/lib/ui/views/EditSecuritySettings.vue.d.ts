import Vue from "vue";
import { UI } from "@startupway/main/lib/ui";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    extendDialog: boolean;
    loadingPage: boolean;
    showNew: boolean;
    showConfirm: boolean;
    valid: boolean;
    imgData: {};
    extendedImage: string;
    universities: string[];
    firstName: string;
    lastName: string;
    email: string;
    passwordNew: string;
    passwordConfirm: string;
    phone: string;
    username: string;
    date: string;
    birthDate: Date;
    facebook: string;
    linkedin: string;
    webpage: string;
    details: string;
    faculty: string;
    group: string;
    characterRules: (((f: string) => true | "Field must not contain unicode characters!") | ((f: string) => true | "Filed cannot be empty!"))[];
    passwordRules: (((p: string) => true | "Password must be at least 8 characters long!") | ((f: string) => true | "Field must not contain unicode characters!"))[];
    emailRules: (((e: string) => true | "You have entered an invalid email address!") | ((f: string) => true | "Filed cannot be empty!"))[];
}, {
    extendImage(image: string): void;
    update(): Promise<void>;
}, {
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=EditSecuritySettings.vue?rollup-plugin-vue=script.d.ts.map