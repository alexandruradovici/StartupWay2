<template>
	<v-app id="app">
		<v-container v-if="!loadingPage" class="content" fluid pl-7 pr-7>
				<div class="component-title">Users activity</div>
				<v-divider></v-divider>
				<v-card flat style="margin: auto;" width="800" color="#fcfcfc">
					<v-list nav dense color="#fcfcfc">
						<v-list-item v-for="user in users" :key="user.email">
							<v-list-item-avatar>
								<v-img v-if="user.image !== ''" :src="user.image"></v-img>
								<v-icon v-else color="primary">mdi-account-circle mdi-48px</v-icon>
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title style="font-family: Georgia, serif; font-size: 17px; font-weight: 700;"> {{ user.firstName }} {{ user.lastName }}</v-list-item-title>
								<v-list-item-subtitle style="font-family: Georgia, serif; font-size: 15px; font-weight: 550;" v-if="user.UserTeams_role !== ''">
									{{user.UserTeams_role}}
								</v-list-item-subtitle>
								<v-list-item-subtitle v-else>
									No role
								</v-list-item-subtitle>
							</v-list-item-content>

							<v-list-item-action>
								<v-btn text @click="mentoredUser = user">
									View {{user.firstName}}'s activity
								</v-btn>
							</v-list-item-action>
						</v-list-item>
					</v-list>
				</v-card>
					<v-divider></v-divider>
					<v-card color="#fcfcfc" v-if="mentoredUser.UserTeams_userId" flat style="margin: auto; padding-top: 20px;" >
						
						<v-card-title class="justify-center">
							<v-list-item-avatar size="60">
								<v-img v-if="mentoredUser.image !== ''" :src="mentoredUser.image" @click="extendImage(mentoredUser.image)"></v-img>
								<v-icon v-else color="primary">mdi-account-circle mdi-48px</v-icon>
							</v-list-item-avatar>
							{{mentoredUser.firstName}} {{mentoredUser.lastName}}
						</v-card-title>

						<v-card-text>
							<div>
								<v-row v-if="weeks.length > 0">
									<v-col cols="12" sm="6" md="4" lg="4" xl="4" v-for="week in weeks" :key="week.activityId">
										<v-card flat outlined>
											<v-card-title class="justify-center" style="font-size: 15px; font-weight: bold;">
												{{ formatDate(week.date) }}
											</v-card-title>
											<v-divider></v-divider>
											<v-card-text style="margin-top: 30px;">
												<div style="text-align: center;">Number of hours worked: {{week.noOfHours}}</div>
												<div style="text-align: center;">Work Description: {{week.description}}</div>
											</v-card-text>
											<v-card-actions class="justify-center">
												<v-btn icon fab @click="editActivity(week)">
													<v-icon color="primary">mdi-pencil-circle-outline</v-icon>
												</v-btn>
												<v-btn icon fab @click="viewActivity(week)">
													<v-icon color="primary">mdi-calendar-month</v-icon>
												</v-btn>
											</v-card-actions>
										</v-card>
									</v-col>
								</v-row>
								<v-row v-else justify="center" no-gutters>
									<v-col md="auto">
										<h1 class="landing-message">
											{{mentoredUser.firstName}} {{mentoredUser.lastName}} has no activities in this team so far.
										</h1>
									</v-col>
								</v-row>
							</div>
						</v-card-text>
					</v-card>
					<v-dialog v-model="editDialog" max-width="450">
						<v-card flat width="450">
							<v-card-title class="justify-center" style="font-family: Georgia, serif;">
								Edit {{mentoredUser.firstName}}'s activity
							</v-card-title>
							<v-card-subtitle>
								<div style="text-align: center;">
									{{ formatDate(edited.date) }}
								</div>
							</v-card-subtitle>
							<v-divider></v-divider>
							<v-card-text>
								<div class="details">
									Please submit the number of worked hours for {{mentoredUser.firstName}}.
								</div>
								<v-text-field
									v-model="edited.noOfHours"
									append-icon="mdi-calendar-clock"
									single-line
									color="primary"
								></v-text-field>
								<div class="details">
									Add work description for {{mentoredUser.firstName}}.
								</div>
								<v-text-field
									v-model="edited.description"
									append-icon="mdi-calendar-clock"
									single-line
									color="primary"
								></v-text-field>
							</v-card-text>

							<v-card-actions class="justify-center">
								<v-btn color="primary" rounded @click="saveActivity(edited)">Update progress</v-btn>
								<v-btn color="primary" text @click="denyActivity()">Exit</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
					<v-dialog v-model="extendDialog" max-width="450">
						<v-card flat max-width="450">
							<v-img :src="extendedImage"></v-img>
							<v-card-actions class="justify-center">
								<v-btn text color="primary" @click="extendDialog=false">Exit</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
					<v-dialog v-model="viewDialog" max-width="450">
						<v-card flat width="450">
							<v-card-title class="justify-center" style="font-family: Georgia, serif;">
								View {{mentoredUser.firstName}}'s activity
							</v-card-title>
							<v-card-subtitle>
								<div style="text-align: center;">
									{{ formatDate(edited.date) }}
								</div>
							</v-card-subtitle>
							<v-divider></v-divider>
							<v-card-text>
								<div class="details">
									Number of worked hours for during this week: {{edited.noOfHours}}
								</div>
								<div class="details">
									Work description: {{edited.description}}
								</div>
							</v-card-text>

							<v-card-actions class="justify-center">
								<v-btn color="primary" text @click="closeView()">Exit</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
		</v-container>
		<v-container v-else>
			<v-row justify="center">
				<v-col md="auto">
					<v-progress-circular
					:size="500"
					color="primary"
					indeterminate
					></v-progress-circular>
				</v-col>
			</v-row>
		</v-container>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Team, UserActivity } from "../../../common";
