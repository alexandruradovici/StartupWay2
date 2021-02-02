
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
	},
]
for(const route of workspaceRoutes) {
	workspaceUi.registerWorkspaceRoutes(route);
}

const ui = UI.getInstance();

const route: RouteConfig = {
	path: '/login',
	name: "Login",
	component: Login
};

const redirect: RouteConfig = {
	path: "/",
	redirect: "/login",
	beforeEnter: (to, from, next) => {
		window.location.href = to.fullPath.substring(1); 
	} 
};
ui.registerRoute(route);
ui.registerRoute(redirect);
ui.registerStore("users",store());