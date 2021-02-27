import { ToolbarButtonOptions } from "../common";
import Vue from "vue";
import { VueConstructor } from "vue";
import { RouteConfig } from 'vue-router';
export declare class WorkspaceUI {
    private static instance;
    private static ui;
    debugFunction(message: string[], object: any[]): void;
    registerToolbarButton(view: VueConstructor<Vue>, options?: ToolbarButtonOptions): void;
    registerWorkspaceRoutes(newRoute: RouteConfig): void;
    static getInstance(): WorkspaceUI;
}
export declare function getWorkspaceUI(): WorkspaceUI;
//# sourceMappingURL=ui.d.ts.map