import { User} from "@startupway/users/lib/ui";
import moment from "moment";
import { UI } from '@startupway/main/lib/ui';
export default Vue.extend({
	name: "UserActivities",
	watch: {
		$route:{
			immediate:true,
			async handler(newRoute) {
				this.teamId = parseInt (this.$route.params.teamId);
				try {
					if(await this.getUsers(this.teamId))
						await this.getAllUsers();
					const found:Team = await this.ui.api.get("/api/v1/teams/team" + this.teamId);
					if(found !== undefined) {
						this.team = found.teamName;
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
		activities: {
			immediate: true,
			handler (newActivities: UserActivity[]) {
				
				if(newActivities.length !== 0) {
					newActivities.forEach( (activity:UserActivity) => {
						(activity as any).stringDate = activity.date;
					});
					this.weeks = newActivities;
				}
				
				//TODO PARSE DATA
			}
		},
		mentoredUser: {
			immediate:true,
			async handler(newUser:User) {
				const newUserId=(newUser as any).UserTeams_userId;
				if(newUserId !== 0) {
					const response = await this.ui.api.post("/api/v1/teams/teamactivity", {
						userId: newUserId,
						teamId: this.teamId
					});
					if(response) {
						this.weeks = response.data;
						this.weeks.forEach( (week) => {
							(week as any).stringDate = week.date;
						})
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
			activities: [] as UserActivity[],
			weeks: []  as UserActivity[],
			editDialog: false,
			viewDialog:false,
			users:[] as User[],
			allUsers:[] as User[],
			userId:0,
			teamId:0,
			edited:(null as any),
			mentoredUser:{},
			team:"",
			loadingPage:false,
			extendedImage: "",
			extendDialog: false,
		};
	},
	methods: {
		extendImage(image: string) {
			this.extendedImage = image;
			this.extendDialog = true;
		},
		formatDate(date: Date) {
			// const time  = (new Date(date)).toTimeString().split(" ");
			return (new Date(date)).toDateString();
		},
		moment() {
			return moment();
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
					this.users = await this.modifyUsers(response.data);
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
					this.allUsers = await this.modifyUsers(response.data);
					this.allUsers = this.allUsers.filter((user:User) => { return !this.hasUser(user)});
					return true;
				}
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		async modifyUsers(users: any[]) {
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
				if(users[index].avatarUu !== "" && users[index].avatarUu !== undefined && users[index].avatarUu !== null){
					users[index].image = await this.getUserImage(users[index].avatarUu, users[index].UserTeams_userId);
				} else {
					users[index].image = ""
				}
			}
			return users;
		},
		async getUserImage(avatar:string,userId:number):Promise<String> {
			if(avatar !== "" && avatar !== null) {
				if(userId !== 0) {
					try {
						const response = await this.ui.api.post("/api/v1/uploadDownload/get/file/user/avatar", {userId:userId});
						if(response.status === 200) {
							return response.data;
						} else if(response.status === 500) {
							// this.snackOptions.text = "Server Error while Loading User Avatar";
							// this.snackOptions.type = SnackBarTypes.ERROR;
							// this.snackOptions.timeout = 2000;
							// this.snackbar = true;
							return "";
						} else {
							return "";
						}
					} catch (e) {
						if(e.status === 500) {
							console.error(e);
							// this.snackOptions.text = "Server Error while Loading User Avatar";
							// this.snackOptions.type = SnackBarTypes.ERROR;
							// this.snackOptions.timeout = 2000;
							// this.snackbar = true;
						}
						return "";
					}
				} else {
					return "";
				}
			} else {
				return "";
			}
		},
		editActivity(week:any) {
			this.editDialog = true;
			this.edited = week;
		},
		viewActivity(week:any) {
			this.viewDialog = true;
			this.edited = week;
		},
		async saveActivity(week:UserActivity) {
			this.loadingPage=true;
			this.editDialog = false;
			try {
				let response = await this.ui.api.post("/api/v1/teams/teamactivity/update", {
					activity: {
						noOfHours:week.noOfHours,
						description:week.description,
						userId:week.userId,
						activityId:week.activityId,
						date:week.date,
						teamId:week.teamId
					} as UserActivity
				});	
				response = await this.ui.api.post("/api/v1/teams/teamactivity", {
					userId: this.userId,
					teamId: this.teamId
				});
				if(response) {
					this.activities = response.data;
				}
				this.edited=null;
			} catch (e) {
				console.error(e);
			}
			this.loadingPage=false;
		
		},
		denyActivity() {
			this.edited = {};
			this.editDialog = false;
		},
		closeView() {
			this.edited = {};
			this.viewDialog = false;
		},
	}
});
</script>