<template>
	<v-app>
		<v-container>
			<v-select
				:items="workshops"
				v-model="selected"
				item-text="workshopName"
				item-value="workshopId"
				label="Workshop"
			></v-select>
			<v-container v-if="selected">
				<v-item-group>
					<v-row>
						<v-col v-for="(workshop, date) in instances" :key="date">
							<v-card>
								<v-card-title primary-title>
									{{ date }}
								</v-card-title>
								<v-card-text>
									<v-list>
										<v-list-item-group v-for="(team,idx) in activeUsers[date]" :key="idx">
											<v-card>
												<v-card-title>{{team.teamName}}</v-card-title>
												<v-list-item v-for="(user, index) in team.users" :key="index">
													<v-list-item-content>
														{{ user.firstName }} {{ user.lastName }}
														<h3 v-if="user.programmingDetails['present']">Present</h3>
													</v-list-item-content>
													<v-list-item-action>
														<v-btn text @click="pushToAttendance(user, date)">Present</v-btn>
													</v-list-item-action>
												</v-list-item>
											</v-card>
										</v-list-item-group>
									</v-list>
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>
				</v-item-group>
				<v-btn @click="submitAttendance()" color="primary">Submit</v-btn>
			</v-container>
		</v-container>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import {
	Workshop,
	WorkshopAttendances,
	WorkshopInstances
	// Team,
	// WorkshopInstances,
	// WorkshopInstancesExtended,
	// WorkshopAttendances
} from "../../common";
import { User, UserExtended,UserDetails} from "@startupway/users/lib/ui";
import { UI } from "@startupway/main/lib/ui";
import * as _ from "lodash";
export default Vue.extend({
	name: "Workshop",
	async mounted() {
		try {
			let response = await this.ui.api.get("/api/v1/workshops");
			if (response) {
				this.workshops = response.data;
			}
		} catch (e) {
			console.error(e);
		}
	},
	data() {
		return {
			ui: UI.getInstance(),
			workshops: [] as Workshop[],
			activeUsers: {} as UserDetails,
			instances: {},
			teamIds: [] as number[],
			// as any same as canvas
			teams: [] as any,
			selected: 0 as number,
			attendance: [] as WorkshopAttendances[],
			userRole: false
		};
	},
	watch: {
		user: {
			immediate: true,
			async handler(newUser: User):Promise<void> {
				if (newUser.role["Mentor"]) {
					this.userRole = newUser.role["Mentor"];
				} else if(newUser.role["Admin"]) {
					this.userRole = newUser.role["Admin"];
				} else if(newUser.role["SuperAdmin"]) {
					this.userRole = newUser.role["SuperAdmin"];
				}
			}
		},
		selected: {
			immediate: true,
			async handler(newWorkshopId: number):Promise<void> {
				await this.getWorkshopInstances(newWorkshopId);
				await this.getAttendance(newWorkshopId);
				for (var date in this.instances) {
					this.activeUsers[date] = new Array();
					if (Object.prototype.hasOwnProperty.call(this.instances, date)) {
						// as any this.instances = _.Dictionary<WorkshopInstances> | {[key:string]:WorkshopInstances} ?
						for (let workshop of (this.instances as any)[date]) {
							let response = await this.ui.api.get("/api/v1/teams/team/users/" + workshop.teamId);

							if (response) {
								let name = "";
								for (let team of this.teams) {
									if (this.user.role["Admin"]) {
										if(team.teams_teamId === workshop.teamId)
											name = team.teams_teamName;
									} else if(this.user.role["Mentor"]) {
										if(team.teamId === workshop.teamId)
											name = team.teams_teamName;
									}
								}
								let users = response.data;

								users.forEach((user: UserExtended) => {
									let tempUser: UserExtended = user;
									tempUser.programmingDetails = {};
									tempUser.programmingDetails["team"] = name;
									tempUser.programmingDetails["teamId"] = workshop.teamId;
									let foundAttended = _.find(this.attendance, (userAttendance:WorkshopAttendances) => {
										return userAttendance.userId === user.userId;
									});
									user.programmingDetails["present"] = foundAttended !== undefined ? true : false;
									user = tempUser;
								});
								this.activeUsers[date].push({
									teamName:name,
									users:users
								});
								this.$forceUpdate();
							}
						}
					}
				}
			}
		}
	},
	computed: {
		...mapGetters({
			currentTeam: "teams/currentTeam",
			user: "users/user"
		})
	},
	methods: {
		async getWorkshopInstances(newWorkshopId: number):Promise<boolean> {
			try {
				if (this.user.role["Mentor"]) {
					// as any same as canvas
					let response = await this.ui.api.get<any[]>("/api/v1/teams/mentor/teams/" + this.user.userId);
					if (response) this.teams = response.data;
				} else if(this.user.role["Admin"]) {
					// as any same as canvas
					let response = await this.ui.api.get<any[]>("/api/v1/admin/teams/");
					if (response) this.teams = response.data;
				}
				if (this.teams.length > 0) {
					for (let team of this.teams) {
						// as any same as canvas
						this.teamIds.push((team as any).teamId);
					}
					let response = await this.ui.api.get<WorkshopInstances[]>(
						"/api/v1/workshop/mentor/instances/" + newWorkshopId
					);
					if (response) {
						this.instances = response.data;
						return true;
					} 
				}
			} catch (e) {
				console.error(e);
				return false;
			}
			return false;
		},
		async getAttendance(newWorkshopId: number):Promise<boolean> {
			try {
				let response = await this.ui.api.get<WorkshopAttendances[]>("/api/v1/workshop/attendance/" + newWorkshopId);
				if (response) {
					this.attendance.push(...response.data);
					return true;
				}
			} catch (e) {
				console.error(e);
				return false;
			}
			return false;
		},
		async pushToAttendance(user: UserExtended, date: Date):Promise<void> {
			let workshopInstanceId: number = 0;
			if (!user.programmingDetails["present"]) {
				// as any this.instances = _.Dictionary<WorkshopInstances> | {[key:string]:WorkshopInstances} ?
				for (let workshop of (this.instances as any)[(date as any) as string]) {
					if (workshop.teamId == user.programmingDetails["teamId"]) {
						workshopInstanceId = workshop.workshopInstanceId;
						break;
					}
				}
				user.programmingDetails["present"] = true;
				this.attendance.push({
					attendanceId:(null as unknown) as number,
					workshopInstanceId: workshopInstanceId,
					attendanceDate: date,
					userId: user.userId
				});
			} else {
				_.remove(this.attendance, (att:WorkshopAttendances) => {
					return att.userId === user.userId;
				});
				user.programmingDetails["present"] = false;
			}
			this.$forceUpdate();
		},
		async submitAttendance():Promise<void> {
			try {
				await this.ui.api.post<WorkshopAttendances[]>("/api/v1/workshop/attendance", {
					attendance: this.attendance,
					workshopId: this.selected
				});
			} catch (error) {
				console.error(error);
			}
			this.$forceUpdate();
			this.selected = this.selected;
		}
	}
});
</script>
