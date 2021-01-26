export * from "./ui";
export * from "../common";
import { WorkspaceUI } from "@startupway/workspace/lib/ui";
import Canvas from "./views/BusinnessCanvas.vue";;

import { RouteConfig } from 'vue-router';
const workspaceUi = WorkspaceUI.getInstance();
const workspaceRoutes: RouteConfig[] = [
	{
		path: '/product/canvas',
		name:"Lean Canvas",
		component: Canvas
	}
]
workspaceUi.addWorkspaceRoutes(workspaceRoutes);
workspaceUi.registerWorkspaceRoutes();