import Vue from "vue";
import { Feed, FeedTypes } from "../../common";
import { UI } from "@startupway/main/lib/ui";
import moment from "moment";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    ui: UI;
    productUpdates: Feed[];
    items: {
        name: string;
        value: FeedTypes;
    }[];
    teamId: string;
    value: string;
    text: string;
    amount: string;
    newFeedUpdate: string;
    FeedTypes: typeof FeedTypes;
    editDialog: boolean;
    loadingPage: boolean;
    edited: Feed | null;
    removeDialog: boolean;
}, {
    accept(feed: Feed): void;
    deny(): void;
    deleteFeed(feed: Feed): Promise<void>;
    updateFeed(feed: Feed): Promise<void>;
    enableEdit(feed: Feed): void;
    denyActivity(): void;
    moment(): moment.Moment;
    formatDate(date: Date): string;
    addFeed(): Promise<void>;
}, {
    currentTeam: any;
    feed: any;
}, Record<never, any>>;
export default _default;
//# sourceMappingURL=ProductFeedUser.vue?rollup-plugin-vue=script.d.ts.map