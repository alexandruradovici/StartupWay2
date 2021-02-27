import Vue from "vue";
import { UI } from "@startupway/main/lib/ui";
import { BModelCanvas } from "../../common";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    checkLength: boolean;
    types: string[];
    lengthRules: ((v: string | null) => true | "Description must be 250 characters or less")[];
    loadingPage: boolean;
    edit: boolean;
    teamId: string;
    productId: string;
    canvas: BModelCanvas;
    canvases: BModelCanvas[];
    problem: string;
    segment: string;
    alternatives: string;
    adaptors: string;
    proposition: string;
    concept: string;
    solution: string;
    advantage: string;
    cost: string;
    channels: string;
    metrics: string;
    revenue: string;
}, {
    countdown(type: string, model: string): void;
    formatDate(date: Date): string;
    updateCanvas(): Promise<void>;
}, {
    currentTeam: any;
    product: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=BusinnessCanvasUser.vue?rollup-plugin-vue=script.d.ts.map