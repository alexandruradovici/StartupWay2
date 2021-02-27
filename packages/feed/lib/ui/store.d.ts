import { Module } from "vuex";
import { Feed } from "../common";
import { RootState } from "@startupway/users/lib/ui";
export interface FeedState {
    feed: Feed[];
}
export default function feedStore(): Module<FeedState, RootState>;
//# sourceMappingURL=store.d.ts.map