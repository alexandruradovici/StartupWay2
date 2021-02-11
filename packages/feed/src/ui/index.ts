export * from "./ui";
export * from "../common";
import ProductFeedUser from "./views/ProductFeedUser.vue";
import ProductFeedViewer from "./views/ProductFeedViewer.vue";
import store from "./store";
import { WorkspaceUI } from "@startupway/workspace/lib/ui";
import { UI } from '@startupway/main/lib/ui';
import { RouteConfig } from 'vue-router';
const workspaceUi = WorkspaceUI.getInstance();
const ui = UI.getInstance();

const workspaceRoutes: RouteConfig[] = [
	{
		path: '/product/feed',
		name:"Product Feed",
		component: ProductFeedUser
	}
];
const viewTeamRoutes: RouteConfig[] = [
	{
		path:'/viewTeam/feed/:teamId',
		name:"Product Feed Viewer",
		component: ProductFeedViewer
	}
];

for(const route of workspaceRoutes) {
	workspaceUi.registerWorkspaceRoutes(route);
}

for(const route of viewTeamRoutes) {
	ui.registerRoute(route,"Mentored Team");
}

ui.registerStore("feed",store());