<template>
	<v-app id="app">
		<v-container v-if="!loadingPage" class="content" fluid pl-7 pr-7 >
			<div class="component-title">Edit Team</div>
			<v-divider></v-divider>
			<v-card flat style="margin: auto;" max-width="1000" color="#fcfcfc">
					<v-list nav dense color="#fcfcfc">
						<v-list-item
						v-for="user in users"
						:key="user.email"
						>
							<v-list-item-avatar size="60">
								<v-img v-if="user.image !== ''" :src="user.image" @click="extendImage(user.image)"></v-img>
								<v-icon v-else large>mdi-account</v-icon>
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title style="font-family: Georgia, serif; font-size: 17px; font-weight: 700;"> {{ user.firstName }} {{ user.lastName }}</v-list-item-title>
								<v-list-item-subtitle style="font-family: Georgia, serif; font-size: 15px; font-weight: 550;">{{ user.email }}</v-list-item-subtitle>
								<v-list-item-subtitle style="font-family: Georgia, serif; font-size: 15px; font-weight: 550;">{{ user.phone }}</v-list-item-subtitle>
								<v-row>
									<v-col md4 class="justify-center">
										<v-list-item-subtitle style="font-family: Georgia, serif; font-size: 15px; font-weight: 550;">{{ user.faculty }}</v-list-item-subtitle>
									</v-col>
									<v-col md4 class="justify-center">
										<v-list-item-subtitle style="font-family: Georgia, serif; font-size: 15px; font-weight: 550;">{{ user.group }}</v-list-item-subtitle>
									</v-col>
									<v-col md4 class="justify-center">
										<v-list-item-subtitle style="font-family: Georgia, serif; font-size: 15px; font-weight: 550;">{{ user.UserTeams_role }}</v-list-item-subtitle>
									</v-col>
								</v-row>
								<v-row>
									<v-col md4 class="justify-center">
										<v-checkbox disabled v-model="user.pitcher" label="Is Pitcher?"></v-checkbox>
									</v-col>
									<v-col md4 class="justify-center">
										<v-checkbox disabled v-model="user.participant" label="Comes to DemoDay?"></v-checkbox>
									</v-col>
									<v-col v-if="user.participant" md4 class="justify-center">
										<v-text-field disabled v-model="user.transport" label="Means of transport"></v-text-field>
									</v-col>
								</v-row>
							</v-list-item-content>

							<v-list-item-action>
								<v-btn icon @click="openDialog(user)">
									<v-icon small>mdi-pencil</v-icon>
								</v-btn>
								<v-spacer></v-spacer>
								<div v-if="user.socialMedia !== undefined">
									<v-icon v-if="user.socialMedia.facebook !== '' && user.socialMedia.facebook !== undefined" small @click="openLink(user.socialMedia.facebook)">
										mdi-facebook
									</v-icon>
									<v-icon v-if="user.socialMedia.linkedin !== '' && user.socialMedia.linkedin !== undefined " small @click="openLink(user.socialMedia.linkedin)">
										mdi-linkedin
									</v-icon>
									<v-icon v-if="user.socialMedia.webpage !== '' && user.socialMedia.webpage !== undefined " small @click="openLink(user.socialMedia.webpage)">
										mdi-web
									</v-icon>
								</div>
								<v-spacer></v-spacer>
								<v-btn icon @click="acceptDialog = true; remove=true, toDel = user">
									<v-icon small>mdi-close-circle</v-icon>
								</v-btn>
							</v-list-item-action>
						</v-list-item>
						<v-dialog v-model="extendDialog" max-width="450">
							<v-card flat max-width="450">
								<v-img :src="extendedImage"></v-img>
								<v-card-actions class="justify-center">
									<v-btn text color="primary" @click="extendDialog=false">Exit</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-dialog v-model="dialog" max-width="500px">
							<v-card flat>
								<v-form v-model="userValid" lazy-validation>
									<v-card-title class="justify-center" style="font-family: Georgia, serif;">Edit User Details</v-card-title>
									<v-divider></v-divider>
									<v-card-text style="margin-top: 50px;">
										<div class="details">Faculty</div>
										<v-select v-model="item.faculty" :items="universities" label="Faculty" optional></v-select>
										<div class="details">Group</div>
										<v-text-field outlined rounded color="primary" v-model="item.group" optional></v-text-field>
										<div class="details">Email</div>
										<v-text-field :rules="emailRules" outlined rounded color="primary" v-model="item.email" optional></v-text-field>
										<div class="details">Role</div>
										<v-select v-model="item.UserTeams_role" :items="roles" label="Role" optional></v-select>
										<div class="details">
											Is Pitcher?<v-checkbox v-model="item.pitcher"></v-checkbox>
										</div>
										<div class="details">
											Comes to DemoDay?<v-checkbox v-model="item.participant"></v-checkbox>
										</div>
										<div v-if="item.pitcher || item.participant">
											<div class="details" >
												Means of transport to DemoDay
											</div>
											<v-select v-model="item.transport" :items="['Train','Car','Plane','Other']" label="Transport" optional></v-select>
										</div>
									</v-card-text>
									<v-card-actions class="justify-center">
										<v-btn v-if="(!item.pitcher && !item.participant) || ((item.pitcher || item.participant) && item.transport !=='')" :disabled="!userValid" rounded color="primary" @click="updateUserInfo()">Apply changes</v-btn>
										<v-btn outlined rounded color="primary" @click="exitDialog()">Exit</v-btn>
									</v-card-actions>
								</v-form>
							</v-card>
						</v-dialog>
					</v-list>
					<v-card-actions class="justify-center">
						<v-btn color="primary" @click="addUsersDialog = true; add=true">Add Users</v-btn>	
					</v-card-actions>
			</v-card>
			<v-dialog v-model="acceptDialog" persistent max-width="350">
				<v-card v-if="remove">
					<v-card-title class="justify-center" style="font-family: Georgia, serif;">Remove Users</v-card-title>
					<v-card-text>Are you sure you want to remove this user?</v-card-text>
					<v-card-actions class="justify-center">
						<v-btn color="#32a852" text @click="accept('remove')">Yes</v-btn>
						<v-btn color="#a83232" text @click="deny()">No</v-btn>
					</v-card-actions>
				</v-card>
				<v-card v-else-if="add">
					<v-card-title class="justify-center" style="font-family: Georgia, serif;">Add Users</v-card-title>
					<v-card-text>Are you sure you want to add these users?</v-card-text>
					<v-card-actions class="justify-center">
						<v-btn color="green" text @click="accept('add')">Yes</v-btn>
						<v-btn color="red" text @click="deny()">No</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog v-model="addUsersDialog" persistent max-width="1000">
				<v-card>
					<v-card-title class="justify-center" style="font-family: Georgia, serif;">
						Add Users
					</v-card-title>
					<v-card-text>
						<v-data-table
							v-model="toAdd"
							item-key="email"
							:headers="headers2"
							:items="allUsers"
							:search="search2"
							:loading="loading"
							show-select>
							<template v-slot:top>
								<v-text-field
									v-model="search2"
									append-icon="search"
									label="Search"
									single-line
									hide-details
								></v-text-field>
							</template>
						</v-data-table>
					</v-card-text>
					<v-card-actions>
						<v-row>
							<v-col cols="4" align="center">
								<v-btn color="primary" @click="acceptDialog = true; add=true">Add Users</v-btn>
							</v-col>
							<v-col cols="4" align="center">
								<v-btn color="primary" @click="createNewUserDialog = true">Create New User <br/> for this team</v-btn>		
							</v-col>
							<v-col cols="4" align="center">
								<v-btn text color="primary" @click="addUsersDialog = false">Exit</v-btn>
							</v-col>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog v-model="createNewUserDialog" persistent max-width="500">
				<v-card>
					<v-card-title class="justify-center">
						Create new User
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-text-field v-model="createFirstName" label="First Name" single-line></v-text-field>
						<v-text-field v-model="createLastName" label="Last Name" single-line></v-text-field>
						<v-text-field v-model="createEmail" label="Email" single-line></v-text-field>
						<v-select v-model="createRole" :items="roles" label="Role" optional></v-select>
									
						<!-- <v-text-field v-model="createRole" label="Role" single-line></v-text-field> -->
					</v-card-text>
					<v-card-actions class="justify-center">
						<v-btn color="primary" @click="createUser()">Create</v-btn>	
						<v-btn color="primary" text @click="createNewUserDialog = false">Cancel</v-btn>
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
		<SnackBar :options="snackOptions" :snackbar="snackbar" @update-prop="update"></SnackBar>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import moment from "moment";
