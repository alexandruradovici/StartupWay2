
export * from "./ui";
export * from "../common/common";
import { UI } from '@startupway/main/lib/ui';
import { WorkspaceUI } from './ui';
import { ToolbarButtonPosition } from "../common/common";
import store from "./store";
import { RouteConfig } from "vue-router";

import Workspace from "./views/Workspace.vue";
import Recovery from "./views/Recovery.vue";
import UserMenu from "./views/UserMenu.vue";
import EditAccount from "./views/EditAccount.vue";
import EditSecuritySettings from "./views/EditSecuritySettings.vue";

const ui = UI.getInstance();
const workspaceUi = WorkspaceUI.getInstance();

const workspaceRoutes: RouteConfig[] = [
	{
		path: "/user/security",
		name:"Edit Security Settings",
		component: EditSecuritySettings
	},
	{
		path: "/user/account",
		name:"Edit Account",
		component: EditAccount
	}
]

workspaceUi.addWorkspaceRoutes(workspaceRoutes);

const routes: RouteConfig[] = [
	{
		name:"workspace",
		path: '/workspace',
		children: workspaceUi.routes,
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

workspaceUi.registerToolbarButton (UserMenu, {
	position: ToolbarButtonPosition.RIGHT,
	priority: 3
});