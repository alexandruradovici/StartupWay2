import { Module } from "vuex";
import { RootState } from "@startupway/users/lib/ui";

export interface PublicState {
	sortBy?: string | string[],
	sortDesc?: string | string[],
	search?:string,
	businessTracksFilter?:string,
	teamTypeFilter?:string,
	locationFilter?:string,
}

export default function usersStore ():Module<PublicState, RootState> {

	const store: Module<PublicState, RootState> = {
		namespaced: true,
		state: {
			sortBy: undefined,
			sortDesc: undefined,
			search: "",
			businessTracksFilter:"",
			teamTypeFilter:"",
			locationFilter:"",
		},
		getters: {
			sortBy: (state) => state.sortBy,
			sortDesc: (state) => state.sortDesc,
			search: (state) => state.search,
			businessTracksFilter: (state) => state.businessTracksFilter,
			teamTypeFilter: (state) => state.teamTypeFilter,
			locationFilter: (state) => state.locationFilter,
		},
		mutations: {
			setSortBy: (state, newSortBy: string | string[]) => {
				state.sortBy = newSortBy;
			},
			setSortDesc: (state, newSortDesc: string | string[]) => {
				state.sortDesc = newSortDesc;
			},
			setSearch: (state, newSearch: string) => {
				state.search = newSearch;
			},
			setBusinessTracksFilter: (state, newBusinessTracksFilter: string) => {
				state.businessTracksFilter = newBusinessTracksFilter;
			},
			setTeamTypeFilter: (state, newTeamTypeFilter: string) => {
				state.teamTypeFilter = newTeamTypeFilter;
			},
			setLocationFilter: (state, newLocationFilter: string) => {
				state.locationFilter = newLocationFilter;
			},
		},
		actions: {
			updateSortBy (store, newSortBy: string | string[]):void {
				store.commit ("setSortBy", newSortBy);
			},
			updateSortDesc (store, newSortDesc: string | string[]):void {
				store.commit ("setSortDesc", newSortDesc);
			},
			updateSearch (store, newSearch: string):void {
				store.commit("setSearch",newSearch)
			},
			updateBusinessTracksFilter (store, newBusinessTracksFilter: string):void {
				store.commit("setBusinessTracksFilter",newBusinessTracksFilter)
			},
			updateTeamTypeFilter (store, newTeamTypeFilter: string):void {
				store.commit("setTeamTypeFilter",newTeamTypeFilter)
			},
			updateLocationFilter (store, newLocationFilter: string):void {
				store.commit("setLocationFilter",newLocationFilter)
			},
		}
	};
	return store;
}
