<template>
	<v-app>
		<v-navigation-drawer app clipped permanent style="border-left:#ffb100 solid 10px;">
			<v-list>
				<v-list-item two-line>
					<v-list-item-content>
						<v-list-item-title>Admin Panel</v-list-item-title>
						<v-list-item-subtitle>Innovation Labs 2021</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
				<v-divider></v-divider>
				<v-list-item class="menu-item" link to="/admin/users">
					<v-list-item-icon>
						<v-icon color="primary">mdi-account-multiple</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Users</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item class="menu-item" link to="/admin/teams">
					<v-list-item-icon>
						<v-icon color="primary">mdi-account-group</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Teams</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item class="menu-item" link to="/admin/workshops">
					<v-list-item-icon>
						<v-icon color="primary">mdi-domain</v-icon>
					</v-list-item-icon>

						<v-list-item-content>
						<v-list-item-title>Workshops</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item class="menu-item" link to="/admin/csv">
					<v-list-item-icon>
						<v-icon color="primary">mdi-file-import-outline</v-icon>
					</v-list-item-icon> 

					<v-list-item-content>
						<v-list-item-title>Import CSV</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-list-item class="menu-item" link to="/admin/exports">
					<v-list-item-icon>
						<v-icon color="primary">mdi-file-export-outline</v-icon>
					</v-list-item-icon> 

					<v-list-item-content>
						<v-list-item-title>Exports</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-container>
			<transition fluid pa-0 v-if="!loadingPage">
				<router-view></router-view>
			</transition>
		</v-container>
	</v-app>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import Vue from "vue";
import { User } from "@startupway/users/lib/ui";
import { Team,Product } from "@startupway/teams/lib/ui";
import { UI } from '@startupway/main/lib/ui';
export default Vue.extend({
	name: "Admin",
	data() {
		return {
			ui: UI.getInstance(),
			allUsers: [] as User[],
			teams: [] as (Team & Product)[],
			viewTeams: [] as {name:string,value:string}[],
			loadingPage:false,
		};
	},
	watch: {
		user: {
			immediate: true,
			async handler(newUser: User):Promise<void> {
				if(newUser) {
					if (newUser.role === "Admin" || newUser.role === "SuperAdmin") {
						try {
							const response = await this.ui.api.get<(Team & Product)[]>("/api/v1/teams/mentor/teams/" + newUser.userId);
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
		teams: {
			immediate: true,
			handler(newTeams: Team[]):void {
				newTeams.forEach((team: Team) => {
					this.viewTeams.push({
						name: team.teamName,
						value: team.teamId
					});
				});
			}
		}
	},
	computed: {
		...mapGetters({
			user: "users/user"
		})
	},
	methods: {
		modifyUsers(users: User[]): User[] {
			// users.forEach(element => {
			// 	if (element.role) {
			// 		// as any to replace role: {"Role_name":true} with "Role_name"
			// 		const roleObj = element.role;
			// 		for (const prop in roleObj) {
			// 			if (Object.prototype.hasOwnProperty.call(roleObj, prop)) {
			// 				(element.role as any) = prop;
			// 			}
			// 		}
			// 	}
			// });
			return users;
		},
		async getAllUsers():Promise<boolean> {
			try {
				const response = await this.ui.api.get<User[]>("/api/v1/users/users/all");
				if (response) {
					this.allUsers = this.modifyUsers(response.data);
				}
			} catch (e) {
				console.error(e);
				return false;
			}
			return true;
		}
	}
});
</script>

<style lang="less">
</style>