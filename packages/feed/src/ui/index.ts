export * from "./ui";
export * from "../common";
import Feed from "./views/ProductFeed.vue";
import store from "./store";
import { WorkspaceUI } from "@startupway/workspace/lib/ui";
import { UI } from '@startupway/main/lib/ui';
import { RouteConfig } from 'vue-router';
const workspaceUi = WorkspaceUI.getInstance();
const ui = UI.getInstance();

const workspaceRoutes: RouteConfig[] = [
	{
		path: '/product/feed',
		name:"Newsfeed",
		component: Feed
	}
];
ui.registerStore("feed",store());
workspaceUi.addWorkspaceRoutes(workspaceRoutes);
workspaceUi.registerWorkspaceRoutes();