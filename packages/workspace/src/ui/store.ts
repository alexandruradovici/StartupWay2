import { Module } from "vuex";
import { ToolbarButton } from "../common/common";
import { RootState } from "@startupway/main/lib/ui";

export interface WorkspaceState {
    toolbarButtons: ToolbarButton[],
}

export default function workspaceStore () {
	const store: Module<WorkspaceState, RootState> = {
		namespaced: true,
		state: {
			toolbarButtons: []
		},
		getters: {
			toolbarButtons: (state) => state.toolbarButtons
		},
		mutations: {
			registerToolbarButton (state, toolbarButton: ToolbarButton) {
				state.toolbarButtons.push (toolbarButton);
			},
		},
		actions: {
			registerToolbarButton (storeParam, toolbarButton: ToolbarButton) {
				storeParam.commit ("registerToolbarButton", toolbarButton);
			},
		}
	};
	return store;
}
