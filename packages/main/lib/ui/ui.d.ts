import Vue, { VueConstructor } from "vue";
import { RouteConfig } from "vue-router";
import { Module } from "vuex";
import 'vuetify/dist/vuetify.min.css';
import { AxiosInstance } from "axios";
export interface RootState {
    version: string;
}
export declare class UI {
    readonly api: AxiosInstance;
    private static instance;
    private router;
    private store;
    private vuetifyOptions;
    routes: RouteConfig[];
    private start;
    registerStore<T>(namespace: string, store: Module<T, RootState>): void;
    storeDispatch(action: string, obj: any, global?: {
        root: boolean;
    }): Promise<any>;
    registerRoute(newRoute: RouteConfig, parent?: string): void;
    registerView(view: VueConstructor<Vue>): void;
    error(err: string): void;
    static getInstance(): UI;
}
//# sourceMappingURL=ui.d.ts.map