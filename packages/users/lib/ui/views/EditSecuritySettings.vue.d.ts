import Vue from "vue";
import { UI } from "@startupway/main/lib/ui";
import { SnackBarOptions } from "@startupway/menu/lib/ui";
interface EditSecuritySettings {
    ui: UI;
    snackOptions: SnackBarOptions;
    snackbar: boolean;
    extendDialog: boolean;
    loadingPage: boolean;
    showNew: boolean;
    showConfirm: boolean;
    valid: boolean;
    imgData: string | null;
    extendedImage: string | null;
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
    characterRules: ((param: string) => boolean | string)[];
    passwordRules: ((param: string) => boolean | string)[];
    emailRules: ((param: string) => boolean | string)[];
}
declare const _default: import("vue/types/vue").ExtendedVue<Vue, EditSecuritySettings, {
    back(): void;
    updateSnack(prop: boolean): void;
    extendImage(image: string | null): void;
    update(): Promise<void>;
}, {
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=EditSecuritySettings.vue?rollup-plugin-vue=script.d.ts.map