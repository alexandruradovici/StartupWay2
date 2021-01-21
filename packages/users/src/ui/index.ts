
export * from "./ui";
export * from "../common";
import { UI } from '@startupway/main/lib/ui';
import store from "./store";
import { RouteConfig } from "vue-router";

import Login from "./views/Login.vue";


const ui = UI.getInstance();

const routes: RouteConfig[] = [
	{
		path: '/login',
		name: "Login",
		component: Login
	},

];


ui.registerRoutes(routes);
ui.registerStore("users",store());