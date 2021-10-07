import { ToolbarButton, ToolbarButtonPosition, ToolbarButtonOptions } from "../common";
import Vue from "vue";
import { VueConstructor } from "vue";
import { UI } from "@startupway/main/lib/ui";
import { RouteConfig } from 'vue-router';
export class WorkspaceUI {
	private static instance:WorkspaceUI;
	private static ui:UI = UI.getInstance();
	debugFunction(message:string[], object:any[]):void {
		message.forEach((msg, index) => {
			console.log(msg, object[index]);
		})

	}
	registerToolbarButton(view: VueConstructor<Vue>, options: ToolbarButtonOptions = {}):void
	{
		Vue.component ((view as any ).options.name, view);
		const toolbarButton: ToolbarButton = {
			view: (view as any).options.name,
			priority: options.priority || 1,
			position: options.position || ToolbarButtonPosition.LEFT,
			action: options.action,
			visible: options.visible || (() => true),
			enabled: options.enabled || (() => true)
		};
		WorkspaceUI.ui.storeDispatch ("workspace/registerToolbarButton", toolbarButton);
	}

	registerWorkspaceRoutes (newRoute:RouteConfig):void {
		// TODO throw exception if routes are registered after the start of the application
		WorkspaceUI.ui.registerRoute(newRoute, "Workspace");
	}


	public static getInstance(): WorkspaceUI {
		if (!WorkspaceUI.instance) {
			WorkspaceUI.instance = new WorkspaceUI();
		}
		return WorkspaceUI.instance;
	}
}

const ui:WorkspaceUI = WorkspaceUI.getInstance();
export function getWorkspaceUI (): WorkspaceUI {
    return ui;
}
