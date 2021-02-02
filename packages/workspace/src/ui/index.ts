
export * from "./ui";
export * from "../common";
import { UI } from '@startupway/main/lib/ui';
import store from "./store";
import { RouteConfig } from "vue-router";

import Workspace from "./views/Workspace.vue";
import Recovery from "./views/Recovery.vue";

const ui = UI.getInstance();

const routes: RouteConfig[] = [
	{
		name:"Workspace",
		path: '/workspace',
		component: Workspace
	},
	{
		path: '/recovery/:token',
		name:"Recovery",
		component: Recovery
	},
];


for(const route of routes) {
	ui.registerRoute(route);
}
ui.registerStore("workspace",store());