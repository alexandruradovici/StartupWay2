import { Module } from "vuex";
import { Team, Product } from "../common";
import { RootState } from "@startupway/users/lib/ui";
export interface TeamsState {
    currentTeam: Team | null;
    mentoredTeam: string | null;
    teams: Team[];
    product: Product | null;
}
export default function teamsStore(): Module<TeamsState, RootState>;
//# sourceMappingURL=store.d.ts.map