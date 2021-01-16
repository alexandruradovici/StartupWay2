import { UI } from '@startupway/main/lib/ui';
import Login from "./views/Login.vue";
import store from "./store";
export * from "./ui";
export * from "../common/common";
import { RouteConfig } from "vue-router";
console.log("running");
let ui = UI.getInstance();
let routes: RouteConfig[] = [
	{
		path: '/login',
		name: "Login",	
		component: Login
	}
];

ui.registerRoutes(routes);
ui.registerStore("users",store());