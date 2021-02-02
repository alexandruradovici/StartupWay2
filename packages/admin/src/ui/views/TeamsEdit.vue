<template>
	<v-app>
		<v-card flat width="800" style="margin-left: auto; margin-right: auto; padding-top: 20px; background-color: #fcfcfc;">
			<v-card-title class="justify-center" style="font-family: Georgia, serif; font-weight: bold;">
				Manage Teams
			</v-card-title>
			<v-divider></v-divider>
			
			<v-card-text>
				<div align="center" style="margin-top: 20px; margin-bottom: 20px;">Please select a team from the list to review its members.</div>
				<v-select
					:items="viewTeams"
					item-text="name"
					item-value="value"
					v-model="selectedTeam"
					label="All Teams"
					style="width: 500px; margin: 0 auto;"
					class="justify-center"
				></v-select>
				<v-container grid-list-xs v-if="selectedTeam != 0">
					<v-card flat>
						<v-card-title class="justify-center" style="font-family: Georgia, serif;">Team Composition</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<v-text-field
								v-model="search"
								append-icon="search"
								label="Search"
								single-line
								hide-details
								class="justify-center"
							></v-text-field>
							<v-data-table item-key="email" :headers="headers" :items="users" :search="search" > </v-data-table>
						</v-card-text>
					</v-card>
				</v-container>
			</v-card-text>
		</v-card>
	</v-app>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import Vue from "vue";
import { User } from "@startupway/users/lib/ui";
import { Team } from "@startupway/teams/lib/ui";
import { UI } from "@startupway/main/lib/ui";
export default Vue.extend({
	name: "TeamsEdit",
	data() {
		return {
			ui: UI.getInstance(),
			teams:[] as Team[],
			viewTeams:[] as any[],
			users:[] as User[],
			selectedTeam:0 as number,
			search:"",
			headers: [
				{
					text: "Role",
					align: "left",
					sortable: false,
					value: "UserTeams_role"
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
			async handler (newTeamId:number) {
				try {
					await this.getUsers(newTeamId);
				} catch (e) {
					console.error(e);
				}
			}
		},
		user: {
			immediate:true,
			async handler (newUser:User) {
				if(newUser.role["SuperAdmin"] || newUser.role["Admin"]){
					try {
						const response = await this.ui.api.get("/api/v1/admin/teams/"+newUser.userDetails["location"]);
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
			handler (newTeams: Team[]) {
				newTeams.forEach((team:any) => {
					this.viewTeams.push({
						"name":team.teams_teamName,
						"value":team.teams_teamId
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
		async getUsers(teamId:number){
			try {
				const response = await this.ui.api.get("/api/v1/teams/team/users/" + teamId);
				if(response) {
					this.users = this.modifyUsers(response.data);
				}
			} catch (e) {
				console.error(e);
			}
		},
		modifyUsers(users:User[]):User[] {
			users.forEach(element => {
				if(element.role){
					const roleObj = element.role;
					for(const prop in roleObj) {
						if (Object.prototype.hasOwnProperty.call(roleObj, prop)) {
							(element.role as any) = prop;
						}
					}
				} else if((element as any).User_role) {
					const roleObj = (element as any).User_role;
					for(const prop in roleObj) {
						if (Object.prototype.hasOwnProperty.call(roleObj, prop)) {
							(element as any).User_role = prop;
						}
					}
				}
				
			});
			return users;
		},
	}
});
</script>

<style lang="less">
</style>