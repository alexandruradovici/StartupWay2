<template>
	<v-app id="app">
		<v-container class="content" width="1000">
				<div class="component-title" style="margin-bottom: 30px;">Business Canvas</div>
				<v-divider style="margin-bottom: 30px;"></v-divider>
				<v-expansion-panels popout v-if="canvases" >
					<v-expansion-panel v-for="(canvas, index) in canvases" :key="index">
						<v-expansion-panel-header> Canvas Update: {{ formatDate(canvas.date) }} </v-expansion-panel-header>
						<v-expansion-panel-content v-if="canvas.fields">
							<v-row>
								<v-col cols="6" md="4" v-for="(propValue, propName) in canvas.fields" :key="propName">
									<v-card class="pa-2" outlined tile rounded >
										<v-card-title class="justify-center" style="font-family: Georgia, serif; font-size: 16px; font-weight: 600;">
											{{ propName }}
										</v-card-title>
										<v-divider></v-divider>
										<v-card-text>
											{{ propValue }}
										</v-card-text>
									</v-card>
								</v-col>
							</v-row>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
				<span v-else>
					<v-row justify="center" no-gutters>
						<v-col md="auto">
							<h1 class="landing-message">
								No canvas to show for this team.
							</h1>
						</v-col>
					</v-row>
				</span>
		</v-container>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { mapGetters } from "vuex";
import { Team, Product, UserTeams } from "@startupway/teams/lib/ui";
import { User } from "@startupway/users/lib/ui";
import { BModelCanvas } from "../../common";
import { UI } from '@startupway/main/lib/ui';
export default Vue.extend({
	name: "BusinessCanvasViewer",
	watch: {
		$route:{
			immediate:true,
			async handler(newRoute):Promise<void> {
				this.teamId = this.$route.params.teamId;
				try {
					if(await this.getUsers(this.teamId))
						await this.getAllUsers();
					const found = await this.ui.api.get<Team | null>("/api/v1/teams/team/" + this.teamId);
					if(found.data) {
						this.team = found.data.teamName;
					}
					
					const response = await this.ui.api.get<BModelCanvas[]>("/api/v1/canvas/" + this.teamId);
					if (response.data) {
						this.canvases = response.data;
						if(this.canvases.length === 0) {
							this.canvases = null;
						}
					}
				} catch (e) {
					console.error(e);
				}
			}
		},
		user: {
			immediate: true,
			async handler(newUser: User):Promise<void>  {
				if(newUser) {
					if(newUser.role === "Admin" || newUser.role === "SuperAdmin") {
						try {
							this.location = newUser.userDetails["location"];
							const response = await this.ui.api.get<Team[]>("/api/v1/admin/teams/");
							if (response.data) {
								this.teams = response.data;
							}
						} catch (e) {
							console.error(e);
						}
					} else if (newUser.role === "Mentor") {
						try {
							this.location = newUser.userDetails["location"];
							const response = await this.ui.api.get<(Team & Product)[]>("/api/v1/teams/mentor/teams/" + newUser.userId);
							if (response.data) {
								this.teams = response.data;
							}
						} catch (e) {
							console.error(e);
						}
					}
				}
			}
		},
	},
	computed: {
		...mapGetters({
			user: "users/user",
		})
	},
	data() {
		return {
			ui: UI.getInstance(),
			teams: [] as (Team[] | (Team & Product)[]),
			location: "" as string,
			users:[] as User[],
			allUsers:[] as User[],
			teamId:"",
			team:"",
			canvases:[] as BModelCanvas[] | null,
		};
	},
	methods: {
		moment() {
			return moment();
		},
		formatDate(date: Date):string {
			const time  = (new Date(date)).toTimeString().split(" ");
			return (new Date(date)).toDateString() + " " + time[0];
		},
		hasUser(user:(User&UserTeams)):boolean{
			for(const aux of this.users) {
				if(aux.userId === user.userId) {
					return true;
				}
			}
			return false;
		},
		async getUsers(teamId: string):Promise<boolean> {
			try {
				const response = await this.ui.api.get<(User&UserTeams)[]>("/api/v1/teams/team/users/" + teamId);
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
		async getAllUsers():Promise<boolean> {
			try {
				const response = await this.ui.api.get<User[]>("/api/v1/users/users");
				if (response.data) {
					this.allUsers = this.modifyUsers(response.data);
					this.allUsers = this.allUsers.filter((user:(User&UserTeams)) => { return !this.hasUser(user)});
					return true;
				}
			} catch (e) {
				console.error(e);
				return false;
			}
			return false;
		},
		modifyUsers(users:(User[] | (User & UserTeams)[])):((User&UserTeams)[] | User[]) {
			for(const user of users) {
				// Inject prop
				if (user.userDetails["faculty"] !== undefined) {
					(user as (User & {faculty:string, group:string})).faculty = user.userDetails["faculty"]; 
				} else {
					(user as (User & {faculty:string, group:string})).faculty = "";
				}
				// Inject prop
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