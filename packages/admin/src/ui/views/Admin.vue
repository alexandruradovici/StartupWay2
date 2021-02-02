<template>
	<v-app>
		<v-row no-gutters>
			<v-col  cols="12" sm="6" md="3" lg="3" xl="3">
				<div class="content">
					<v-list nav dense style="margin-top: 20px; background-color: #fcfcfc;">
						<v-list-item class="menu-item" two-line>
							<v-list-item-content>
								<v-list-item-title class="user-title" style="font-size:20px; font-weight: bold;">Admin Panel</v-list-item-title>
								<v-list-item-subtitle class="user-subtitle" style="font-size:18px;">Innovation Labs 2020</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>

						<v-divider></v-divider>

						<v-list-item class="menu-item" link to="/admin/users">
							<v-list-item-icon>
								<v-icon color="primary">mdi-account-multiple</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title class="active-element" style="font-size: 16px; font-weight: 900;">Users</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item class="menu-item" link to="/admin/teams">
							<v-list-item-icon>
								<v-icon color="primary">mdi-account-group</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title class="active-element" style="font-size: 16px; font-weight: 900;">Teams</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item class="menu-item" link to="/admin/workshops">
							<v-list-item-icon>
								<v-icon color="primary">mdi-domain</v-icon>
							</v-list-item-icon>

								<v-list-item-content>
								<v-list-item-title class="active-element" style="font-size: 16px; font-weight: 900;">Workshops</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item class="menu-item" link to="/csv">
							<v-list-item-icon>
								<v-icon color="primary">mdi-file-import-outline</v-icon>
							</v-list-item-icon> 

							<v-list-item-content>
								<v-list-item-title class="active-element" style="font-size: 16px; font-weight: 900;">Import CSV</v-list-item-title>
							</v-list-item-content>
						</v-list-item>

						<v-list-item class="menu-item" link to="/admin/exports">
							<v-list-item-icon>
								<v-icon color="primary">mdi-file-export-outline</v-icon>
							</v-list-item-icon> 

							<v-list-item-content>
								<v-list-item-title class="active-element" style="font-size: 16px; font-weight: 900;">Exports</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list>
					<!-- <v-navigation-drawer app permanent style="border-left:#ffb100 solid 10px;">
						<v-list>
							<v-list-item two-line>
								<v-list-item-content>
									<v-list-item-title>Admin Panel</v-list-item-title>
									<v-list-item-subtitle>Innovation Labs 2020</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
							<v-divider></v-divider>
							<v-list-item link to="/admin/users">
								<v-list-item-icon>
									<v-icon>mdi-account-multiple</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title>Users</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-list-item link to="/admin/teams">
								<v-list-item-icon>
									<v-icon>mdi-account-group</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title>Teams</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-list-item link to="/admin/workshops">
								<v-list-item-icon>
									<v-icon>mdi-domain</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title>Workshops</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-navigation-drawer> -->
				</div>
			</v-col>
			<v-col cols="12" sm="6" md="7" lg="9" xl="9" >
				<transition fluid pa-0 v-if="!loadingPage">
					<router-view></router-view>
				</transition>
			</v-col>
		</v-row>
	</v-app>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import Vue from "vue";
import { User } from "@startupway/users/lib/ui";
import { Team } from "@startupway/teams/lib/ui";
import { UI } from '@startupway/main/lib/ui';
export default Vue.extend({
	name: "Admin",
	data() {
		return {
			ui: UI.getInstance(),
			allUsers: [] as User[],
			teams: [] as Team[],
			viewTeams: [] as any[],
			loadingPage:false,
		};
	},
	watch: {
		user: {
			immediate: true,
			async handler(newUser: User) {
				if(newUser) {
					const role = JSON.parse(this.user.role);
					if (role["Admin"] || role["SuperAdmin"]) {
						try {
							const response = await this.ui.api.get("/api/v1/teams/mentor/teams/" + newUser.userId);
							if (response) {
								this.teams = response.data;
							}
						} catch (e) {
							console.error(e);
						}
					} else {
						if(this.$route.path!=="/workspace")
							this.$router.push("/workspace");
					}
				}
			}
		},
		teams: {
			immediate: true,
			handler(newTeams: Team[]) {
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
			users.forEach(element => {
				if (element.role) {
					const roleObj = element.role;
					for (const prop in roleObj) {
						if (Object.prototype.hasOwnProperty.call(roleObj, prop)) {
							(element.role as any) = prop;
						}
					}
				} else if ((element as any).User_role) {
					const roleObj = (element as any).User_role;
					for (const prop in roleObj) {
						if (Object.prototype.hasOwnProperty.call(roleObj, prop)) {
							(element as any).User_role = prop;
						}
					}
				}
			});
			return users;
		},
		async getAllUsers() {
			try {
				const response = await this.ui.api.get("/api/v1/users/users/all");
				if (response) {
					this.allUsers = this.modifyUsers(response.data);
				}
			} catch (e) {
				console.error(e);
			}
		}
	}
});
</script>

<style lang="less">
</style>