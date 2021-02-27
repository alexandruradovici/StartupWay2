import Vue from "vue";
import { UI } from '@startupway/main/lib/ui';
import { SnackBarOptions } from '@startupway/menu/lib/ui';
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    login: string;
    pass: string;
    snackOptions: SnackBarOptions;
    snackbar: boolean;
    dialog: boolean;
    verified: boolean;
    sent: boolean;
    email: string;
    lightOff: boolean;
    lightOn: boolean;
    aKey: string;
    loginImage: any;
}, {
    update(prop: boolean): void;
    validate(response: any): void;
    resetPassword(): Promise<void>;
    loginFunction(): Promise<void>;
}, {
    _token: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=Login.vue?rollup-plugin-vue=script.d.ts.map