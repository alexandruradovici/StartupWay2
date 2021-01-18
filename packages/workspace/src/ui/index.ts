
export * from "./ui";
export * from "../common";
import { UI } from '@startupway/main/lib/ui';
import { WorkspaceUI } from './ui';
import store from "./store";
import { RouteConfig } from "vue-router";
import Workspace from "./views/Workspace.vue";
import Recovery from "./views/Recovery.vue";
// import UserMenu from "./views/UserMenu.vue";

// let workspaceUi = workspaceUi.getInstance()	;

// workspaceUi.registerToolbarButton (UserMenu, {
// 	position: ToolbarButtonPosition.RIGHT,
// 	priority: 3
// });

const ui = UI.getInstance();
const workspaceUI: WorkspaceUI = WorkspaceUI.getInstance();

const routes: RouteConfig[] = [{
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