import Vue from "vue";
import { SnackBarOptions } from "../../common";
interface ISnackbar {
    timeout: number;
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
}
declare const _default: import("vue/types/vue").ExtendedVue<Vue, ISnackbar, {
    closeSnackbar(): void;
}, unknown, {
    options: SnackBarOptions;
    snackbar: boolean;
}>;
export default _default;
//# sourceMappingURL=SnackBar.vue?rollup-plugin-vue=script.d.ts.map