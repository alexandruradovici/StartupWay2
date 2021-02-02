import { Module } from "vuex";
import { Team, Product } from "../common";
import { RootState} from "@startupway/users/lib/ui";
import { UI } from "@startupway/main/lib/ui";;

export interface TeamsState {
	currentTeam: Team | null,
	mentoredTeam: number | null,
	teams:Team[],
	product: Product | null
	
}

export default function teamsStore () {
	const ui = UI.getInstance();
	const store: Module<TeamsState, RootState> = {
		namespaced: true,
		state: {
			currentTeam: null,
			mentoredTeam: null,
			teams: [] as Team[],
			product:null,
		},
		getters: {
			currentTeam: (state) => state.currentTeam,
			mentoredTeam: (state) => state.mentoredTeam,
			teams: (state) => state.teams,
			product: (state) => state.product,
		},
		mutations: {
			selectTeam(state, teamId:number) {
				for(const team of state.teams) {
					if (team.teamId === teamId) {
						state.currentTeam = team;
						return;
					}
				}
				state.currentTeam = null;
			},
			mentorTeam(state, teamId:number) {
				state.mentoredTeam = teamId;
			},
			setTeams(state, newTeams:Team[]) {
				state.teams = newTeams;
			},
			setProduct(state, newProduct:Product) {
				state.product = newProduct;
			},
		},
		actions: {
			selectTeam (store, teamId: number) {
				store.commit ("selectTeam", teamId);
			},
			mentorTeam (store, teamId: number) {
				store.commit ("mentorTeam", teamId);
			},
			async loadTeams(store, userId:number) {
				// TODO load teams from server\

				let newTeams:Team[] = [];
				try {
					const r = await ui.api.get<Team[]>("/api/v1/teams/teams" +userId);
					newTeams = r.data;
				} catch(e) {
					console.error(e);
				}
 				store.commit("setTeams", newTeams)
			},
			async loadProduct(store, teamId) {
				let newProduct:Product | null = null;
				try {
					const response = await ui.api.get<Product>("/api/v1/teams/product/"+teamId);
					if(response) {
						newProduct = response.data;
					}
					
				} catch(e) {
					console.error(e);
					return false;
				}
 				store.commit("setProduct", newProduct)
				return true;
			},
			async updateProduct(store, data:{product:Product, upload:string, ext:string, teamId:number}) {
				let updateResponse;
				try {
					updateResponse = await ui.api.post("/api/v1/teams/product/update", 
					{
						product: data.product,
						upload: data.upload,
						ext:data.ext,
						teamId: data.teamId
					});
					if(updateResponse)
						return true;
					else 
						return false;
				} catch(e) {
					console.error(e);
					return false;
				}
			}
		}
	};
	return store;
}
