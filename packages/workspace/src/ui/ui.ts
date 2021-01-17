import { ToolbarButton, ToolbarButtonPosition, ToolbarButtonOptions } from "../common/common";
import Vue from "vue";
import { VueConstructor } from "vue";
import { UI } from "@startupway/main/lib/ui";
import { RouteConfig } from 'vue-router';
export class WorkspaceUI {
	public routes:RouteConfig[] = [];
	private static instance:WorkspaceUI;
	private static ui:UI = UI.getInstance();
	debugFunction(message:string[], object:any[]):void {
		message.forEach((msg, index) => {
			console.log(msg, object[index]);
		})
		
	}
	registerToolbarButton(view: VueConstructor<Vue>, options: ToolbarButtonOptions = {}) 
	{
		console.log ((view as any).options.name);
		Vue.component ((view as any ).options.name, view);
		let toolbarButton: ToolbarButton = {
			view: (view as any).options.name,
			priority: options.priority || 1,
			position: options.position || ToolbarButtonPosition.LEFT,
			action: options.action,
			visible: options.visible || (() => true),
			enabled: options.enabled || (() => true)
		};
		WorkspaceUI.ui.storeDispatch ("workspace/registerToolbarButton", toolbarButton);
	}

	registerWorkspaceRoutes (newRoutes: RouteConfig[]) {
		// TODO throw exception if routes are registered after the start of the application
		this.routes.push (...newRoutes);
	}
	

	public static getInstance(): WorkspaceUI {
		if(!WorkspaceUI.instance) {
			WorkspaceUI.instance = new WorkspaceUI();
		}
		return WorkspaceUI.instance;
	}
}

let ui:WorkspaceUI = WorkspaceUI.getInstance();
export function getWorkspaceUI (): WorkspaceUI {
    return ui;
}
