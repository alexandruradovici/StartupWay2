import { Module } from "vuex";
import { ToolbarButton } from "../common";
import { RootState } from "@startupway/main/lib/ui";
export interface WorkspaceState {
    toolbarButtons: ToolbarButton[];
}
export default function workspaceStore(): Module<WorkspaceState, RootState>;
//# sourceMappingURL=store.d.ts.map