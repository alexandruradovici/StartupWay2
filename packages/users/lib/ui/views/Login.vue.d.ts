import Vue from "vue";
import { UI } from "@startupway/main/lib/ui";
import { SnackBarOptions } from "@startupway/menu/lib/ui";
interface ILogin {
    ui: UI;
    login: string;
    pass: string;
    snackOptions: SnackBarOptions;
    showPassword: boolean;
    snackbar: boolean;
    dialog: boolean;
    verified: boolean;
    sent: boolean;
    email: string;
    lightOff: boolean;
    lightOn: boolean;
    aKey: string;
    loginImage: string;
    triggered: boolean;
    loadedPage: boolean;
    loadedRecaptcha: boolean;
}
declare const _default: import("vue/types/vue").ExtendedVue<Vue, ILogin, {
    update(prop: boolean): void;
    validate(response: any): void;
    resetPassword(): Promise<void>;
    loginFunction(): Promise<void>;
}, {
    _token: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=Login.vue?rollup-plugin-vue=script.d.ts.map