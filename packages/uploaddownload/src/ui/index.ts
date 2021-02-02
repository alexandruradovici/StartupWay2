export * from "./ui";
export * from "../common";
import SimpleImage from "./views/SimpleImage.vue";
import SimpleVideo from "./views/SimpleVideo.vue";

import { UI } from "@startupway/main/lib/ui";
const ui = UI.getInstance();
ui.registerView(SimpleImage);
ui.registerView(SimpleVideo);