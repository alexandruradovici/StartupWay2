import Vue from "vue";
import { Workshop, WorkshopAttendances } from "../../common";
import { UserExtended, UserDetails } from "@startupway/users/lib/ui";
import { UI } from "@startupway/main/lib/ui";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    workshops: Workshop[];
    activeUsers: UserDetails;
    instances: {};
    teamIds: number[];
    teams: any;
    selected: number;
    attendance: WorkshopAttendances[];
    userRole: string;
}, {
    getWorkshopInstances(newWorkshopId: string): Promise<boolean>;
    getAttendance(newWorkshopId: string): Promise<boolean>;
    pushToAttendance(user: UserExtended, date: Date): Promise<void>;
    submitAttendance(): Promise<void>;
}, {
    currentTeam: any;
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=Workshop.vue?rollup-plugin-vue=script.d.ts.map