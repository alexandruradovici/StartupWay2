<template>
	<v-app id="app">
		<v-navigation-drawer v-if="role" clipped app permanent expand-on-hover>
			<v-list>
				<v-list-item>
					<v-list-item-avatar>
						<v-img :src="badge"></v-img>
					</v-list-item-avatar>
					<v-list-item-content>
						<div v-if="role==='Mentor'">
							<v-list-item-title id="user-title">Mentor View</v-list-item-title>
						</div>
						<div v-if="role==='Admin' || role==='SuperAdmin'">
							<v-list-item-title id="user-title">Admin View</v-list-item-title>
						</div>
					</v-list-item-content>
				</v-list-item>
			</v-list>

			<v-divider></v-divider>

			<v-list nav dense>
				<template v-for="tab in tabs">
					<v-list-item link :key="tab.key" :to="tab.link + '/' + selectedTeam">
						<v-list-item-icon>
							<v-icon color="#197E81">{{ tab.icon }}</v-icon>
						</v-list-item-icon>
						<v-list-item-title>{{tab.title}}</v-list-item-title>
					</v-list-item>
				</template>
			</v-list>
		</v-navigation-drawer>
		<v-container class="justify-center" fluid pl-7 pr-7>
			<transition fluid pa-0 v-if="!loadingPage">
				<router-view></router-view>
			</transition>
			<transition v-else>
				<v-row justify="center">
					<v-col md="auto">
						<v-progress-circular
						:size="500"
						color="primary"
						indeterminate
						></v-progress-circular>
					</v-col>
				</v-row>
			</transition>
		</v-container>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import badgeImage from "../img/badge1-1650px.png";
import { mapGetters } from "vuex";
import { UI } from "@startupway/main/lib/ui";
import { Team,	Product, Tab } from "../../common";
import { User, UserTeams } from "@startupway/users/lib/ui";

