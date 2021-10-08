<template>
	<v-container>
		<v-card flat min-width="500">
			<v-card max-height="60" dark style="background-color:#ffb100">
				<v-card-title class="justify-center">
					Manage Teams
				</v-card-title>
			</v-card>
			<v-container>
				<v-card>
					<v-card-text>
						<v-row class="md-6">
							<v-col>
								<div align="center" style="margin-top: 20px; margin-bottom: 20px;">
									Please select a team from the list to review its members.
								</div>
								<v-select
									:items="viewTeams"
									item-text="name"
									item-value="value"
									v-model="selectedTeam"
									label="All Teams"
									style="width: 500px; margin: 0 auto;"
									class="justify-center"
								></v-select>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<v-card flat>
									<v-card-title class="justify-center">Team Composition</v-card-title>
									<v-divider></v-divider>
									<v-card-text>
										<v-text-field
											v-model="search"
											append-icon="mdi-magnify"
											label="Search"
											single-line
											hide-details
											class="justify-center"
										></v-text-field>
										<v-data-table item-key="email" :headers="headers" :items="users" :search="search" :loading="users.length <= 0" loading-text="Loading users"> </v-data-table>
									</v-card-text>
								</v-card>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-container>
		</v-card>
	</v-container>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import Vue from "vue";
import { User, UserTeams } from "@startupway/users/lib/ui";
import { Team, Product } from "@startupway/teams/lib/ui";
import { UI } from "@startupway/main/lib/ui";
export default Vue.extend({
	name: "TeamsEdit",
	data() {
		return {
			ui: UI.getInstance(),
			teams:[] as Team[],
			viewTeams:[] as {
				"name":string,
				"value":string
			}[],
			users:[] as (User & UserTeams)[],
			selectedTeam:"",
			search:"",
			headers: [
				{
					text: "Role",
					align: "left",
					sortable: false,
					value: "role"
				},
				{ text: "First Name", value: "firstName" },
				{ text: "Last Name", value: "lastName" },
				{ text: "Email", value: "email" },
			],
		};
	},
	watch: {
		selectedTeam: {
			immediate:true,
			async handler (newTeamId:string):Promise<void> {
				try {
					await this.getUsers(newTeamId);
				} catch (e) {
					console.error(e);
				}
			}
		},
		user: {
			immediate:true,
			async handler (newUser:User):Promise<void>  {
				if(newUser.role === "SuperAdmin" || newUser.role === "Admin"){
					try {
						const response = await this.ui.api.get<(Team & Product)[]>("/api/v1/admin/teams/"+newUser.userDetails["location"]);
						if(response) {
							this.teams = response.data;
						}
					} catch(e) {
						console.error(e);
					}
				} else {
					if(this.$route.path!=="/workspace")
						this.$router.push("/workspace");
				}
				
			}
		},
		teams: {
			immediate: true,
			handler (newTeams: (Team & Product)[]):void {
				newTeams.forEach((team:(Team & Product)) => {
					this.viewTeams.push({
						"name":team.teamName,
						"value":team.teamId
					})
				})
			},
		},
	},
	computed: {
		...mapGetters({
			user:"users/user"
		})
	},
	methods: {
		async getUsers(teamId:string):Promise<void>{
			try {
				this.users = [];
				const response = await this.ui.api.get<(User & UserTeams)[]>("/api/v1/teams/team/users/" + teamId);
				if(response) {
					for(let us of response.data)
						this.users.push(us);
				}
			} catch (e) {
				console.error(e);
			}
		},
	}
});
</script>

<style lang="less">
// @import "../style/vendor.less";
</style>