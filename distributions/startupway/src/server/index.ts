
import { getServer } from "@startupway/main/lib/server";
import "@startupway/users/lib/server";
import express from "express";
import * as path from "path";
let server = getServer();
server.registerRoute (express.static (path.resolve(__dirname, "../ui")))
server.start();

