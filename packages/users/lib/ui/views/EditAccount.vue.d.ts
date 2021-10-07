import Vue from "vue";
import { UI } from "@startupway/main/lib/ui";
import { SnackBarOptions } from "@startupway/menu/lib/ui";
interface EditAccount {
    ui: UI;
    snackOptions: SnackBarOptions;
    snackbar: boolean;
    extendedImage: string | null;
    extendDialog: boolean;
    loadingPage: boolean;
    show: boolean;
    dateMenu: boolean;
    universities: string[];
    firstName: string;
    lastName: string;
    email: string;
    password: string;
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
    imageRules: ((param: File) => boolean | string)[];
    characterRules: ((param: string) => boolean | string)[];
    phoneRules: ((param: string) => boolean | string)[];
    file: File | undefined;
    encoded: boolean;
    base64Encode: string;
    ext: string;
    imgData: string | null;
    valid: boolean;
}
declare const _default: import("vue/types/vue").ExtendedVue<Vue, EditAccount, {
    updateSnack(prop: boolean): void;
    extendImage(image: string): void;
    _toBase64(file: File): boolean;
    goToSecurity(): void;
    uploadImage(): Promise<void>;
    _verifyString(check: string): boolean;
    update(): Promise<void>;
}, {
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=EditAccount.vue?rollup-plugin-vue=script.d.ts.map