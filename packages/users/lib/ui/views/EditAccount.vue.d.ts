import Vue from "vue";
import { UI } from "@startupway/main/lib/ui";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    extendedImage: string;
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
    imageRules: ((value: File) => true | "Image size should be less than 5 MB!")[];
    characterRules: ((f: string) => true | "Filed cannot be empty!")[];
    phoneRules: ((v: string) => true | "Phone number is not valid")[];
    file: File;
    encoded: boolean;
    base64Encode: string;
    ext: string;
    profileImage: {};
    imgData: string;
    valid: boolean;
}, {
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