export default Vue.extend({
	name: "ViewTeams",
	watch: {
		$route:{
			immediate:true,
			async handler(newRoute):Promise<void> {
				const component:string = this.$route.params.component;

				if(this.selectedTeam !== this.$route.params.teamId) {
					this.selectedTeam = this.$route.params.teamId;
					try {
						if(await this.getUsers(this.selectedTeam))
							await this.getAllUsers();
						this.teamId = this.selectedTeam;
						const found = this.viewTeams.find ( (team: {value:string,name:string}) => team.value === this.selectedTeam);
						if(found !== undefined) {
							this.team = found.name;
						}
					} catch (e) {
						console.error(e);
					}
				}
				this.component=component;
			}
		},
		mentoredTeam: {
			immediate:true,
			async handler(newTeam:string):Promise<void> {
				if(this.mentoredTeams.length > 0){
					this.selectedMentoredTeam = this.mentoredTeams.find( team => {
						return team.teamId === newTeam;
					});
					this.id = newTeam;
				}
			}
		},
		selectedMentoredTeam: {
			immediate:true,
			async handler(newTeam:(Team & Product)):Promise<void> {
				if(newTeam) {
					if(newTeam !== undefined && newTeam.teamId !== undefined) {
						const response = await this.ui.api.get<Product | null>("/api/v1/teams/product/" + newTeam.teamId);
						const product:Product | null = response.data;
						if(product) {
							newTeam.businessTrack = product.businessTrack;
							newTeam.teamType = product.teamType;
						}
					}
				}
			}
		},
		user: {
			immediate: true,
			async handler(newUser: User):Promise<void> {
				if(newUser) {
					if(newUser.role === "Admin" || newUser.role === "SuperAdmin") {
						try {
							this.location = newUser.userDetails["location"];
							const response = await this.ui.api.get<Team[]>("/api/v1/admin/teams/");
							if (response) {
								this.teams = response.data;
							}
							this.role = "Admin";
						} catch (e) {
							console.error(e);
						}
					} else if (newUser.role === "Mentor") {
						try {
							this.location = newUser.userDetails["location"];
							const response = await this.ui.api.get<(Team&Product)[]>("/api/v1/teams/mentor/teams/" + newUser.userId);
							if (response) {
								this.teams = response.data;
							}
							this.role = "Mentor";
						} catch (e) {
							console.error(e);
						}
					}
					if(newUser.role === "Mentor" || newUser.role === "Admin" || newUser.role === "SuperAdmin") {
						if(this.tabs.length > 0) {
							this.tabs = [];
						}
						this.role = newUser.role;
						if(newUser.role === "Mentor") {
							await this.ui.api.get("/api/v1/teams/mentor/teams/" + newUser.userId);
							
						}
						// this.pushToTabs({
						// 	key:this.tabs.length,
						// 	title:"Workshops",
						// 	icon:"mdi-briefcase",
						// 	link:"/workshop"
						// });
						this.pushToTabs({
							key:this.tabs.length,
							title:"Edit Team",
							icon:"mdi-account-group",
							link:"/viewTeam/composition"
						});
						this.pushToTabs({
							key:this.tabs.length,
							title:" Edit Product",
							icon:"mdi-chart-bar",
							link:"/viewTeam/product"
						});
						this.pushToTabs({
							key:this.tabs.length,
							title:"Team Activity",
							icon:"mdi-calendar",
							link:"/viewTeam/activities"
						});
						this.pushToTabs({
							key:this.tabs.length,
							title:"Product Feed",
							icon:"mdi-cog-clockwise",
							link:"/viewTeam/feed"
						});
						this.pushToTabs({
							key:this.tabs.length,
							title:"Business Canvas",
							icon:"mdi-clipboard-text-multiple",
							link:"/viewTeam/canvas"
						});
					}
				}
				
			}
		},
		teams: {
			immediate: true,
			async handler(newTeams: Team[]):Promise<void> {
				newTeams.forEach(async (team: Team) => {
					if(team) {
						this.viewTeams.push({
							name: team.teamName,
							value: team.teamId
						});
					}
				});
			}
		},
		mentoredTeams: {
			immediate: true,
			async handler (newTeams: (Team & Product)[]):Promise<void> {
				if (this.role==="Mentor") {
					for(const team of newTeams) {
						const response = await this.ui.api.get<Product | null>("/api/v1/teams/product/" + team.teamId);
						const product:Product | null = response.data;
						if(product) {
							team.businessTrack = product.businessTrack;
							team.teamType = product.teamType;
						}
					}
				}
			},
		},
		currentTeam: {
			immediate: true,
			async handler (newTeam: (Team & Product)):Promise<void> {
				if(newTeam) {
					const response = await this.ui.api.get<Product | null>("/api/v1/teams/product/" + newTeam.teamId);
					const product:Product | null = response.data;
					if(product) {
						newTeam.businessTrack = product.businessTrack;
						newTeam.teamType = product.teamType;
					}
				}
			}
		},
	},
	computed: {
		...mapGetters({
			user: "users/user",
			currentTeam: "teams/currentTeam",
			mentoredTeam: "teams/mentoredTeam",
			toolbarButtons: "workspace/toolbarButtons",
		})
	},
	data() {
		return {
			ui: UI.getInstance(),
			role:"" as string,
			router:false,
			mentoredTeams:[] as (Team & Product)[],
			selectedMentoredTeam: undefined as (Team & Product) | Team | undefined,
			id:"",
			tabs: [] as Tab[],
			type: "",
			location:"",
			component:"",
			teamId: "",
			userId: "",
			teams: [] as Team[] | (Team & Product)[],
			team: "" as string,
			product:null as Product | null,
			viewTeams: [] as {name:string,value:string}[],
			selectedTeam: "",
			selected: {} as User,
			users: [] as (User&UserTeams)[] | User[],
			allUsers: [] as (User&UserTeams)[] | User[],
			item: { },
			loadingPage:false,
			badge:badgeImage
		};
	},
	methods: {
		pushToTabs(tab:{key:number,title:string,icon:string,link:string}):void {
			if(this.tabs.find((item:{key:number,title:string,icon:string,link:string}) => {
				return item.link === tab.link
			}) === undefined) {
				this.tabs.push(tab);
			}
		},
		changeRoute(link:string):void {
			if((this.role==="Mentor" || this.role==="Admin" || this.role ==="SuperAdmin") && this.selectedTeam !== "" && link.split("/")[1] === "viewTeam") {
				this.$router.push(link + "/" + this.selectedTeam);
			}
			else
				if(this.$route.path !== "/workspace")
					this.$router.push("/workspace");
		},
		async getUsers(teamId: string):Promise<boolean> {
			try {
				const response = await this.ui.api.get("/api/v1/teams/team/users/" + teamId);
				if (response) {
					this.users = this.modifyUsers(response.data);
					return true;
				}
			} catch (e) {
				console.error(e);
				return false;
			}
			return false;
		},
		hasUser(user:(User&UserTeams) | User):boolean {
			for(const aux of this.users) {
				if(aux.userId === user.userId) {
					return true;
				}
			}
			return false;
		},
		async getAllUsers():Promise<boolean> {
			try {
				const response = await this.ui.api.get("/api/v1/users/users");
				if (response) {
					this.allUsers = this.modifyUsers(response.data);
					this.allUsers = this.allUsers.filter((user:User) => { return !this.hasUser(user)});
					return true;
				}
			} catch (e) {
				console.error(e);
				return false;
			}
			return false;
		},
		modifyUsers(users: (User | (User & UserTeams))[]): (User | (User & UserTeams))[] {
			for(const user of users) {
				if (user.userDetails["faculty"] !== undefined) {
					(user as (User & {faculty:string, group:string})).faculty = user.userDetails["faculty"]; 
				} else {
					(user as (User & {faculty:string, group:string})).faculty = "";
				}
				if (user.userDetails["group"] !== undefined) {
					(user as (User & {faculty:string, group:string})).group = user.userDetails["group"];
				} else {
					(user as (User & {faculty:string, group:string})).group = "";
				}
			}
			return users;
		},
	}
});
</script>
