
export * from "./ui";
export * from "../common/common";
import { UI } from '@startupway/main/lib/ui';
import { WorkspaceUI } from './ui';
import store from "./store";
import { RouteConfig } from "vue-router";
import Workspace from "./views/Workspace.vue";
import Recovery from "./views/Recovery.vue";

const ui = UI.getInstance();
const workspaceUI: WorkspaceUI = WorkspaceUI.getInstance();

const routes: RouteConfig[] = [
	{
		name:"workspace",
		path: '/workspace',
		children: workspaceUI.routes,
		component: Workspace
	},
	{
		path: '/recovery/:token',
		name:"Recovery",
		component: Recovery
	},
];


ui.registerRoutes(routes);
ui.registerStore("workspace",store());