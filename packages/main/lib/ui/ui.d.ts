import Vue, { VueConstructor } from "vue";
import { RouteConfig } from "vue-router";
import { Module } from "vuex";
import 'vuetify/dist/vuetify.min.css';
import { AxiosInstance } from "axios";
export interface RootState {
    version: string;
}
declare enum LogType {
    INFO = 0,
    WARRNING = 1,
    ERROR = 2
}
export declare class UI {
    readonly api: AxiosInstance;
    private static instance;
    private router;
    private store;
    /**
     * #01939A	#167C81	#017177	#20B5BB	#39B6BB
        Secondary Color A:
        #FFAB00	#D59B23	#C48400	#FFB92A	#FFC44C
        Secondary Color B:
        #FF0700	#D52823	#C40500	#FF302A	#FF504C
     */
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
    logEvent(pack: string, component: string, message: string, type?: LogType): void;
    static getInstance(): UI;
}
export {};
//# sourceMappingURL=ui.d.ts.map