import { Team } from "../../../common";
import { User, UserTeams, universities } from "@startupway/users/lib/ui";
import { SnackBarOptions, SnackBarTypes } from "@startupway/menu/lib/ui";
import { UI } from '@startupway/main/lib/ui';
export default Vue.extend({
	name: "TeamComposition",
	watch: {
		$route:{
			immediate:true,
			async handler(newRoute) {
				this.teamId =parseInt(this.$route.params.teamId);
				try {
					const r = await this.getUsers(this.teamId)
					if(r) {
						await this.getAllUsers();
					}
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
	},
	computed: {
		...mapGetters({
			user: "users/user",
		})
	},
	data() {
		return {
			ui: UI.getInstance(),
			emailRules: [
				(e: string) => {
					if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e))
						return true;
					else
						return "You have entered an invalid email address!";
				},
				(f: string) => {
					if(f.length > 0)
						return true;
					else
						return "Filed cannot be empty!";
				}
			],
			userValid:true,
			extendedImage: "",
			extendDialog: false,
			roles: [
				"CEO",
				"CTO",
				"CFO",
				"Team Lead",
				"Marketing Specialist",
				"Software Specialist",
				"Hardware Specialist",
				"Other"
			],
			teams: [] as Team[],
			team:"" as string,
			location: "" as string,
			users: [] as User[],
			allUsers: [] as User[],
			teamId: 0,
			item: {},
			dialog:false,
			universities:universities,
			search2: "",
			headers2: [
				{
					text: "Role",
					align: "left",
					sortable: false,
					value: "UserTeams_role"
				},
				{ text: "First Name", value: "firstName" },
				{ text: "Last Name", value: "lastName" },
				{ text: "Email", value: "email" },
				{ text: "Phone number", value: "phone" },
				{ text: "Faculty", value: "faculty"},
				{ text: "Group", value: "group"},
			],
			remove:false,
			add:false,
			addUsersDialog:false,
			acceptDialog:false,
			createNewUserDialog:false,
			createFirstName:"",
			createLastName:"",
			createEmail:"",
			createRole:"",
			toRemove: [],
			toAdd: [],
			loading:false,
			loadingPage:false,
			toDel:{},
			snackOptions: {
				text:"",
				type:"info",
				timeout:2000
			} as SnackBarOptions,
			snackbar:false,
		};
	},
	methods: {
		extendImage(image: string) {
			this.extendedImage = image;
			this.extendDialog = true;
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
				const response = await this.ui.api.get(
					"/api/v1/teams/team/users/" + teamId
					);
				if (response.status === 200) {
					this.users = await this.modifyUsers(response.data);
					return true;
				} else if(response.status === 204) {
					this.snackOptions.text = "There Was a Problem Loading the Users. If the error persists, please contact technical support: teams@tech-lounge.ro.";
					this.snackOptions.type = SnackBarTypes.INFO;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
					return false;
				}
			} catch (e) {
				console.error(e);
				this.snackOptions.text = "Server Error while Loading Users. If the error persists, please contact technical support: teams@tech-lounge.ro.";
				this.snackOptions.type = SnackBarTypes.ERROR;
				this.snackOptions.timeout = 2000;
				this.snackbar = true;
				return false;
			}
		},
		async getAllUsers() {
			try {
				const response = await this.ui.api.get("/api/v1/users");
				if (response.status === 200) {
					this.allUsers = await this.modifyUsers(response.data);
					this.allUsers = this.allUsers.filter((user:User) => { return !this.hasUser(user)});
					return true;
				} else if(response.status === 204) {
					this.snackOptions.text = "There Was a Problem Loading the Users. If the error persists, please contact technical support: teams@tech-lounge.ro.";
					this.snackOptions.type = SnackBarTypes.INFO;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
					return false;
				} else {
					return false;
				}
			} catch (e) {
				console.error(e);
				this.snackOptions.text = "Server Error while Loading Users. If the error persists, please contact technical support: teams@tech-lounge.ro.";
				this.snackOptions.type = SnackBarTypes.ERROR;
				this.snackOptions.timeout = 2000;
				this.snackbar = true;
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
				

				if ((users[index] as any).userDetails["participant"] !== undefined) {
					(users[index] as any).participant = (users[index] as any).userDetails["participant"];
				} else {
					(users[index] as any).pitcher = "";
				}

				if ((users[index] as any).userDetails["pitcher"] !== undefined) {
					(users[index] as any).pitcher = (users[index] as any).userDetails["pitcher"];
				} else {
					(users[index] as any).pitcher = "";
				}
				
				if ((users[index] as any).userDetails["transport"] !== undefined) {
					(users[index] as any).transport = (users[index] as any).userDetails["transport"];
				} else {
					(users[index] as any).transport = "";
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
		openLink(link: string) {
			let webLink:string = link;
			if(webLink.includes("http://")) {
				window.open(webLink, "_blank");
				return;
			}
			if(!webLink.includes("https://")) {
				webLink = "https://" + webLink;
			}
			window.open(webLink, "_blank");
		},
		async updateUserInfo() {
			this.loadingPage = true;
			let user: any = {};
			this.item = (this.item as any)
			const userDetails = {
				details:(this.item as any).userDetails["details"],
				faculty:(this.item as any).faculty,
				group:(this.item as any).group,
				location:(this.item as any).userDetails["location"],
				pitcher:(this.item as any).pitcher,
				participant:(this.item as any).participant,
				transport:(this.item as any).transport
			}
			user = {
				userId: (this.item as any).UserTeams_userId,
				firstName: (this.item as any).firstName,
				lastName: (this.item as any).lastName,
				username: (this.item as any).username,
				email: (this.item as any).email,
				phone: (this.item as any).phone,
				socialMedia: (this.item as any).socialMedia,
				birthDate: (this.item as any).birthDate,
				userDetails: userDetails,
				role: {
					[((this.item as any).UserTeams_role as any)]:true,
				}
			};
			const userTeam:UserTeams = {
				userProductId:(this.item as any).UserTeams_userProductId,
				userId:(this.item as any).UserTeams_userId,
				role:(this.item as any).UserTeams_role,
				teamId:(this.item as any).UserTeams_teamId
			}
			try {
				const response = await this.ui.api.post("/api/v1/admin/changeRole", 
				{
					user:user,
					userTeam:userTeam
				});
				if(response.status === 200) {
					(this.item as any) = {
						userId: 0,
					firstName: "",
					lastName: "",
					password: "",
					username: "",
					email: "",
					phone: "",
					socialMedia: {},
					birthDate: new Date(),
					userDetails: {
						details: ""
					},
					role: {}
					};
					this.snackOptions.text = "Update Successful";
					this.snackOptions.type = SnackBarTypes.SUCCESS;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				} else if(response.status === 204) {
					this.snackOptions.text = "Update Failed, Please Try Again Later. If the error persists, please contact technical support: teams@tech-lounge.ro.";
					this.snackOptions.type = SnackBarTypes.INFO;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				}
				
			} catch (e) {
				this.snackOptions.text = "Server Error, Update Failed. If the error persists, please contact technical support: teams@tech-lounge.ro.";
				this.snackOptions.type = SnackBarTypes.ERROR;
				this.snackOptions.timeout = 2000;
				this.snackbar = true;
				console.error(e);
			}
			this.dialog = false;
			this.$forceUpdate();
			this.loadingPage = false;
		},
		openDialog(user: any) {
			this.item = user;
			this.dialog = true;
		},
		exitDialog() {
			(this.item as any) = {
				userId: 0,
				firstName: "",
				lastName: "",
				password: "",
				username: "",
				email: "",
				phone: "",
				socialMedia: {},
				birthDate: new Date(),
				userDetails: {
					details: ""
				},
				role: {}
			}
			this.dialog = false;
			
		},
		accept(type:string){
			this.loadingPage = true;
			this.acceptDialog = false;
			if(type == "remove"){
				this.removeUsers();
				this.remove = false;
			}
			else if(type == "add"){
				this.addUsers();
				this.add = false;
				this.addUsersDialog = false;
			}
			this.acceptDialog = false;
			this.loadingPage = false;
		},
		deny(){
			this.acceptDialog=false;
			this.remove = false;
			this.add = false;
			this.addUsersDialog = false;
		},
		
		async createUser() {
			this.loadingPage = true;
			try {
				const role = {};
				(role as any)[this.createRole]=true;
				const user = {
					firstName: this.createFirstName,
					lastName:this.createLastName,
					email:this.createEmail,
					username:this.createEmail.split("@")[0],
					phone:"0",
					socialMedia:{
						facebook:"",
						linkedin:"",
						website:"",
					},
					birthDate: new Date(),
					userDetails: {
						
					},
					role:role
				}
				const response = await this.ui.api.post("/api/v1/admin/add/user", {
					user: user,
					option:"team",
					teamId: this.teamId
				});
				if(response) {
					this.loading = true;
					const newResponse = await this.getUsers(this.teamId);
					if(newResponse) {
						this.loading = false;
					}
					this.createNewUserDialog = false;
				}
		
				this.$forceUpdate();
			} catch (e) {
				console.error(e);
			}
			this.loadingPage = false;
		},
		async addUsers() {
			this.loadingPage = true;
			try {
				const response = await this.ui.api.post("/api/v1/teams/teamadd/users", {
					users: this.toAdd,
					teamId: this.teamId,
				});
				
				if(response.status === 200) {
					this.loading = true;
					const newResponse = await this.refreshLists();
					if(newResponse) {
						this.loading = false;
						this.snackOptions.text = "Add Users Successful";
						this.snackOptions.type = SnackBarTypes.SUCCESS;
						this.snackOptions.timeout = 2000;
						this.snackbar = true;
					} else {
						this.snackOptions.text = "Add Users Failed, Please Try Again Later. If the error persists, please contact technical support: teams@tech-lounge.ro.";
						this.snackOptions.type = SnackBarTypes.INFO;
						this.snackOptions.timeout = 2000;
						this.snackbar = true;
						this.loading = false;
					}
				} else if(response.status === 204) {
					this.snackOptions.text = "Add Users Failed, Please Try Again Later. If the error persists, please contact technical support: teams@tech-lounge.ro.";
					this.snackOptions.type = SnackBarTypes.INFO;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				}
				this.$forceUpdate();
			} catch (e) {
				console.error(e);
				this.snackOptions.text = "Server Error, Add Users Failed. If the error persists, please contact technical support: teams@tech-lounge.ro.";
				this.snackOptions.type = SnackBarTypes.ERROR;
				this.snackOptions.timeout = 2000;
				this.snackbar = true;
				this.loading = false;
			}
			const foundTeam = await this.ui.api.get("/api/v1/teams/team" + this.teamId);
			let initDate;
			const allActivities = [];
			if(foundTeam.data.location === "Bucharest"){
				initDate = moment("2020-03-02");
			} else {
				initDate = moment("2020-03-09");
			}
			for(const user of (this.toAdd as any[])) {
						
				for(let i = 0; i < 10; i++) {
					const aux = moment(initDate.toDate());
					const date = aux.add(7*i,"days").toDate();
					const userActivity = {
						userId: user.userId,
						teamId: this.teamId,
						noOfHours:0,
						date:date,
						description:""
					}
					allActivities.push(userActivity);
					
				}
				try {
					this.loadingPage = false;
					await this.ui.api.post("/api/v1/admin/newUserActivity", {
							userActivity: allActivities
					});
					this.loadingPage = false;
				} catch (e) {
					console.error(e.message)
				}
			}

			this.loadingPage = false;
		},
		async removeUsers() {
			this.loadingPage = true;
			(this.toRemove as any).push((this.toDel as any));
			try {
				const response = await this.ui.api.post("/api/v1/teams/teamremove/users", {
					users: this.toRemove,
					teamId: this.teamId
				});
				if(response.status === 200) {
					this.loading = true;
					this.snackOptions.text = "Remove User Successful";
					this.snackOptions.type = SnackBarTypes.SUCCESS;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
					const newResponse = await this.refreshLists();
					if(newResponse) {
						this.loading = false;
						
					}
				} else if(response.status === 204) {
					this.snackOptions.text = "Remove User Failed, Please Try Again Later. If the error persists, please contact technical support: teams@tech-lounge.ro.";
					this.snackOptions.type = SnackBarTypes.INFO;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				}
				this.$forceUpdate();
			} catch (e) {
				console.error(e);
				this.snackOptions.text = "Server Error, Remove User Failed. If the error persists, please contact technical support: teams@tech-lounge.ro.";
				this.snackOptions.type = SnackBarTypes.ERROR;
				this.snackOptions.timeout = 2000;
				this.snackbar = true;
				this.loading = false;
			}
			this.toRemove = [];
			this.loadingPage = false;
		},
		async getUserImage(avatar:string,userId:number):Promise<String> {
			if(avatar !== "" && avatar !== null) {
				if(userId !== 0) {
					try {
						const response = await this.ui.api.post("/api/v1/uploadDownload/get/file/user/avatar", {userId:userId});
						if(response.status === 200) {
							return response.data;
						} else if(response.status === 500) {
							this.snackOptions.text = "Server Error while Loading User Avatar. If the error persists, please contact technical support: teams@tech-lounge.ro.";
							this.snackOptions.type = SnackBarTypes.ERROR;
							this.snackOptions.timeout = 2000;
							this.snackbar = true;
							return "";
						} else {
							return "";
						}
					} catch (e) {
						if(e.status === 500) {
							console.error(e);
							this.snackOptions.text = "Server Error while Loading User Avatar. If the error persists, please contact technical support: teams@tech-lounge.ro.";
							this.snackOptions.type = SnackBarTypes.ERROR;
							this.snackOptions.timeout = 2000;
							this.snackbar = true;
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
		update(prop:boolean) {
			this.snackbar = prop;
		},
		async refreshLists() {
				this.teamId = parseInt(this.$route.params.teamId);
				try {
					if(await this.getUsers(this.teamId))
						if(await this.getAllUsers())
							return true;
						else
							return false;
					else
						return false;
				} catch (e) {
					console.error(e);
					return false;
				}
		}
		
	}
});
</script>