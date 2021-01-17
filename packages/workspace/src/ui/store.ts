import { Module } from "vuex";
import { ToolbarButton } from "../common/common";
import { RootState} from "@startupway/users/lib/ui";

export interface WorkspaceState {
    toolbarButtons: ToolbarButton[],
}

export default function workspaceStore () {
	let store: Module<WorkspaceState, RootState> = {
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
			registerToolbarButton (store, toolbarButton: ToolbarButton) {
				store.commit ("registerToolbarButton", toolbarButton);
			},
		}
	};
	return store;
}
