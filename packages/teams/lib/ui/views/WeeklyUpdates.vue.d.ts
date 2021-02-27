import Vue from "vue";
import { UI } from '@startupway/main/lib/ui';
import { UserActivity } from "../../common";
import moment from "moment";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    loadingPage: boolean;
    activities: UserActivity[];
    teamId: string;
    userId: string;
    date: string;
    edited: UserActivity | null;
    tab: null;
    editDialog: boolean;
    viewDialog: boolean;
    hoursWorked: number;
    description: string;
    weeks: UserActivity[];
}, {
    moment(): moment.Moment;
    formatDate(date: Date): string;
    formatDateTime(date: Date): string;
    verifyDate(week: UserActivity): boolean;
    enableEdit(week: UserActivity): void;
    viewActivity(week: UserActivity): void;
    updateWeek(week: UserActivity): Promise<void>;
    denyActivity(): void;
    closeView(): void;
}, {
    currentTeam: any;
    user: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=WeeklyUpdates.vue?rollup-plugin-vue=script.d.ts.map