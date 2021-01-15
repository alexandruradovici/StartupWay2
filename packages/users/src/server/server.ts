import { Server } from "@startupway/main/lib/server";
import express from "express";

let server = Server.getInstance ();

let router = express.Router ();

server.registerRouterAPI (1, router, "/users");
