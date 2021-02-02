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
import { Team, UserTeams } from "../../../common";
import { User } from "@startupway/users/lib/ui";
import { BModelCanvas } from "@startupway/bmodelcanvas/lib/ui";
import { UI } from '@startupway/main/lib/ui';
export default Vue.extend({
	name: "BusinessCanvas",
	watch: {
		$route:{
			immediate:true,
			async handler(newRoute) {
				this.teamId = parseInt(this.$route.params.teamId);
				try {
					if(await this.getUsers(this.teamId))
						await this.getAllUsers();
					const found:Team = await this.ui.api.get("/api/v1/teams/team" + this.teamId);
					if(found !== undefined) {
						this.team = found.teamName;
					}
					
					const response = await this.ui.api.get("/api/v1/canvas/" + this.teamId);
					if (response.data) {
						this.canvases = response.data;
						if(this.canvases.length === 0) {
							(this.canvases as any) = null;
						}
					}
				} catch (e) {
					console.error(e);
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
			teams: [] as Team[],
			location: "" as string,
			users:[] as User[],
			allUsers:[] as User[],
			teamId:0,
			team:"",
			canvases:[] as BModelCanvas[],
		};
	},
	methods: {
		moment() {
			return moment();
		},
		formatDate(date: Date) {
			const time  = (new Date(date)).toTimeString().split(" ");
			return (new Date(date)).toDateString() + " " + time[0];
		},
		hasUser(user:any){
			for(const aux of this.users) {
				if((aux as any).UserTeams_userId === user.userId) {
					return true;
				}
			}
			return false;
		},
		async getUsers(teamId: number):Promise<boolean> {
			try {
				const response = await this.ui.api.get<Array<User&UserTeams>>("/api/v1/teams/team/users/" + teamId);
				if (response) {
					// this.users = this.modifyUsers(response.data);
					return true;
				}
			} catch (e) {
				console.error(e);
				return false;
			}
			return false;
		},
		async getAllUsers() {
			try {
				const response = await this.ui.api.get("/api/v1/users");
				if (response) {
					// this.allUsers = this.modifyUsers(response.data);
					this.allUsers = this.allUsers.filter((user:User) => { return !this.hasUser(user)});
					return true;
				}
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		// modifyUsers(users:Array<User&UserTeams>):Array<User&UserTeams> {
		// 	for(const index in users) {
		// 		if(typeof users[index].userDetails === "string") {
		// 			users[index].userDetails = JSON.parse(users[index].userDetails);
		// 			users[index].socialMedia = JSON.parse(users[index].socialMedia);
		// 		}
		// 		if ((users[index] as any).userDetails["faculty"] !== undefined) {
		// 			(users[index] as any).faculty = (users[index] as any).userDetails["faculty"]; 
		// 		} else {
		// 			(users[index] as any).faculty = "";
		// 		}
		// 		if ((users[index] as any).userDetails["group"] !== undefined) {
		// 			(users[index] as any).group = (users[index] as any).userDetails["group"];
		// 		} else {
		// 			(users[index] as any).group = "";
		// 		}
		// 		if ((users[index] as any).role) {
		// 			const roleObj = (users[index] as any).role;
		// 			for (const prop in roleObj) {
		// 				if (Object.prototype.hasOwnProperty.call(roleObj, prop)) {
		// 					((users[index] as any).role as any) = prop;
		// 					break;
		// 				}
		// 			}
		// 		} else if ((users[index] as any).User_role) {
		// 			const roleObj = (users[index] as any).User_role;
		// 			for (const prop in roleObj) {
		// 				if (Object.prototype.hasOwnProperty.call(roleObj, prop)) {
		// 					(users[index] as any).User_role = prop;
		// 					break;
		// 				}
		// 			}
		// 		}
		// 	}
		// 	return users;
		// },
	}
});
</script>