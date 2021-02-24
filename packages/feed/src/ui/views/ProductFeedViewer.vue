<template>
	<v-app id="app">
		<v-container class="content" width="1000">
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
import { Team, Product } from "@startupway/teams/lib/ui";
import { User, UserTeams } from "@startupway/users/lib/ui";
import { Feed, FeedTypes } from "../../common";
import moment from "moment";
import { UI } from '@startupway/main/lib/ui';
export default Vue.extend({
	name: "ProductFeedViewer",
	watch: {
		$route:{
			immediate:true,
			async handler(newRoute):Promise<void>  {
				this.teamId = (this.$route.params.teamId);
				try {
					if(await this.getUsers(this.teamId))
						await this.getAllUsers();
					const found= await this.ui.api.get<Team | null>("/api/v1/teams/team/" + this.teamId);
					if(found.data) {
						this.team = found.data.teamName;
					}
					const response = await this.ui.api.get<Feed[]>("/api/v1/feed/"+this.teamId);
					
					if(response.data) {
						this.productUpdates = response.data;
						if(this.productUpdates.length === 0) {
							this.productUpdates = null;
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
							if (response) {
								this.teams = response.data;
							}
						} catch (e) {
							console.error(e);
						}
					} else if (newUser.role === "Mentor") {
						try {
							this.location = newUser.userDetails["location"];
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
			users:[] as (User & UserTeams)[],
			allUsers:[] as User[],
			teamId:"",
			team:"",
			productUpdates:[] as Feed[] | null,
			FeedTypes: FeedTypes,
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
		hasUser(user:(User&UserTeams)):boolean {
			for(const aux of this.users) {
				if(aux.userId === user.userId) {
					return true;
				}
			}
			return false;
		},
		async getUsers(teamId: string):Promise<boolean> {
			try {
				const response = await this.ui.api.get<(User & UserTeams)[]>("/api/v1/teams/team/users/" + teamId);
				if (response.data) {
					this.users = this.modifyUsers(response.data) as (User & UserTeams)[];
					return true;
				}
			} catch (e) {
				console.error(e);
				return false;
			}
			return false;
		},
		async getAllUsers():Promise<boolean>  {
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
		modifyUsers(users: (User[] | (User&UserTeams)[])): (User[] | (User&UserTeams)[]) {
			for(const user of users) {
				if (user.userDetails["faculty"] !== undefined) {
					(user as User & {faculty:string,group:string}).faculty = user.userDetails["faculty"]; 
				} else {
					(user as User & {faculty:string,group:string}).faculty = "";
				}
				if (user.userDetails["group"] !== undefined) {
					(user as User & {faculty:string,group:string}).group = user.userDetails["group"];
				} else {
					(user as User & {faculty:string,group:string}).group = "";
				}
			}
			return users;
		},
	}
});
</script>