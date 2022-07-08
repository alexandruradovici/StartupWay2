export * from "./ui";
export * from "../common";
import { UI } from '@startupway/main/lib/ui';
import TeamProfile from "./views/TeamProfile.vue";
import PublicDashboard from "./views/PublicDashboard.vue";
import store from "./store";


const ui = UI.getInstance();
ui.registerRoute({
	path: '/public/team/:teamId/',
	name:"Team Page",
	children:[],
	component: TeamProfile
});
ui.registerRoute({
	path: '/public/:city?/:track?/:type?',
	name: "Public page",
	component: PublicDashboard
});
ui.registerStore("public",store());