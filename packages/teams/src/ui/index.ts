export * from "./ui";
export * from "../common";

import BusinessCanvas from "./views/mentorViews/BusinessCanvas.vue";
import ProductDetails from "./views/mentorViews/ProductDetails.vue";
import ProductFeed from "./views/mentorViews/ProductFeed.vue";
import TeamComposition from "./views/mentorViews/TeamComposition.vue";
import UserActivities from "./views/mentorViews/UserActivities.vue";

import TeamsMenu from "./views/TeamsMenu.vue";
import ViewTeam from "./views/ViewTeams.vue";
import Summary from "./views/ProductSummary.vue";
import WeeklyUpdates from "./views/WeeklyUpdates.vue";
import Team from "./views/Team.vue";
import FrontPage from "./views/FrontPage.vue";

import store from "./store";
import { UI } from '@startupway/main/lib/ui';
import { WorkspaceUI, ToolbarButtonPosition } from '@startupway/workspace/lib/ui';
import { RouteConfig } from "vue-router";

const workspaceUi = WorkspaceUI.getInstance();
workspaceUi.registerToolbarButton (TeamsMenu, {
	position: ToolbarButtonPosition.RIGHT,
	priority: 2
});

const workspaceRoutes: RouteConfig[] = [
	{
		path: "/frontPage",
		name:"Front Page",
		component: FrontPage
	},
	{
		path:'/team',
		name:"View Team",
		component: Team
	},
	{
		path:'/team/updates',
		name:"Weekly Updates",
		component: WeeklyUpdates
	},
	{
		path:'/viewTeam/',
		name:"Mentored Team",
		children:[
			{
				path:'/viewTeam/composition/:teamId',
				name:"Team Composition",
				component: TeamComposition
			},
			{
				path:'/viewTeam/product/:teamId',
				name:"Product Details",
				component: ProductDetails
			},
			{
				path:'/viewTeam/activities/:teamId',
				name:"User Activities",
				component: UserActivities
			},
			{
				path:'/viewTeam/feed/:teamId',
				name:"Product Feed",
				component: ProductFeed
			},
			{
				path:'/viewTeam/canvas/:teamId',
				name:"Business Canvas",
				component: BusinessCanvas
			},
		],
		component: ViewTeam
	},
	{
		path: '/product/summary',
		name:"Product Summary",
		component: Summary
	}
];
for(const route of workspaceRoutes) {
	workspaceUi.registerWorkspaceRoutes(route);
}

const ui = UI.getInstance();
ui.registerStore("teams",store());