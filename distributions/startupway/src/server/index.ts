import { Server } from "@startupway/main/lib/server";
import {MariaDBServer} from "@startupway/database/lib/server";
import path from "path";
import express from "express";

const setup = async () => {
	try {
		const mariadb = MariaDBServer.getInstance();
		const server = Server.getInstance();
		const resp = await mariadb.start();
		if(resp) {
			console.log("Connection created succsesfully");
		} else {
			console.log("Connection not created");
		}
		server.registerRouterUI (express.static (path.resolve(__dirname, "../ui")));
		await server.start();

	} catch (error) {
		console.log("Connection error");
		console.error(error);
	}
}

setup();

import "@startupway/users/lib/server";
import "@startupway/uploaddownload/lib/server";
import "@startupway/workshop/lib/server";
import "@startupway/admin/lib/server";
import "@startupway/teams/lib/server";
import "@startupway/feed/lib/server";
import "@startupway/bmodelcanvas/lib/server";