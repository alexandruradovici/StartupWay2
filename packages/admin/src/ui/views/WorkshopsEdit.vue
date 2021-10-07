<template>
	<div>
		<v-card flat  style="margin-left: auto; margin-right: auto; padding-top: 20px;" >
			<v-card-title class="justify-center" style=" font-weight: bold;">Workshops Attendance List</v-card-title>
			<v-divider></v-divider>
			
			<v-card-text>
				<div align="center" class="justify-center" style="margin-bottom: 20px;">
					<v-row no-gutters align="center">
						<v-col  cols="12" sm="6" md="6" lg="6" xl="6" align="center">
							<v-btn rounded color="primary" @click="openWorkshopDialog()">Add Workshop</v-btn>
						</v-col>
						<v-col  cols="12" sm="6" md="6" lg="6" xl="6" align="center">
							<v-btn rounded color="primary" @click="openInstanceDialog()">Add Teams to Workshop</v-btn>
						</v-col>
					</v-row>
				</div>
				<v-divider></v-divider>
				<div align="center" style="margin-top: 20px;">Please select a workshop from the list to check the participants.</div>
				<div align="center">
					<v-select
						:items="workshops"
						v-model="selected"
						item-text="workshopName"
						item-value="workshopId"
						label="Workshop"
						class="justify-center"
						style="width:500px;"
						align="center"
					></v-select>
				</div>
				
				
				<div v-if="selected">
					<v-card flat outlined width="930" class="justify-center" v-for="(workshop, date) in instances" :key="date">
						<v-card-title class="justify-center" style="">
							{{ date }}
						</v-card-title>
						<v-card-text>
							<v-row>
								<div v-for="(team,idx) in activeUsers[date]" :key="idx">
									<v-col>
										<v-card flat outlined width="250">
											<v-card-title class="justify-center" style="">{{team.teamName}}</v-card-title>
											<v-list-item v-for="(user, index) in team.users" :key="index">
												<v-list-item-content>
													<v-row>
														<v-col cols="8">
															<h3 style="">
																{{ user.firstName }} {{ user.lastName }}
															</h3>
														</v-col>
														<v-col cols="4">
															<div v-if="user.programmingDetails['present']" style="color: gray;"> Present</div>
															<div v-else style="color: gray;"> Absent</div>
														</v-col>
													</v-row>
													
												</v-list-item-content>
											</v-list-item>
										</v-card>
									</v-col>
								</div>
							</v-row>
						</v-card-text>
					</v-card>
				</div>
			</v-card-text>
		</v-card>
		<v-dialog persistent v-model="instanceDialog" width="400">
			<v-card width="400">
				<v-card-title  class="justify-center" style="">Add Instance</v-card-title>
				<v-card-text>
					<v-select 
					:items="viewWorkshops" 
					item-text="name"
					item-value="value"
					v-model="workshop" 
					label="Workshop" 
					optional>
					</v-select>
					<v-text-field color="primary" v-model="trainer" label="Trainer Name" optional></v-text-field>
					<v-menu
						ref="dateMenu"
						v-model="dateMenu"
						:close-on-content-click="false"
						:return-value.sync="date"
						transition="scale-transition"
						offset-y
						max-width="290px"
						min-width="290px"
					>
						<template v-slot:activator="{ on }">
							<v-text-field
								v-model="date"
								label="Date"
								persistent-hint
								prepend-icon="event"
								v-on="on"
							></v-text-field>
						</template>
						<v-date-picker v-model="date" no-title>
							<v-spacer></v-spacer>
							<v-btn text color="primary" @click="dateMenu = false">Cancel</v-btn>
							<v-btn text color="primary" @click="$refs.dateMenu.save(date)">OK</v-btn>
						</v-date-picker>
					</v-menu>
					<v-select
						:items="auxViewTeams"
						item-text="name"
						item-value="value"
						v-model="teams" 
						label="Teams"
						multiple
						bottom
						optional
					></v-select>
					<v-text-field color="primary" v-model="details" label="Details" optional></v-text-field>
				</v-card-text>
				<v-card-actions class="justify-center">
					<v-btn rounded color="primary" text @click="addInstance()">Add</v-btn>
					<v-btn color="primary" text @click="deny('instance')">Exit</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog persistent v-model="workshopDialog" width="400">
			<v-card width="400">
				<v-card-title  class="justify-center" style="">Add Workshop</v-card-title>
				<v-card-text>
					<v-text-field v-model="workshopName" label="Workshop Name" optional></v-text-field>
				</v-card-text>
				<v-card-actions class="justify-center">
					<v-btn color="primary" rounded @click="addWorkshop()">Add</v-btn>
					<v-btn color="primary" text @click="deny('workshop')">Exit</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import Vue from "vue";
