<template>
	<div>
		<v-container v-if="!loadingPage" class="content" fluid pl-7 pr-7>
				<v-divider></v-divider>
				<v-card flat style="margin: auto;" width="800" color="#fcfcfc">
					<v-list nav dense color="#fcfcfc">
						<v-list-item v-for="user in users" :key="user.email">
							<v-list-item-avatar>
								<v-img v-if="user.image !== ''" :src="user.image"></v-img>
								<v-icon v-else color="primary">mdi-account-circle mdi-48px</v-icon>
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title style=" font-size: 17px; font-weight: 700;"> {{ user.firstName }} {{ user.lastName }}</v-list-item-title>
								<v-list-item-subtitle style=" font-size: 15px; font-weight: 550;" v-if="user.role !== ''">
									{{user.role}}
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
					<v-card color="#fcfcfc" v-if="mentoredUser.userId" flat style="margin: auto; padding-top: 20px;" >
						
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
						<v-card flat width="450" v-if="edited">
							<v-card-title class="justify-center" style="">
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
						<v-card flat width="450" v-if="edited">
							<v-card-title class="justify-center" style="">
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
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Team, Product, UserActivity } from "../../../common";
import { User, UserTeams} from "@startupway/users/lib/ui";
import moment from "moment";
import { UI } from '@startupway/main/lib/ui';
export default Vue.extend({
	name: "UserActivities",
	watch: {
		$route:{
			immediate:true,
			async handler(newRoute):Promise<void> {
				this.loadingPage = true;
				this.teamId = this.$route.params.teamId;
				try {
					if (await this.getUsers(this.teamId))
						await this.getAllUsers();
					const found = await this.ui.api.get<Team | null>("/api/v1/teams/team/" + this.teamId);
					if (found.data) {
						this.team = found.data.teamName;
					}
				} catch (e) {
					console.error(e);
				}
				this.loadingPage = false;
			}
		},
		user: {
			immediate: true,
			async handler(newUser: User):Promise<void>  {
				this.loadingPage = true;
				if (newUser) {
					if (newUser.role === "Admin" || newUser.role === "SuperAdmin") {
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
				this.loadingPage = false;
			}
		},
		activities: {
			immediate: true,
			handler (newActivities: UserActivity[]):void {
				this.loadingPage = true;
				if (newActivities.length !== 0) {
					newActivities.forEach( (activity:UserActivity) => {
						(activity as UserActivity & {stringDate:Date | string}).stringDate = activity.date;
					});
					this.weeks = newActivities;
				}
				this.loadingPage = false;
				//TODO PARSE DATA
			}
		},
		mentoredUser: {
			immediate:true,
			async handler(newUser:(User & UserTeams)):Promise<void>  {
				this.loadingPage = true;
				if (newUser) {
					const newUserId=newUser.userId;
					if (newUserId) {
						const response = await this.ui.api.post<UserActivity[]>("/api/v1/teams/team/activity", {
							userId: newUserId,
							teamId: this.teamId
						});
						if (response.data) {
							this.weeks = response.data;
							this.weeks.forEach( (week) => {
								(week as (UserActivity & {stringDate:Date | string})).stringDate = week.date;
							})
						}
					}
				}
				this.loadingPage = false;
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
			teams: [] as (Team[] | (Team&Product)[]),
			location: "" as string,
			activities: [] as UserActivity[],
			weeks: []  as UserActivity[],
			editDialog: false,
			viewDialog:false,
			users:[] as User[],
			allUsers:[] as User[],
			userId:"",
			teamId:"",
			edited:null as UserActivity | null,
			mentoredUser:{},
			team:"",
			loadingPage:false,
			extendedImage: "",
			extendDialog: false,
		};
	},
	methods: {
		extendImage(image: string):void {
			this.extendedImage = image;
			this.extendDialog = true;
		},
		formatDate(date: Date):string {
			// const time  = (new Date(date)).toTimeString().split(" ");
			return (new Date(date)).toDateString();
		},
		moment() {
			return moment();
		},
		hasUser(user:(User&UserTeams) | User):boolean{
			for(const aux of this.users) {
				if (aux.userId === user.userId) {
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
					this.allUsers = this.allUsers.filter((user:User) => { return !this.hasUser(user)});
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
		async getUserImage(avatar:string,userId:string):Promise<string> {
			if (avatar !== "" && avatar !== null) {
				if (userId !== "") {
					try {
						const response = await this.ui.api.post<string | null>("/api/v1/uploadDownload/get/file/user/avatar", {userId:userId});
						if (response.data) {
							return response.data;
						} else if (response.status === 500) {
							// this.snackOptions.text = "Server Error while Loading User Avatar";
							// this.snackOptions.type = SnackBarTypes.ERROR;
							// this.snackOptions.timeout = 2000;
							// this.snackbar = true;
							return "";
						} else {
							return "";
						}
					} catch (e) {
						if (e.status === 500) {
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
		editActivity(week:UserActivity):void {
			this.editDialog = true;
			this.edited = week;
		},
		viewActivity(week:UserActivity):void {
			this.viewDialog = true;
			this.edited = week;
		},
		async saveActivity(week:UserActivity):Promise<void>  {
			this.loadingPage=true;
			this.editDialog = false;
			try {
				await this.ui.api.post<UserActivity | null>("/api/v1/teams/team/activity/update", {
					activity: {
						noOfHours:week.noOfHours,
						description:week.description,
						userId:week.userId,
						activityId:week.activityId,
						date:week.date,
						teamId:week.teamId
					} as UserActivity
				});	
				const respArr = await this.ui.api.post<UserActivity[]>("/api/v1/teams/team/activity", {
					userId: this.userId,
					teamId: this.teamId
				});
				if (respArr) {
					this.activities = respArr.data;
				}
				this.edited=null;
			} catch (e) {
				console.error(e);
			}
			this.loadingPage=false;
		
		},
		denyActivity() {
			this.edited = null;
			this.editDialog = false;
		},
		closeView() {
			this.edited = null;
			this.viewDialog = false;
		},
	}
});
</script>