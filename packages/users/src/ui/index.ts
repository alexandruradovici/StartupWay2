
export * from "./ui";
export * from "../common";
import { UI } from '@startupway/main/lib/ui';
import { WorkspaceUI, ToolbarButtonPosition } from '@startupway/workspace/lib/ui';
import store from "./store";
import { RouteConfig } from "vue-router";

import Login from "./views/Login.vue";
import UserMenu from "./views/UserMenu.vue";
import EditAccount from "./views/EditAccount.vue";
import EditSecuritySettings from "./views/EditSecuritySettings.vue";

const workspaceUi = WorkspaceUI.getInstance();

workspaceUi.registerToolbarButton (UserMenu, {
	position: ToolbarButtonPosition.RIGHT,
	priority: 3
});

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
workspaceUi.registerWorkspaceRoutes();

const ui = UI.getInstance();

const routes: RouteConfig[] = [
	{
		path: '/login',
		name: "Login",
		component: Login
	},

];


ui.registerRoutes(routes);
ui.registerStore("users",store());