import { User, UserDetails, UserExtended } from "@startupway/users/lib/ui";
import { Team, Product } from "@startupway/teams/lib/ui";
import { Workshop, WorkshopInstances,WorkshopAttendances } from "@startupway/workshop/lib/ui";
import { UI } from '@startupway/main/lib/ui';
import _ from "lodash";
export default Vue.extend({
	name: "WorkshopsEdit",
	async mounted() {
		try {
			const response = await this.ui.api.get<Workshop[]>("/api/v1/workshop/workshops");
			if (response.data) {
				this.workshops = response.data;
			}
		} catch (e) {
			console.error(e);
		}
	},
	data() {
		return {
			ui: UI.getInstance(),
			dateMenu: false,
			allUsers:[] as User[],
			workshops:[] as Workshop[],
			viewWorkshops:[] as {"name":string,"value":string}[],
			teams:[] as Team[],
			viewTeams:[] as {"name":string,"value":string}[],
			auxViewTeams:[] as {"name":string,"value":string}[],
			allTeams:[] as (Team & Product)[],
			date: new Date().toISOString().substr(0, 10),
			instanceDialog:false,
			workshopDialog:false,
			workshop:"",
			trainer:"",
			details:"",
			workshopName:"",
			activeUsers: {} as UserDetails,
			instances: {} as {[key:string]:WorkshopInstances},
			teamIds: [] as string[],
			selected: "",
			attendance: [] as WorkshopAttendances[],
		};
	},
	watch: {
		user: {
			immediate:true, 
			async handler (newUser:User):Promise<void> {
				if (newUser.role === "Admin" || newUser.role === "SuperAdmin"){
					try {
						const response = await this.ui.api.get<((Team & Product)[])>("/api/v1/admin/teams/"+newUser.userDetails["location"]);
						if (response) {
							this.allTeams = response.data;
						}
						const respW = await this.ui.api.get<Workshop[]>("/api/v1/workshop/workshops");
						if (respW) {
							this.workshops = respW.data;
						}
					} catch(e) {
						console.error(e);
					}
				} else {
					if (this.$route.path!=="/workspace")
						this.$router.push("/workspace");
				}
				
			}
		},
		allTeams: {
			immediate: true,
			handler (newTeams: (Team & Product)[]):void {
				newTeams.forEach((team) => {
					this.viewTeams.push({
						"name":team.teamName,
						"value":team.teamId
					})
				});
				this.auxViewTeams = this.viewTeams;
			},
		},
		workshops: {
			immediate: true,
			handler (newWorkshops: Workshop[]):void {
				this.viewWorkshops = [];
				newWorkshops.forEach((workshop:Workshop) => {
					this.viewWorkshops.push({
						"name": workshop.workshopName,
						"value":workshop.workshopId
					})
				});
			},
		},
		selected: {
			immediate: true,
			async handler(newWorkshopId: string):Promise<void> {
				await this.getWorkshopInstances(newWorkshopId);
				await this.getAttendance(newWorkshopId);
				for (var date in this.instances) {
					this.activeUsers[date] = new Array();
					if (Object.prototype.hasOwnProperty.call(this.instances, date)) {
						// as any this.instances = _.Dictionary<WorkshopInstances> | {[key:string]:WorkshopInstances} ?
						for (const workshop of (this.instances as any)[date]) {
							const response = await this.ui.api.get("/api/v1/teams/team/users/" + workshop.teamId);
							if (response) {
								let name = "";
								for (const team of this.teams) {
									if (this.user.role === "Admin") {
										if (team.teamId === workshop.teamId)
											name = team.teamName;
									} else if (this.user.role === "Mentor") {
										if (team.teamId === workshop.teamId)
											name = team.teamName;
									}
								}
								const users = response.data;
								users.forEach((user: UserExtended) => {
									const tempUser: UserExtended = user;
									tempUser.programmingDetails = {};
									tempUser.programmingDetails["team"] = name;
									tempUser.programmingDetails["teamId"] = workshop.teamId;
									const foundAttended = _.find(this.attendance, (userAttendance: WorkshopAttendances) => {
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
		},
		workshop: {
			immediate: true,
			async handler(newWorkshopId: string):Promise<void> {
				const instances = [];
				if (newWorkshopId) {
					const response = await this.ui.api.get<WorkshopInstances[]>(
						"/api/v1/workshop/mentor/instances/" + newWorkshopId
					);
					this.auxViewTeams = [];
					for(const wInst of response.data) {
						// as any this.instances = _.Dictionary<WorkshopInstances> | {[key:string]:WorkshopInstances} ?
						instances.push(...(wInst as any));
					}
					for (const instance of instances) {
						this.auxViewTeams.push(...this.viewTeams.filter(team => {
							return team.value !== (instance as WorkshopInstances).teamId;
						}));
					} 
				}
			}
		},
	},
	computed: {
		...mapGetters({
			user:"users/user"
		})
	},
	methods: {
		modifyUsers(users:User[]):User[] {
			// users.forEach(element => {
			// 	if (element.role){
			// 		const roleObj = element.role;
			// 		for(const prop in roleObj) {
			// 			if (Object.prototype.hasOwnProperty.call(roleObj, prop)) {
			// 				// as any to replace role: {"Role_name":true} with "Role_name"
			// 				(element.role as any) = prop;
			// 			}
			// 		}
			// 	}
				
			// });
			return users;
		},
		async getWorkshopInstances(newWorkshopId: string):Promise<boolean> {
			try {
				if (newWorkshopId) {
					if (this.user.role === "Mentor") {
						const response = await this.ui.api.get<(Team & Product)[]>("/api/v1/teams/mentor/teams/" + this.user.userId);
						if (response) this.teams = response.data;
					} else if (this.user.role === "Admin") {
						const response = await this.ui.api.get<(Team & Product)[]>("/api/v1/admin/teams/");
						if (response) this.teams = response.data;
					}
					if (this.teams.length > 0) {
						for (const team of this.teams) {
							this.teamIds.push((team as Team).teamId);
						}
						const response = await this.ui.api.get<_.Dictionary<WorkshopInstances>>(
							"/api/v1/workshop/mentor/instances/" + newWorkshopId
						);
						if (response) {
							this.instances = response.data;
							return true;
						} 
					}
				}
			} catch (e) {
				console.error(e);
				return false;
			}
			return false;
		},
		async getAttendance(newWorkshopId: string):Promise<boolean> {
			try {
				if (newWorkshopId) {
					const response = await this.ui.api.get<WorkshopAttendances[]>("/api/v1/workshop/attendance/" + newWorkshopId);
					if (response) {
						this.attendance.push(...response.data);
						return true;
					}
				}
			} catch (e) {
				console.error(e);
				return false;
			}
			return false;
		},
		openWorkshopDialog():void {
			this.workshopDialog = true;
		},
		openInstanceDialog():void {
			this.instanceDialog = true;
		},
		async addInstance():Promise<void>{
			try {
				const instances = await this.ui.api.post<WorkshopInstances[]>("/api/v1/workshop/add/instance", {
					workshopId:this.workshop,
					teamIds:this.teams,
					date:this.date,
					details:this.details,
					trainer:this.trainer,
				});
				if (instances.data) {
					const aux = this.selected;
					this.selected = "";
					this.selected = aux;
					this.workshop =  "";
					this.teams = [];
					this.date = "";
					this.details = "";
					this.trainer = "";
					this.instanceDialog = false;
				}
			} catch (e) {
				console.error(e)
			}
		},
		async addWorkshop():Promise<void>{
			try {
				const workshop = {
					workshopName:this.workshopName
				}
				const newWorkshop = await this.ui.api.post<Workshop | null>("/api/v1/workshop/add",
					workshop
				);
				if (newWorkshop.data) {
					const response = await this.ui.api.get<Workshop[]>("/api/v1/workshop/workshops");
					if (response) {
						this.workshops = response.data;	
						this.workshopName = "";
						this.workshopDialog = false;
					}
				}
			} catch (e) {
				console.error(e)
			}
		},
		deny(type:string):void{
			if (type === "instance") {
				this.date = new Date().toISOString().substr(0, 10);
				this.trainer = "",
				this.workshop = "",
				this.details = "", 
				this.teams = [], 
				this.instanceDialog = false;
			} else if (type === "workshop") {
				this.workshopName = "";
				this.workshopDialog = false;
			}
			
		},
		async getAllUsers():Promise<void> {
			try {
				const response = await this.ui.api.get<User[]>("/api/v1/users/users");
				if (response) {
					this.allUsers = this.modifyUsers(response.data);
				}
			} catch (e) {
				console.error(e);
			}
		},
	}
});
</script>

<style lang="less">
</style>