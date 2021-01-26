import { Module } from "vuex";
import { ToolbarButton } from "../common";
import { RootState } from "@startupway/main/lib/ui";

export interface WorkspaceState {
    toolbarButtons: ToolbarButton[],
}

export default function workspaceStore ():Module<WorkspaceState, RootState> {
	const store: Module<WorkspaceState, RootState> = {
		namespaced: true,
		state: {
			toolbarButtons: []
		},
		getters: {
			toolbarButtons: (state) => state.toolbarButtons
		},
		mutations: {
			registerToolbarButton (state, toolbarButton: ToolbarButton):void {
				state.toolbarButtons.push (toolbarButton);
			},
		},
		actions: {
			registerToolbarButton (storeParam, toolbarButton: ToolbarButton):void {
				storeParam.commit ("registerToolbarButton", toolbarButton);
			},
		}
	};
	return store;
}
