import { ServerRoute, getServer } from "@startupway/main/lib/server";

let loginRoute: ServerRoute = {

};

getServer().registerRoute (loginRoute);