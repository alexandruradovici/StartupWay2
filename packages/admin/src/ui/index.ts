export * from "./ui";
export * from "../common";
import { RouteConfig } from "vue-router";
import { WorkspaceUI, ToolbarButtonPosition } from '@startupway/workspace/lib/ui';

import Admin from "./views/Admin.vue";
import UsersEdit from "./views/UsersEdit.vue";
import TeamsEdit from "./views/TeamsEdit.vue";
import CSV from "./views/CSV.vue";
import WorkshopsEdit from "./views/WorkshopsEdit.vue";
import AdminMenu from "./views/AdminMenu.vue";
import ExportView from "./views/ExportView.vue";
import Dashboard from "./views/Dashboard.vue";

const workspaceUi = WorkspaceUI.getInstance();
workspaceUi.registerToolbarButton (AdminMenu, {
	position: ToolbarButtonPosition.RIGHT,
	priority: 4
});

let routes:RouteConfig[] = [];
routes.push(
	{
		path:'/admin/users',
		name:"Admin - Users",
		component:UsersEdit
	},
	{
		path:'/admin/exports',
		name:"Admin - Exports",
		component:ExportView
	},
	{
		path:'/admin/workshops',
		name:"Admin - Workshops",
		component:WorkshopsEdit
	},
	{
		path:'/admin/teams',
		name:"Admin - Teams",
		component:TeamsEdit
	},
	{
		path: "/csv",
		name:"CSV Upload",
		component: CSV
	}
);

const workspaceRoutes: RouteConfig[] = [
	{
		path: '/admin',
		name:"Admin",
		children:routes,
		component: Admin
	},
	{
		path: '/dashboard',
		name:"Dashboard",
		children:[],
		component: Dashboard
	}
]
for(const route of workspaceRoutes) {
	workspaceUi.registerWorkspaceRoutes(route);
}