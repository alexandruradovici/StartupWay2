
export * from "./ui";
export * from "../common";
import { UI } from '@startupway/main/lib/ui';
import store from "./store";
import { RouteConfig } from "vue-router";

import Login from "./views/Login.vue";
// import UserMenu from "./views/UserMenu.vue";
import EditAccount from "./views/EditAccount.vue";
import EditSecuritySettings from "./views/EditSecuritySettings.vue";

// let workspaceUi = workspaceUi.getInstance()	;

// workspaceUi.registerToolbarButton (UserMenu, {
// 	position: ToolbarButtonPosition.RIGHT,
// 	priority: 3
// });

let ui = UI.getInstance();

let routes: RouteConfig[] = [
	{
		path: '/login',
		name: "Login",	
		component: Login
	},
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
	
];


ui.registerRoutes(routes);
ui.registerStore("users",store());