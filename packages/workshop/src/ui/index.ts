export * from "./ui";
export * from "../common";
import Workshop from "./views/Workshop.vue";

import { WorkspaceUI } from "@startupway/workspace/lib/ui";
import { RouteConfig } from 'vue-router';
const workspaceUi = WorkspaceUI.getInstance();

const workspaceRoutes: RouteConfig[] = [
	{
		path: "/workshop",
		name:"Workshop",
		component: Workshop
	}
];

for(const route of workspaceRoutes) {
	workspaceUi.registerWorkspaceRoutes(route);
}