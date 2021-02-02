<template>
	<v-app id="app">
		<v-container class="content" width="1000">
				<div class="component-title" style="margin-bottom: 30px;">Product Feed</div>
				<v-divider></v-divider>
				<template v-if="productUpdates"> 
					<v-card flat outlined v-for="(item, index) in productUpdates" :key="index" width="800" class="justify-center" style="margin: auto; margin-bottom: 20px; margin-top: 30px;">
						<v-card-title style="font-family: Georgia, serif; font-size: 18px; font-weight: 600;">
							<v-icon large left color="#22542b" v-if="item.feedType===FeedTypes.INVESTMENT">mdi-account-cash</v-icon>
							<v-icon large left color="#e0ac1b" v-if="item.feedType===FeedTypes.AWARD">mdi-trophy</v-icon>
							<v-icon large left color="#9e2219" v-if="item.feedType===FeedTypes.UPDATE">mdi-update</v-icon>
							<v-icon large left color="#202b4f" v-if="item.feedType===FeedTypes.COLLABORATORS">mdi-account-tie</v-icon>
						
							Feed Type: {{ item.feedType }}
						</v-card-title>
						<v-card-subtitle v-if="item && item.date" style="font-family: Georgia, serif; font-size: 18px;">
								{{formatDate(item.date)}}
						</v-card-subtitle>
						<v-divider></v-divider>
						<v-card-text style="font-family: Georgia, serif;">
							<span>Feed Description: {{ item.text["text"] }}</span>
							<v-spacer></v-spacer>
							<span v-if="item.feedType === FeedTypes.INVESTMENT"> Amount:{{ item.text["amount"] }} </span>
						</v-card-text>
					</v-card>
				</template>
				<span v-else>
					<v-row justify="center" no-gutters>
						<v-col md="auto">
							<h1 class="landing-message">
								No feed to show for this team.
							</h1>
						</v-col>
					</v-row>
				</span>
		</v-container>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Team } from "../../../common";
import { User } from "@startupway/users/lib/ui";
import { Feed, FeedTypes } from "@startupway/feed/lib/ui";
import moment from "moment";
import { UI } from '@startupway/main/lib/ui';
export default Vue.extend({
	name: "ProductFeed",
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
					const response = await this.ui.api.get("/api/v1/feed/"+this.teamId);
					
					if(response) {
						this.productUpdates = response.data;
						if(this.productUpdates.length === 0) {
							(this.productUpdates as any) = null;
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
			productUpdates:[] as Feed[],
			FeedTypes: FeedTypes,
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