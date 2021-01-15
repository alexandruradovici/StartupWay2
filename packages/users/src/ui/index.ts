import { getUi } from '@startupway/main/lib/ui';
import Login from "./views/Login.vue";
export * from "./ui";
export * from "../common/common";

console.log("running");
let main = getUi();
let routes = [
	// {
	// 	path: "*",
	// 	redirect: "/login", 
	// 	beforeEnter: (to:any, from:any, next:any) => { 
	// 		console.log(to);
	// 		console.log(window.location);
	// 		window.location.href = to.fullPath.substring(1); 
	// 	}
	// },
	{
		path: '/login',
		name:"Login",	
		component: Login
	}
]

main.registerRoutes(routes);
console.log("registered");