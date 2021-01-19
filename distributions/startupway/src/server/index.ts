import "./script"
import { Server } from "@startupway/main/lib/server";
import "@startupway/database/lib/server";
import "@startupway/users/lib/server";
import path from "path";
import express from "express";
let server = Server.getInstance();
server.registerRouterUI (express.static (path.resolve(__dirname, "../ui")));
server.start();

