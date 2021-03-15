import { Module } from "vuex";
import { RootState } from "@startupway/users/lib/ui";
export interface UsersState {
    sortBy?: string | string[];
    sortDesc?: string | string[];
    search?: string;
    semifinalsFilter?: boolean | null;
    finalsFilter?: boolean | null;
    businessTracksFilter?: string;
    teamTypeFilter?: string;
    locationFilter?: string;
    workshopFilter?: string;
    sortByAssessment?: string | string[];
    sortDescAssessment?: string | string[];
    searchAssessment?: string;
    semifinalsFilterAssessment?: boolean | null;
    finalsFilterAssessment?: boolean | null;
    businessTracksFilterAssessment?: string;
    teamTypeFilterAssessment?: string;
    locationFilterAssessment?: string;
}
export default function usersStore(): Module<UsersState, RootState>;
//# sourceMappingURL=store.d.ts.map