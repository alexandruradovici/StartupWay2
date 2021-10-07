import { Module } from "vuex";
import { Team, Product } from "../common";
import { RootState} from "@startupway/users/lib/ui";
import { UI } from "@startupway/main/lib/ui";;

export interface TeamsState {
	currentTeam: Team | null,
	mentoredTeam: string | null,
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
			currentTeam: (state:TeamsState) => state.currentTeam,
			mentoredTeam: (state:TeamsState) => state.mentoredTeam,
			teams: (state:TeamsState) => state.teams,
			product: (state:TeamsState) => state.product,
		},
		mutations: {
			selectTeam(state:TeamsState, teamId:string):void {
				for(const team of state.teams) {
					if (team.teamId === teamId) {
						state.currentTeam = team;
						return;
					}
				}
				state.currentTeam = null;
			},
			mentorTeam(state:TeamsState, teamId:string):void {
				state.mentoredTeam = teamId;
			},
			setTeams(state:TeamsState, newTeams:Team[]):void {
				state.teams = newTeams;
			},
			setProduct(state:TeamsState, newProduct:Product):void {
				state.product = newProduct;
			},
		},
		actions: {
			selectTeam (store, teamId: string):void {
				store.commit ("selectTeam", teamId);
			},
			mentorTeam (store, teamId: string):void {
				store.commit ("mentorTeam", teamId);
			},
			async loadTeams(store, userId:string):Promise<void> {
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
			async loadProduct(store, teamId):Promise<boolean> {
				let newProduct:Product | null = null;
				try {
					const response = await ui.api.get<Product | null>("/api/v1/teams/product/"+teamId);
					if (response.data) {
						newProduct = response.data;
					}
					
				} catch(e) {
					console.error(e);
					return false;
				}
 				store.commit("setProduct", newProduct)
				return true;
			},
			async updateProduct(store, data:{product:Product, upload:string, ext:string, teamId:string}):Promise<boolean> {
				let updateResponse;
				try {
					updateResponse = await ui.api.post<Product | null>("/api/v1/teams/product/update", 
					{
						product: data.product,
						upload: data.upload,
						ext:data.ext,
						teamId: data.teamId
					});
					if (updateResponse.data)
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
