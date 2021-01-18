export * from "./ui";
export * from "../common";

import SimpleMenu from "./views/SimpleMenu.vue";
import SnackBar from "./views/SnackBar.vue";
import { UI } from "@startupway/main/lib/ui";

let ui = UI.getInstance();

ui.registerView(SimpleMenu);
ui.registerView(SnackBar);