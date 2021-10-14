<template>
	<div>
		<v-container v-if="!loadingPage">
			<v-card flat style="margin: auto; margin-top: 50px;" max-width="1000" >
				<v-divider></v-divider>
				<v-card-text style="margin-top: 20px;">
					<div>
						<v-row v-if="weeks.length > 0">
							<v-col cols="12" sm="6" md="4" lg="4" xl="4" v-for="week in weeks" :key="week.activityId">
								<v-card flat outlined>
									<v-card-title class="justify-center" style="font-size: 15px; font-weight: bold;">
										{{formatDate(week.date)}}
									</v-card-title>
									<v-divider></v-divider>
									<v-card-text>
										<div style="text-align: center;">Number of hours worked: {{week.noOfHours}}</div>
										<div style="text-align: center;">Work Description: {{week.description}}</div>
									</v-card-text>
									<v-card-actions class="justify-center">
										<v-btn icon fab @click="enableEdit(week)">
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
									You have no activities in this team so far.
								</h1>
							</v-col>
						</v-row>
					</div>
				</v-card-text>
			</v-card>
			<v-dialog v-model="editDialog" max-width="450">
				<v-card flat width="450" v-if="edited">
					<v-card-title class="justify-center" style="">
						{{formatDate(edited.date)}}
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<div class="details">
							Please submit the number of worked hours during this week.
						</div>
						<v-text-field
							v-model="edited.noOfHours"
							append-icon="mdi-calendar-clock"
							single-line
							color="primary"
						></v-text-field>
						<div class="details">
							Please submit a short description for your weekly activity.
						</div>
						<v-text-field
							v-model="edited.description"
							append-icon="mdi-calendar-clock"
							single-line
							color="primary"
						></v-text-field>
					</v-card-text>

					<v-card-actions class="justify-center">
						<v-btn color="primary" rounded @click="updateWeek(edited)">Update progress</v-btn>
						<v-btn color="primary" text @click="denyActivity">Exit</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<v-dialog v-model="viewDialog" max-width="450">
				<v-card flat width="450" v-if="edited">
					<v-card-title class="justify-center" style="">
						View activity
					</v-card-title>
					<v-card-subtitle class="justify-center">
						<div align="center">{{formatDate(edited.date)}}</div>
					</v-card-subtitle>
					<v-divider></v-divider>
					<v-card-text style="margin-top: 30px;">
						<div class="details">
							Number of worked hours for during this week: {{edited.noOfHours}}
						</div>
						<div class="details">
							Work description: {{edited.description}}
						</div>
					</v-card-text>

					<v-card-actions class="justify-center">
						<v-btn color="primary" text @click="closeView">Exit</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<SnackBar :options="snackOptions"  @update-snackbar="updateSnack" :snackbar="snackbar"/>
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
import { User } from "@startupway/users/lib/ui";
import { UI } from '@startupway/main/lib/ui';
import { UserActivity, Team, Product } from "../../common";
import { SnackBarOptions, SnackBarTypes, SnackBarHorizontal, SnackBarVertical } from "@startupway/menu/lib/ui";
import moment from "moment";
interface IWeeklyUpdates {
	ui: UI,
	loadingPage: boolean,
	activities:UserActivity[],
	teamId: string,
	userId: string,
	date: Date,
	//date:"2020-03-15T22:00:00.000Z",
	edited: UserActivity | null,
	tab: null,
	editDialog: boolean,
	viewDialog: boolean,
	hoursWorked: number,
	description: string,
	weeks: UserActivity[],
	snackbar: boolean,
	snackOptions: SnackBarOptions
}
export default Vue.extend({
	name: "WeeklyUpdates",
	async mounted() {
	},
	watch: {
		currentTeam: {
			immediate: true,
			async handler (newTeam: Team):Promise<void> {
				this.loadingPage = true;
				if (this.currentTeam) {
					this.teamId = newTeam.teamId;
					if (this.teamId === "") {
						if (this.$route.path!=="/workspace")
							this.$router.push("/workspace");
					} else {
						try {
							if (!this.userId) {
								this.userId = this.user.userId;
							}
							const response = await this.ui.api.post<UserActivity[]>("/api/v1/teams/team/activity", {
								userId: this.userId,
								teamId: this.teamId
							});
							if (response) {
								this.activities = response.data;
							}
						} catch(e) {
							console.error(e)
						}
					}
				}
				this.loadingPage = false;
			}
		},
		user: {
			immediate: true,
			async handler (newUser: User):Promise<User> {
				this.loadingPage = true;
				if (this.user) {
					this.userId = newUser.userId;
					if (this.userId === "") {
						if (this.$route.path!=="/workspace")
							this.$router.push("/workspace");
					} else {
						try {
							const response = await this.ui.api.post<UserActivity[]>("/api/v1/teams/team/activity", {
								userId: this.userId,
								teamId: this.teamId
							});
							if (response) {
								this.activities = response.data;
							}
						} catch(e) {
							console.error(e)
						}
					}
				}
				this.loadingPage = false;
				return newUser;
			}
		},
		activities: {
			immediate: true,
			handler (newActivities: UserActivity[]):void {
				this.loadingPage = true;
				if (newActivities.length !== 0) {
					newActivities.forEach( (activity:UserActivity) => {
						(activity as UserActivity & {stringDate:string}).stringDate = (moment(activity.date).format('[Week:] Do [of] MMMM'));
					});
					this.weeks = newActivities;
				}
				this.loadingPage = false;
				//TODO PARSE DATA
			}
		}
	},
	computed: {
		...mapGetters ({
			currentTeam: "teams/currentTeam",
			user: "users/user"
		}),
	},
	data (): IWeeklyUpdates {
		return {
			ui: UI.getInstance(),
			loadingPage:false,
			activities:[],
			teamId:"",
			userId:"",
			date: new Date(),
			//date:"2020-03-15T22:00:00.000Z",
			edited:null as UserActivity | null,
			tab: null,
			editDialog: false,
			viewDialog: false,
			hoursWorked:0,
			description:"",
			weeks:[],
			snackbar: false,
			snackOptions: {
				text:"",
				type: SnackBarTypes.INFO,
				timeout:2000,
				horizontal: SnackBarHorizontal.RIGHT,
				vertical: SnackBarVertical.BOTTOM
			}
		};
	},
	methods: {
		updateSnack (prop:boolean): void {
			console.log("got update event");
			this.snackbar = prop;
		},
		moment() {
			return moment();
		},
		formatDate(date: Date):string {
			// const time  = (new Date(date)).toTimeString().split(" ");
			return (new Date(date)).toDateString();
		},
		formatDateTime(date: Date):string {
			const time  = (new Date(date)).toTimeString().split(" ");
			return (new Date(date)).toDateString() + " " + time[0];
		},
		verifyDate(week:UserActivity):boolean {
			const index = this.weeks.indexOf(week);
			const curr = moment(week.date).toDate();
			let next = undefined;
			let nextNext = undefined;
			if (this.weeks[index+1] !== undefined)
				next = moment(this.weeks[index+1].date).toDate();
			if (this.weeks[index+2] !== undefined)
				nextNext = moment(this.weeks[index+2].date).toDate();
			if (moment(this.date).isBetween(next,nextNext,undefined,'[)')){
				return true;
			} else return moment(this.date).isBetween(curr,next,undefined,'[)');
		},
		enableEdit(week:UserActivity):void {
			this.editDialog=true;
			this.edited = week;
		},
		viewActivity(week:UserActivity):void {
			this.viewDialog=true;
			this.edited = week;
		},
		async updateWeek(week:UserActivity):Promise<void> {
			this.loadingPage = true;
			try {
				await this.ui.api.post<UserActivity | null>("/api/v1/teams/team/activity/update",
					{
						noOfHours:week.noOfHours,
						description:week.description,
						userId:week.userId,
						activityId:week.activityId,
						date:week.date,
						teamId:week.teamId
					} as UserActivity
				);	
				const response = await this.ui.api.post<UserActivity[]>("/api/v1/teams/team/activity", {
					userId: this.userId,
					teamId: this.teamId
				});
				if (response.data) {
					this.activities = response.data;
					this.snackOptions.text = "Activity successfully updated!";
					this.snackOptions.type = SnackBarTypes.SUCCESS;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				}
				this.editDialog=false;
				this.edited=null;
			} catch (e) {
				console.error(e);
				this.snackOptions.text = "Server Error while Updating the activity. If the error persists, please contact technical support: teams@tech-lounge.ro.",
				this.snackOptions.type = SnackBarTypes.ERROR;
				this.snackOptions.timeout = 2000;
				this.snackbar = true;
			}
			try {
				const resp = await this.ui.api.get<Product | null>("/api/v1/teams/product/" + this.teamId);
				if (resp.data) {
					resp.data.updatedAt = (this.formatDateTime(new Date()) as unknown as Date) ;
					try {
						await this.ui.api.post("/api/v1/teams/product/update", {
							product: resp.data,
							upload: "",
							ext: ".pptx",
							teamId: this.teamId
						});
					} catch (e) {
						console.error(e);
					}
				}
			} catch (e) {
				console.error(e);
			}
			this.loadingPage=false;
		},
		denyActivity():void {
			this.edited = null;
			this.editDialog = false;
		},
		closeView():void {
			this.edited = null;
			this.viewDialog = false;
		},
	},
});
</script>
