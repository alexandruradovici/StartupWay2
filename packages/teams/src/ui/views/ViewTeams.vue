<template>
	<v-app id="app">
		<v-row no-gutters color="#fcfcfc">
			<v-col cols="12" sm="6" md="3" lg="3" xl="3">
				<div style="margin-top: 50px;">
					<v-list nav dense class="nav" color="#fcfcfc">
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
						<v-divider></v-divider>
						<v-list-item link
							v-for="tab in tabs"
							:key="tab.key"
							@click="changeRoute(tab.link)"
							class="menu-item"
						>
						<v-list-item-icon>
							<v-icon color="#197E81">{{ tab.icon }}</v-icon>
						</v-list-item-icon>

						<v-list-item-content>
							<v-list-item-title class="active-element" style="font-size: 15px; font-weight: 900;">{{ tab.title }}</v-list-item-title>
						</v-list-item-content>
						</v-list-item>
					</v-list>
				</div>
			</v-col>
			<v-col cols="12" sm="6" md="7" lg="8" xl="9">
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
			</v-col>
		</v-row>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import badgeImage from "../img/badge1-1650px.png";
import { mapGetters } from "vuex";
import { UI } from "@startupway/main/lib/ui";
import { Team,Product} from "../../common";
import { User } from "@startupway/users/lib/ui";

export default Vue.extend({
	name: "ViewTeams",
	watch: {
		$route:{
			immediate:true,
			async handler(newRoute) {
				const component = this.$route.params.component;

				if(this.selectedTeam !== parseInt(this.$route.params.teamId,10)) {
					this.selectedTeam = parseInt(this.$route.params.teamId,10);
					console.log(this.selectedTeam);
					try {
						if(await this.getUsers(this.selectedTeam))
							await this.getAllUsers();
						this.teamId = this.selectedTeam;
						const found = this.viewTeams.find ( (team: any) => team.value === this.selectedTeam);
						if(found !== undefined) {
							this.team = found.name;
						}
					} catch (e) {
						console.error(e);
					}
				}
				(this.component as any)=component;
			}
		},
		mentoredTeam: {
			immediate:true,
			async handler(newTeam:number) {
				if(this.mentoredTeams.length > 0){
					(this.selectedMentoredTeam as any) = this.mentoredTeams.find( team => {
						return team.teamId == newTeam;
					});
					this.id = newTeam;
				}
			}
		},
		selectedMentoredTeam: {
			immediate:true,
			async handler(newTeam:Team) {
				if(newTeam) {
					if(newTeam !== undefined && newTeam.teamId !== undefined) {
						const response = await this.ui.api.get("/api/v1/teams/product/" + newTeam.teamId);
						const product:Product = response.data;
						(newTeam as any).businessTrack = product.businessTrack;
						(newTeam as any).teamType = product.teamType;
					}
				}
			}
		},
		user: {
			immediate: true,
			async handler(newUser: User) {
				if(newUser) {
					const role = JSON.parse(this.user.role);
					if(role["Admin"] || role["SuperAdmin"]) {
						try {
							this.location = newUser.userDetails["location"];
							const response = await this.ui.api.get("/api/v1/admin/teams/");
							if (response) {
								this.teams = response.data;
							}
							this.role = "Admin";
						} catch (e) {
							console.error(e);
						}
					} else if (role["Mentor"]) {
						try {
							this.location = newUser.userDetails["location"];
							const response = await this.ui.api.get("/api/v1/teams/mentor/teams/" + newUser.userId);
							if (response) {
								this.teams = response.data;
							}
							this.role = "Mentor";
						} catch (e) {
							console.error(e);
						}
					}
					if(role["Mentor"] !== undefined || role["Admin"] !== undefined || role["SuperAdmin"] !== undefined) {
						if(this.tabs.length > 0) {
							this.tabs = [];
						}
						if (role["Admin"] || role["SuperAdmin"]) {
							if(role["Admin"])
								this.role="Admin";
							else
								this.role="SuperAdmin"
						} else if(role["Mentor"]) {
							this.role="Mentor";
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
			async handler(newTeams: Team[]) {
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
			async handler (newTeams: any[]) {
				if (this.role==="Mentor") {
					for(const team of newTeams) {
						const response = await this.ui.api.get("/api/v1/teams/product/" + team.teamId);
						const product:Product = response.data;
						(team as any).businessTrack = product.businessTrack;
						(team as any).teamType = product.teamType;
					}
				}
			},
		},
		currentTeam: {
			immediate: true,
			async handler (newTeam: Team) {
				if(newTeam) {
					const response = await this.ui.api.get("/api/v1/teams/product/" + newTeam.teamId);
					const product:Product = response.data;
					(newTeam as any).businessTrack = product.businessTrack;
					(newTeam as any).teamType = product.teamType;
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
			mentoredTeams:[] as any[],
			selectedMentoredTeam: {} as Team,
			id:0 as number,
			tabs: [] as any,
			type: "",
			location:"",
			component:"",
			teamId: 0 as number,
			userId: 0 as number,
			teams: [] as Team[],
			team: "" as string,
			product:(null as any) as Product,
			viewTeams: [] as any,
			selectedTeam: 0 as number,
			selected: {} as User,
			users: [] as any[],
			allUsers: [] as any[],
			item: { },
			loadingPage:false,
			badge:badgeImage
		};
	},
	methods: {
		pushToTabs(tab:any) {
			if(this.tabs.find((item:any) => {
				return item.link === tab.link
			}) === undefined) {
				this.tabs.push(tab);
			}
		},
		changeRoute(link:string) {
			if((this.role==="Mentor" || this.role==="Admin" || this.role ==="SuperAdmin") && this.selectedTeam !== 0 && link.split("/")[1] === "viewTeam") {
				this.$router.push(link + "/" + this.selectedTeam);
			}
			else
				if(this.$route.path !== "/workspace")
					this.$router.push("/workspace");
		},
		async getUsers(teamId: number) {
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
		},
		hasUser(user:any){
			for(const aux of this.users) {
				if(aux.UserTeams_userId === user.userId) {
					return true;
				}
			}
		},
		async getAllUsers() {
			try {
				const response = await this.ui.api.get("/api/v1/users");
				if (response) {
					this.allUsers = this.modifyUsers(response.data);
					this.allUsers = this.allUsers.filter((user:User) => { return !this.hasUser(user)});
					return true;
				}
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		modifyUsers(users: any[]): any[] {
			for(const index in users) {
				if(typeof users[index].userDetails === "string") {
					users[index].userDetails = JSON.parse(users[index].userDetails);
					users[index].socialMedia = JSON.parse(users[index].socialMedia);
				}
				if ((users[index] as any).userDetails["faculty"] !== undefined) {
					(users[index] as any).faculty = (users[index] as any).userDetails["faculty"]; 
				} else {
					(users[index] as any).faculty = "";
				}
				if ((users[index] as any).userDetails["group"] !== undefined) {
					(users[index] as any).group = (users[index] as any).userDetails["group"];
				} else {
					(users[index] as any).group = "";
				}
				if ((users[index] as any).role) {
					const roleObj = (users[index] as any).role;
					for (const prop in roleObj) {
						if (Object.prototype.hasOwnProperty.call(roleObj, prop)) {
							((users[index] as any).role as any) = prop;
							break;
						}
					}
				} else if ((users[index] as any).User_role) {
					const roleObj = (users[index] as any).User_role;
					for (const prop in roleObj) {
						if (Object.prototype.hasOwnProperty.call(roleObj, prop)) {
							(users[index] as any).User_role = prop;
							break;
						}
					}
				}
			}
			return users;
		},
	}
});
</script>
