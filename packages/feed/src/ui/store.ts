import { Module } from "vuex";
import { Feed } from "../common";
import { RootState } from "@startupway/users/lib/ui";
import { UI } from "@startupway/main/lib/ui";

export interface FeedState {
	feed: Feed[],
}

export default function feedStore () {
	const ui = UI.getInstance();
	let store: Module<FeedState, RootState> = {
		namespaced: true,
		state: {
			feed: [] as Feed[]
		},
		getters: {
			feed: (state) => state.feed,

		},
		mutations: {
			setFeed(state, newFeed:Feed[]) {
				state.feed = newFeed
			}
		},
		actions: {
			async loadFeed(storeParam, teamId) {
					//TODO LOAD feed from server
					let newFeed: Feed[] = [];
					try {
						let r = await ui.api.get<Feed[]>("/api/v1/feed/"+teamId);
						newFeed = r.data;
					} catch(e) {
						console.error(e);
						return false;
					}
					storeParam.commit("setFeed", newFeed);
					return true;
			},
			async addFeed(storeParam, feed:Feed) {
				try {
					let response = await ui.api.post("/api/v1/feed/add", {feed:feed});
					if(response.status === 200) {
						return true;
					}
				} catch(e) {
					console.error(e);
					return false;
				}
			},
			async updateFeed(storeParam, feed:Feed) {
				try {
					let response = await ui.api.post("/api/v1/feed/update", {feed:feed});
					if(response.status === 200) {
						return true;
					}
				} catch(e) {
					console.error(e);
					return false;
				}
			},
			async deleteFeed(storeParam, feed:Feed) {
				try {
					let response = await ui.api.post("/api/v1/feed/delete", {feed:feed});
					if(response.status === 200) {
						return true;
					}
				} catch(e) {
					console.error(e);
					return false;
				}
			}

		}
	};
	return store;
}
