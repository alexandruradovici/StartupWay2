import { Module } from "vuex";
import { RootState } from "@startupway/users/lib/ui";

export interface UsersState {
	sortBy?: string | string[],
	sortDesc?: string | string[],
	search?:string,
	semifinalsFilter?:boolean | null,
	finalsFilter?:boolean | null,
	businessTracksFilter?:string,
	teamTypeFilter?:string,
	locationFilter?:string,
	workshopFilter?:string,
	sortByAssessment?: string | string[],
	sortDescAssessment?: string | string[],
	searchAssessment?:string,
	semifinalsFilterAssessment?:boolean | null,
	finalsFilterAssessment?:boolean | null,
	businessTracksFilterAssessment?:string,
	teamTypeFilterAssessment?:string,
	locationFilterAssessment?:string
}

export default function usersStore ():Module<UsersState, RootState> {

	const store: Module<UsersState, RootState> = {
		namespaced: true,
		state: {
			sortBy: undefined,
			sortDesc: undefined,
			search: "",
			semifinalsFilter:null,
			finalsFilter:null,
			businessTracksFilter:"",
			teamTypeFilter:"",
			locationFilter:"",
			workshopFilter:"",
			sortByAssessment: undefined,
			sortDescAssessment: undefined,
			searchAssessment: "",
			semifinalsFilterAssessment:null,
			finalsFilterAssessment:null,
			businessTracksFilterAssessment:"",
			teamTypeFilterAssessment:"",
			locationFilterAssessment:""
		},
		getters: {
			sortBy: (state) => state.sortBy,
			sortDesc: (state) => state.sortDesc,
			search: (state) => state.search,
			semifinalsFilter: (state) => state.semifinalsFilter,
			finalsFilter: (state) => state.finalsFilter,
			businessTracksFilter: (state) => state.businessTracksFilter,
			teamTypeFilter: (state) => state.teamTypeFilter,
			locationFilter: (state) => state.locationFilter,
			workshopFilter: (state) => state.workshopFilter,
			sortByAssessment: (state) => state.sortByAssessment,
			sortDescAssessment: (state) => state.sortDescAssessment,
			searchAssessment: (state) => state.searchAssessment,
			semifinalsFilterAssessment: (state) => state.semifinalsFilterAssessment,
			finalsFilterAssessment: (state) => state.finalsFilterAssessment,
			businessTracksFilterAssessment: (state) => state.businessTracksFilterAssessment,
			teamTypeFilterAssessment: (state) => state.teamTypeFilterAssessment,
			locationFilterAssessment: (state) => state.locationFilterAssessment
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
			setSemifinalsFilter: (state, newSemifinalsFilter: boolean | null) => {
				state.semifinalsFilter = newSemifinalsFilter;
			},
			setFinalsFilter: (state, newFinalsFilter: boolean | null) => {
				state.finalsFilter = newFinalsFilter;
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
			setWorkshopFilter: (state, newWorkshopFilter: string) => {
				state.workshopFilter = newWorkshopFilter;
			},
			setAssessmentSortBy: (state, newSortBy: string | string[]) => {
				state.sortByAssessment = newSortBy;
			},
			setAssessmentSortDesc: (state, newSortDesc: string | string[]) => {
				state.sortDescAssessment = newSortDesc;
			},
			setAssessmentSearch: (state, newSearch: string) => {
				state.searchAssessment = newSearch;
			},
			setAssessmentSemifinalsFilter: (state, newSemifinalsFilter: boolean | null) => {
				state.semifinalsFilterAssessment = newSemifinalsFilter;
			},
			setAssessmentFinalsFilter: (state, newFinalsFilter: boolean | null) => {
				state.finalsFilterAssessment = newFinalsFilter;
			},
			setAssessmentBusinessTracksFilter: (state, newBusinessTracksFilter: string) => {
				state.businessTracksFilterAssessment = newBusinessTracksFilter;
			},
			setAssessmentTeamTypeFilter: (state, newTeamTypeFilter: string) => {
				state.teamTypeFilterAssessment = newTeamTypeFilter;
			},
			setAssessmentLocationFilter: (state, newLocationFilter: string) => {
				state.locationFilterAssessment = newLocationFilter;
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
			updateSemifinalsFilter (store, newSemifinalsFilter: string):void {
				store.commit("setSemifinalsFilter",newSemifinalsFilter)
			},
			updateFinalsFilter (store, newFinalsFilter: string):void {
				store.commit("setFinalsFilter",newFinalsFilter)
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
			updateWorkshopFilter (store, newWorkshopFilter: string):void {
				store.commit("setWorkshopFilter",newWorkshopFilter)
			},
			updateAssessmentSortBy (store, newSortBy: string | string[]):void {
				store.commit ("setAssessmentSortBy", newSortBy);
			},
			updateAssessmentSortDesc (store, newSortDesc: string | string[]):void {
				store.commit ("setAssessmentSortDesc", newSortDesc);
			},
			updateAssessmentSearch (store, newSearch: string):void {
				store.commit("setAssessmentSearch",newSearch)
			},
			updateAssessmentSemifinalsFilter (store, newSemifinalsFilter: string):void {
				store.commit("setAssessmentSemifinalsFilter",newSemifinalsFilter)
			},
			updateAssessmentFinalsFilter (store, newFinalsFilter: string):void {
				store.commit("setAssessmentFinalsFilter",newFinalsFilter)
			},
			updateAssessmentBusinessTracksFilter (store, newBusinessTracksFilter: string):void {
				store.commit("setAssessmentBusinessTracksFilter",newBusinessTracksFilter)
			},
			updateAssessmentTeamTypeFilter (store, newTeamTypeFilter: string):void {
				store.commit("setAssessmentTeamTypeFilter",newTeamTypeFilter)
			},
			updateAssessmentLocationFilter (store, newLocationFilter: string):void {
				store.commit("setAssessmentLocationFilter",newLocationFilter)
			},
		}
	};
	return store;
}
