import Vue from "vue";
import { UI } from "@startupway/main/lib/ui";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    fileImport: File;
    fileUpdate: File;
    encodedImport: boolean;
    encodedUpdate: boolean;
    base64EncodeImport: string;
    base64EncodeUpdate: string;
}, {
    submitFileImport(): Promise<void>;
    submitFileUpdate(): Promise<void>;
    toBase64Import(file: File): boolean;
    toBase64Update(file: File): boolean;
}, {
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=CSV.vue?rollup-plugin-vue=script.d.ts.map