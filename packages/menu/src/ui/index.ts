export * from "./ui";
export * from "../common";

import SimpleMenu from "./views/SimpleMenu.vue";
import SnackBar from "./views/SnackBar.vue";
// export { SimpleMenu, SnackBar }
import { UI } from "@startupway/main/lib/ui";
const ui = UI.getInstance();



ui.registerView(SimpleMenu);
ui.registerView(SnackBar);