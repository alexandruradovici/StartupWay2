export * from "./ui";
export * from "../common";
import { UI } from "@startupway/main/lib/ui";
import { WorkspaceUI } from "@startupway/workspace/lib/ui";
import BusinnessCanvasUser from "./views/BusinnessCanvasUser.vue";
import BusinnessCanvasViewer from "./views/BusinnessCanvasViewer.vue";

import { RouteConfig } from 'vue-router';
const workspaceUi = WorkspaceUI.getInstance();
const ui = UI.getInstance();

const workspaceRoutes: RouteConfig[] = [
	{
		path: '/product/canvas',
		name:"Business Canvas",
		component: BusinnessCanvasUser
	}
];
const viewTeamRoutes: RouteConfig[] = [
	{
		path:'/viewTeam/canvas/:teamId',
		name:"Business Canvas Viewer",
		component: BusinnessCanvasViewer
	},
];

for(const route of workspaceRoutes) {
	workspaceUi.registerWorkspaceRoutes(route);
}

for(const route of viewTeamRoutes) {
	ui.registerRoute(route,"Mentored Team");
}