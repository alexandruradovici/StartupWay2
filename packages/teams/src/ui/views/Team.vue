<template>
	<v-app>
		<v-container fluid pl-7 pr-7 v-if="!loadingPage">
			<v-card color="#fcfcfc" flat style="margin: auto; margin-top: 50px;">
				
				<v-divider></v-divider>
				<v-card-text>
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
										<v-list-item-subtitle style="font-family: Georgia, serif; font-size: 15px; font-weight: 550;">{{ user.role }}</v-list-item-subtitle>
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
								<v-btn v-if="userRole" icon @click="openDialog(user)">
									<v-icon small>mdi-pencil</v-icon>
								</v-btn>
								<v-spacer></v-spacer>
								<div v-if="user.socialMedia !== undefined">
									<v-icon small v-if="user.socialMedia['facebook'] !== '' && user.socialMedia.facebook !== undefined" @click="openLink(user.socialMedia.facebook)">
										mdi-facebook
									</v-icon>
									<v-icon small v-if="user.socialMedia['linkedin'] !== '' && user.socialMedia.linkedin !== undefined" @click="openLink(user.socialMedia.linkedin)">
										mdi-linkedin
									</v-icon>
									<v-icon small v-if="user.socialMedia['webpage'] !== '' && user.socialMedia.webpage !== undefined" @click="openLink(user.socialMedia.webpage)">
										mdi-web
									</v-icon>
								</div>
								<v-spacer></v-spacer>
								<v-btn v-if="userRole" icon @click="acceptDialog = true; remove=true, toDel = user">
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
							<!-- <v-card v-if="user.userId !== undefined"> -->
							<v-card flat>
								<v-form v-model="userValid" lazy-validation>
								<v-card-title class="justify-center" style="font-family: Georgia, serif;">Edit User Details</v-card-title>
								<v-card-text style="margin-top: 50px;">
									<div class="details">Faculty</div>
									<v-select 
									v-model="item.faculty" 
									:items="universities" 
									label="Faculty" optional>
									</v-select>

									<div class="details">Group</div>
									<v-text-field 
									v-model="item.group" 
									outlined rounded color="primary"
									optional>
									</v-text-field>

									<div class="details">Email</div>
									<v-text-field 
									v-model="item.email" 
									:rules="emailRules"
									outlined rounded color="primary" 
									optional>
									</v-text-field>
									
									<div class="details">Role</div>
									<v-select 
									v-model="item.role"
									:items="roles" 
									label="Role" optional>
									</v-select>
									
									<div class="details">
										Is Pitcher?<v-checkbox v-model="item.pitcher"></v-checkbox>
									</div>
									<div class="details">
										Comes to DemoDay?<v-checkbox v-model="item.participant"></v-checkbox>
									</div>
									<div v-if="item.participant || item.pitcher">
										<div class="details" >
											Means of transport to DemoDay
										</div>
										<v-select v-model="item.transport" :items="['Train','Car','Plane','Other']" label="Transport" optional></v-select>
									</div>
								</v-card-text>
								<v-card-actions class="justify-center">
									<v-btn v-if="(!item.pitcher && !item.participant)  ||  ((item.pitcher || item.participant) && item.transport !=='')" :disabled="!userValid" rounded color="primary" @click="updateUserInfo()">Apply changes</v-btn>
									<v-btn outlined rounded color="primary" @click="exitDialog()">Exit</v-btn>
								</v-card-actions>
								</v-form>
							</v-card>
						</v-dialog>
					</v-list>
				</v-card-text>
				<v-card-actions class="justify-center" v-if="userRole">
					<v-btn color="primary" @click="addUsersDialog = true; add=true">Add Users</v-btn>	
				</v-card-actions>
			</v-card>
			<v-dialog v-model="addUsersDialog" persistent max-width="1000">
				<v-card>
					<v-card-title primary-title class="justify-center">Add Users</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-data-table
							v-model="toAdd"
							item-key="email"
							:headers="headers2"
							:items="allUsers"
							:search="search2"
							:loading="allUsers.length <= 0" 
							loading-text="Loading users"
							:single-select="singleSelect2"
							show-select
						>
							<template v-slot:top>
								<v-text-field
									v-model="search2"
									append-icon="mdi-magnify"
									label="Search"
									single-line
									hide-details
								></v-text-field>
							</template>
						</v-data-table>
					</v-card-text>
					<v-card-actions class="justify-center">
						<v-row>
							<v-col cols="4" align="center">
								<v-btn color="primary" @click="acceptDialog = true; add=true">Add Users</v-btn>
							</v-col>
							<v-col cols="4" align="center">
								<v-btn color="primary" @click="openRequestDialog()">Request new user <br/> for the Team</v-btn>
							</v-col>
							<v-col cols="4" align="center">
								<v-btn text color="primary" @click="addUsersDialog = false">Exit</v-btn>
							</v-col>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog v-model="acceptDialog" persistent max-width="290">
				<v-card v-if="remove">
					<v-card-title class="justify-center" style="font-family: Georgia, serif;">Remove Users</v-card-title>
					<v-card-text>Are you sure you want to remove this user?</v-card-text>
					<v-card-actions class="justify-center">
						<v-btn color="#32a852" text @click="accept('remove')">Yes</v-btn>
						<v-btn color="#a83232" text @click="deny()">No</v-btn>
					</v-card-actions>
				</v-card>
				<v-card v-else-if="add">
					<v-card-title class="justify-center">Add Users</v-card-title>
					<v-divider></v-divider>
					<v-card-text class="justify-center">Are you sure you want to add these users?</v-card-text>
					<v-card-actions class="justify-center">
						<v-btn color="green" text @click="accept('add')">Yes</v-btn>
						<v-btn color="red" text @click="deny()">No</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog v-model="requestDialog" max-width="500">
				<v-card>
					<v-card-title class="justify-center">Request User</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-text-field v-model="requestFirstName" label="First Name" single-line></v-text-field>
						<v-text-field v-model="requestLastName" label="Last Name" single-line></v-text-field>
						<v-text-field v-model="requestEmail" label="Email" single-line></v-text-field>
					</v-card-text>
					<v-card-actions class="justify-center">
						<v-btn color="primary" @click="requestDialog = false; requestUser()">Request new User</v-btn>
						<v-btn color="primary" text @click="cancel()">Cancel</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-container>
		<v-container v-else>
			<v-row justify="center">
				<v-col md="auto">
					<v-progress-circular :size="500" color="primary" indeterminate></v-progress-circular>
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
import { UI } from '@startupway/main/lib/ui';
import { Team, VisualUser} from "../../common";
import { User, UserTeams, universities } from "@startupway/users/lib/ui";
import { SnackBarOptions, SnackBarTypes } from "@startupway/menu/lib/ui";
export default Vue.extend({
	name: "Team",
	watch: {
		user: {
			immediate: true,
			async handler(newUser: User):Promise<void> {
				if(newUser.role === "CEO")
					this.userRole = newUser.role;
				if(this.userRole) {
					await this.getAllUsers();
				}
			}
		},
		currentTeam: {
			immediate: true,
			async handler(newTeam: Team):Promise<void> {
				this.teamId = newTeam.teamId;
				if (this.teamId === "") {
					if(this.$route.path !== "/workspace")
						this.$router.push("/workspace");
				} else {
					await this.getUsers(newTeam.teamId);
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
	data() {
		return {
			ui: UI.getInstance(),
			emailRules: [
				(e: string) => {
					if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e))
						return true;
					else
						return "You have entered an invalid email address!";
				},,
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
			toDel:{} as (User & UserTeams),
			faculty: "" as string,
			group: "" as string,
			email: "" as string,
			role: "" as string,
			universities:universities,
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
			teamId: "",
			userRole: "",
			selected: [],
			singleSelect: false,
			users: [] as (User & UserTeams)[] | User[],
			search1: "",
			item: {} as (User & UserTeams & VisualUser),
			loadingPage: false,
			dialog: false,
			remove:false,
			add:false,
			allUsers: [] as (User & UserTeams)[] | User[],
			addUsersDialog:false,
			acceptDialog:false,
			singleSelect2:false,
			singleSelect1:false,
			loading:false,
			toAdd:[] as (User & UserTeams)[] | User[],
			toRemove:[] as (User & UserTeams)[] | User[],
			headers1: [
				{
					text: "Role",
					align: "left",
					sortable: false,
					value: "role"
				},
				{ text: "First Name", value: "firstName" },
				{ text: "Last Name", value: "lastName" },
				{ text: "Email", value: "email" },
				{ text: "Phone number", value: "phone" },
				{ text: "Actions", value: "actions", sortable: false }
			],
			search2: "",
			headers2: [
				{
					text: "Role",
					align: "left",
					sortable: false,
					value: "role"
				},
				{ text: "First Name", value: "firstName" },
				{ text: "Last Name", value: "lastName" },
				{ text: "Email", value: "email" },
				{ text: "Phone number", value: "phone" },
				{ text: "Faculty", value: "faculty"},
				{ text: "Group", value: "group"},
			],
			requestFirstName:"",
			requestLastName:"",
			requestEmail:"",
			requestDialog:false,
			snackOptions: {
				text:"",
				type:"info",
				timeout:2000
			} as SnackBarOptions,
			snackbar:false,
		};
	},
	methods: {
		extendImage(image: string):void {
			this.extendedImage = image;
			this.extendDialog = true;
		},
		async modifyUsers(users: ((User & UserTeams)[] | User[])):Promise<(User & UserTeams)[] | User[]> {
			for(const user of users) {
				if (user.userDetails["faculty"] !== undefined) {
					(user as ((User & UserTeams) & VisualUser)).faculty = user.userDetails["faculty"]; 
				} else {
					(user as ((User & UserTeams) & VisualUser)).faculty = "";
				}

				if (user.userDetails["group"] !== undefined) {
					(user as ((User & UserTeams) & VisualUser)).group = user.userDetails["group"];
				} else {
					(user as ((User & UserTeams) & VisualUser)).group = "";
				}

				if (user.userDetails["participant"] !== undefined) {
					(user as ((User & UserTeams) & VisualUser)).participant = user.userDetails["participant"];
				} else {
					(user as ((User & UserTeams) & VisualUser)).pitcher = "";
				}

				if (user.userDetails["pitcher"] !== undefined) {
					(user as ((User & UserTeams) & VisualUser)).pitcher = user.userDetails["pitcher"];
				} else {
					(user as ((User & UserTeams) & VisualUser)).pitcher = "";
				}
				
				if (user.userDetails["transport"] !== undefined) {
					(user as ((User & UserTeams) & VisualUser)).transport = user.userDetails["transport"];
				} else {
					(user as ((User & UserTeams) & VisualUser)).transport = "";
				}

				if(user.avatarUu !== "" && user.avatarUu !== undefined && user.avatarUu !== null){
					(user as ((User & UserTeams) & VisualUser)).image = await this.getUserImage(user.avatarUu, user.userId);
				} else {
					(user as ((User & UserTeams) & VisualUser)).image = ""
				}
			}
			return users;
		},
		async getUserImage(avatar:string,userId:string):Promise<string> {
			if(avatar !== "" && avatar !== null) {
				if(userId !== "") {
					try {
						const response = await this.ui.api.post<string | null>("/api/v1/uploadDownload/get/file/user/avatar", {userId:userId});
						if(response.data) {
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
		hasUser(user:User | (User & UserTeams)):boolean {
			for(const aux of this.users) {
				if(aux.userId === user.userId) {
					return true;
				}
			}
			return false;
		},
		async getAllUsers():Promise<boolean> {
			try {
				const response = await this.ui.api.get<User[]>("/api/v1/users/users");
				if (response.data) {
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
		async removeUsers():Promise<void> {
			this.loadingPage = true;
			this.toRemove.push(this.toDel);
			try {
				const response = await this.ui.api.post<boolean>("/api/v1/teams/team/remove/users", {
					users: this.toRemove,
					teamId: this.teamId
				});
				if(response.data) {
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
		async getUsers(teamId: string):Promise<boolean> {
			try {
				const response = await this.ui.api.get<(User & UserTeams)[]>(
					"/api/v1/teams/team/users/" + teamId
					);
				if (response.data) {
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
			return false;
		},
		async updateUserInfo() {
			this.loadingPage = true;
			let user: any = {};
			
			const userDetails = {
				details: this.item.userDetails["details"],
				faculty: this.item.faculty,
				group: this.item.group,
				locations:this.item.userDetails["location"],
				pitcher:this.item.pitcher,
				participant:this.item.participant,
				transport:this.item.transport

			};
			user = {
				userId: this.item.userId,
				firstName: this.item.firstName,
				lastName: this.item.lastName,
				username: this.item.username,
				email: this.item.email,
				phone: this.item.phone,
				socialMedia: this.item.socialMedia,
				birthDate: this.item.birthDate,
				userDetails: userDetails,
				role: this.item.role,
				avatarUu: this.item.avatarUu,
				lastLogin: this.item.lastLogin
			};
			const userTeam: UserTeams = {
				userProductId: this.item.userProductId,
				userId: this.item.userId,
				role: this.item.role,
				teamId: this.item.teamId
			};
			try {
				const response = await this.ui.api.post<UserTeams | null>(
					"/api/v1/admin/changeRole",
					{
						user: user,
						userTeam: userTeam
					}
				);
				if (response.data) {
					this.item = {
						userId: "",
						userProductId: "",
						teamId: "",
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
						role: "",
						avatarUu: "",
						lastLogin: new Date(),
						faculty:"",
						group:"",
						participant:"",
						pitcher:"",
						transport:"",
						image:""
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
				console.error(e);
			}
			if(user.userId === this.user.userId)
				if(user.role === "CEO")
					this.userRole = user.role;
				else
					this.userRole = "";
			this.dialog = false;
			this.$forceUpdate();
			this.loadingPage = false;
		},
		openDialog(user: any):void {
			this.item = user;
			this.dialog = true;
		},
		openRequestDialog():void {
			this.requestDialog = true;
		},
		exitDialog():void {
			this.item = {
				userId: "",
				userProductId: "",
				teamId: "",
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
				role: "",
				avatarUu: "",
				lastLogin: new Date(),
				faculty:"",
				group:"",
				participant:"",
				pitcher:"",
				transport:"",
				image:""
			};
			this.dialog = false;
		},
		openLink(link: string):void {
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
		async requestUser():Promise<void> {
			try {
				const response = await this.ui.api.post<boolean>("/api/v1/admin/request/user", {
					from:this.user.username,
					firstName: this.requestFirstName,
					lastName: this.requestLastName,
					email:this.requestEmail,
					teamId:this.teamId
				});
				if(response.data) {
					this.requestDialog = false;
				}
				this.$forceUpdate();
				
			} catch (e) {
				console.error(e);
			}
			

		},
		async addUsers():Promise<void> {
			this.loadingPage = true;
			try {
				const response = await this.ui.api.post<boolean>("/api/v1/teams/team/add/users", {
					users: this.toAdd,
					teamId: this.teamId,
				});
				
				if(response.data) {
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
				this.snackOptions.text = "Server Error, Add Users Failed";
				this.snackOptions.type = SnackBarTypes.ERROR;
				this.snackOptions.timeout = 2000;
				this.snackbar = true;
				this.loading = false;
			}
			const foundTeam = await this.ui.api.get<Team | null>("/api/v1/teams/team/" + this.teamId);
			let initDate;
			const allActivities = [];
			if(foundTeam.data && foundTeam.data.location === "Bucharest"){
				initDate = moment("2020-03-02");
			} else {
				initDate = moment("2020-03-09");
			}
			for(const user of this.toAdd) {
						
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
					await this.ui.api.post<boolean>("/api/v1/admin/newUserActivity", {
							userActivity: allActivities
					});
					this.loadingPage = false;
				} catch (e) {
					console.error(e.message)
				}
			}

			this.loadingPage = false;
		},
		accept(type:string):void{
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
		},
		deny():void{
			this.acceptDialog=false;
			this.remove = false;
			this.add = false;
			this.addUsersDialog = false;
		},
		cancel():void{
			this.requestDialog=false;
		},
		update(prop:boolean):void {
			this.snackbar = prop;
		},
		async refreshLists():Promise<boolean> {
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
<style lang="less">
</style>