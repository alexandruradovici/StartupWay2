import { Module } from "vuex";
import { Feed } from "../common";
import { RootState } from "@startupway/users/lib/ui";
import { UI } from "@startupway/main/lib/ui";

export interface FeedState {
	feed: Feed[],
}

export default function feedStore ():Module<FeedState, RootState> {
	const ui = UI.getInstance();
	const store: Module<FeedState, RootState> = {
		namespaced: true,
		state: {
			feed: [] as Feed[]
		},
		getters: {
			feed: (state) => state.feed,

		},
		mutations: {
			setFeed(state, newFeed:Feed[]):void {
				state.feed = newFeed
			}
		},
		actions: {
			async loadFeed(storeParam, teamId):Promise<boolean> {
					// TODO LOAD feed from server
					let newFeed: Feed[] = [];
					try {
						const r = await ui.api.get<Feed[]>("/api/v1/feed/"+teamId);
						newFeed = r.data;
					} catch(e) {
						console.error(e);
						return false;
					}
					storeParam.commit("setFeed", newFeed);
					return true;
			},
			async addFeed(storeParam, feed:Feed):Promise<boolean> {
				try {
					console.log(feed);
					const response = await ui.api.post<Feed | null>("/api/v1/feed/add", feed);
					if(response.status === 200) {
						return true;
					} else {
						return false;
					}
				} catch(e) {
					console.error(e);
					return false;
				}
			},
			async updateFeed(storeParam, feed:Feed):Promise<boolean> {
				try {
					const response = await ui.api.post<Feed | null>("/api/v1/feed/update", {feed});
					if(response.status === 200) {
						return true;
					} else {
						return false;
					}
				} catch(e) {
					console.error(e);
					return false;
				}
			},
			async deleteFeed(storeParam, feed:Feed):Promise<boolean> {
				try {
					const response = await ui.api.post<boolean>("/api/v1/feed/delete", {feed});
					if(response.status === 200) {
						return true;
					} else {
						return false;
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
