<template>
	<v-container>
		<v-card flat style="margin-left: auto; margin-right: auto; padding-top: 20px; background-color: #fcfcfc;">
			<v-card-title class="justify-center" style=" font-weight: bold;">
				Manage Users
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>
				<v-row>
					<v-col cols="11" align="center">
						<v-text-field
							style="flex: 0 1 auto;"
							v-model="search"
							append-icon="mdi-magnify"
							label="Search"
							single-line
							hide-details								
						></v-text-field>
					</v-col>
					<v-col cols="1">
						<v-tooltip v-model="show" top>
							<template v-slot:activator="{ on }">
							<v-btn icon v-on="on" @click="openDialog(item)">
								<v-icon large color="primary">mdi-plus</v-icon>
							</v-btn>
							</template>
							<span>Add new user</span>
						</v-tooltip> 
					</v-col>
				</v-row>
				
				<v-data-table item-key="email" :headers="headers" :items="allUsers" :search="search" :loading="allUsers.length <= 0" loading-text="Loading users">
					<template v-slot:top>
						<div>
							
							<v-dialog persistent v-model="dialog" max-width="500px">
								<!-- <template v-slot:activator="{ on }">
									<v-btn color="primary" dark v-on="on">Add User</v-btn>
								</template> -->
								<v-card>
									<v-card-title v-if="item.userId === 0" class="justify-center" style="">Add New User</v-card-title>
									<v-card-title v-else class="justify-center" style="">Edit User</v-card-title>
									<v-divider></v-divider>
									<v-card-text>
										<v-text-field v-model="item.firstName" color="primary" label="First Name" prepend-icon="mdi-account"></v-text-field>
										<v-text-field v-model="item.lastName" color="primary" label="Last Name" prepend-icon="mdi-account"></v-text-field>
										<v-text-field v-model="item.email" color="primary" label="Email" prepend-icon="mdi-email"></v-text-field>
										<v-text-field v-model="item.phone" color="primary" label="Phone" prepend-icon="mdi-phone"></v-text-field>
										<v-text-field v-model="item.username" color="primary" label="Username" prepend-icon="mdi-account-badge"></v-text-field>
										
										<v-menu
											v-if="item.userId !== 0"
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
													v-model="item.birthDate"
													label="Birthdate"
													persistent-hint
													prepend-icon="mdi-calendar"
													v-on="on"
												></v-text-field>
											</template>
											<v-date-picker
												v-model="item.birthDate"
												no-title
												scrollable
											>
												<v-spacer></v-spacer>
												<v-btn text color="primary" @click="dateMenu = false">Cancel</v-btn>
												<v-btn text color="primary" @click="$refs.dateMenu.save(date)"
													>OK</v-btn
												>
											</v-date-picker>
										</v-menu>
										<v-text-field
											v-if="item.userId !== 0"
											v-model="item.socialMedia.facebook"
											label="Facebook Link"
											optional
											color="primary"
											prepend-icon="mdi-facebook"
										></v-text-field>
										<v-text-field
											v-if="item.userId !== 0"
											v-model="item.socialMedia.linkedin"
											label="Linkedin Link"
											optional
											color="primary"
											prepend-icon="mdi-linkedin"
										></v-text-field>
										<v-text-field
											v-if="item.userId !== 0"
											v-model="item.socialMedia.webpage"
											label="Webpage Link"
											optional
											color="primary"
											prepend-icon="mdi-web"
										></v-text-field>
										<v-textarea 
											v-model="item.details" 
											label="User Details" 
											optional
											color="primary"
											prepend-icon="mdi-information-outline"
											rows="2"
										></v-textarea>
										<v-select 
											v-if="item.userId !== 0" 
											v-model="item.role" 
											:items="roles" 
											label="Role" 
											optional
											color="primary"
											prepend-icon="mdi-account-card-details-outline"
										></v-select>
								
										<!-- <v-text-field v-model="item.role" label="Role" optional></v-text-field> -->
									</v-card-text>
									<v-card-actions class="justify-center">
										<v-btn rounded v-if="item.userId !== 0" color="primary" @click="editUser()">Edit User</v-btn>
										<v-btn v-else color="primary" rounded @click="addUser()">Add User</v-btn>
										<v-btn color="primary" text @click="exitDialog()">Exit</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</div>
					</template>
					<template v-slot:action="{ item }">
						<v-icon small @click="openDialog(item)">
							mdi-pencil
						</v-icon>
					</template>
				</v-data-table>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import Vue from "vue";
import { User, UserTeams } from "@startupway/users/lib/ui";
import { UI } from "@startupway/main/lib/ui";
export default Vue.extend({
	name: "UsersEdit",
	async mounted() {
		try {
			await this.getAllUsers();
		} catch (e) {
			console.error(e);
		}
	},
	data() {
		return {
			ui: UI.getInstance(),
			allUsers: [] as User[],
			search: "",
			dialog: false,
			show: false,
			dateMenu: false,
			showPass: false,
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
			headers: [
				{
					text: "Role",
					align: "left",
					sortable: false,
					value: "role"
				},
				{ text: "First Name", value: "firstName" },
				{ text: "Last Name", value: "lastName" },
				{ text: "Email", value: "email" },
				{ text: "Actions", value: "action", sortable: false },
				{ text: "Last Login", value: "lastLogin", sortable: false },
			],
			item: {
				userId: "",
				userProductId:"",
				teamId:"",
				firstName: "",
				lastName: "",
				password: "",
				newPassword:"",
				username: "",
				email: "",
				phone: "",
				socialMedia: {},
				birthDate: new Date(),
				userDetails: {},
				role: "",
				avatarUu: "",
				lastLogin: new Date()
			} as (User&UserTeams) ,
			firstName: "" as string,
			lastName: "" as string,
			email: "" as string,
			phone: "" as string,
			username: "" as string,
			date: new Date(),
			birthDate: {} as Date,
			facebookLink: "" as string,
			linkedinLink: "" as string,
			webpageLink: "" as string,
			details: "" as string
		};
	},
	watch: {
		user: {
			immediate: true,
			async handler(newUser: User):Promise<void> {
			}
		}
	},
	computed: {
		...mapGetters({
			user: "users/user"
		})
	},
	methods: {
		formatDate(date: Date):string {
			const time  = (new Date(date)).toTimeString().split(" ");
			return (new Date(date)).toDateString() + " " + time[0];
		},
		async modifyUsers(users: (User)[] | (User&UserTeams)[]):Promise<(User)[] | (User&UserTeams)[]> {
			for(const user of users) {
				if (user.userDetails["faculty"] !== undefined) {
					(user as (User&UserTeams | User) & {faculty:string,group:string}).faculty = user.userDetails["faculty"]; 
				} else {
					(user as (User&UserTeams | User) & {faculty:string,group:string}).faculty = "";
				}
				if (user.userDetails["group"] !== undefined) {
					(user as (User&UserTeams | User) & {faculty:string,group:string}).group = user.userDetails["group"];
				} else {
					(user as (User&UserTeams | User) & {faculty:string,group:string}).group = "";
				}
				// const session = await this.ui.application.api.get("/api/v1/lastLogin/" + user.userId);
				// if (session) {
				// 	user.createdAt = this.formatDate(session.data.lastLogin);
				// }
				// if (user.avatarUu !== "" && user.avatarUu !== undefined && user.avatarUu !== null){
				// 	user.image = await this.getUserImage(user.avatarUu, user.UserTeams_userId);
				// } else {
				// 	user.image = ""
				// }

			}
			return users;
		},
		async getAllUsers():Promise<boolean> {
			try {
				const response = await this.ui.api.get<User[]>("/api/v1/users/users");
				if (response.status === 200) {
					this.allUsers = await this.modifyUsers(response.data);
					// this.allUsers = this.allUsers.filter((user:User) => { return !this.hasUser(user)});
					return true;
				} 
			} catch (e) {
				console.error(e);
				return false;
			}
			return false;
		},
		async addUser():Promise<void> {
			const user = {
				firstName: this.item.firstName,
				lastName: this.item.lastName,
				username: this.item.username,
				email: this.item.email,
				phone: this.item.phone,
				socialMedia:this.item.socialMedia,
				birthDate: this.item.birthDate,
				userDetails: this.item.userDetails,
				role: ""
			};
			try {
				await this.ui.api.post("/api/v1/admin/add/user", { user: user });
				this.dialog = false;
				this.$forceUpdate();
			} catch (e) {
				console.error(e);
			}
		},
		openDialog(user: (User&UserTeams)):void {
			this.item = user;
			(this.item as User&UserTeams&{newPassword:string}).newPassword = "";
			this.dialog = true;
		},
		async editUser():Promise<void> {
			let newUser: User = {} as User;
			let bolean = false;
			if ((this.item as User&UserTeams&{newPassword:string}).newPassword != "") {
				newUser = {
					userId: this.item.userId,
					firstName: this.item.firstName,
					lastName: this.item.lastName,
					password: (this.item as User&UserTeams&{newPassword:string}).newPassword,
					username: this.item.username,
					email: this.item.email,
					phone: this.item.phone,
					socialMedia: this.item.socialMedia,
					birthDate: this.item.birthDate,
					userDetails: this.item.userDetails,
					role: this.item.role,
					avatarUu:this.item.avatarUu,
					lastLogin: this.item.lastLogin
				};
				// bolean = true;
			} else {
				newUser = {
					userId: this.item.userId,
					firstName: this.item.firstName,
					lastName: this.item.lastName,
					password: this.item.password,
					username: this.item.username,
					email: this.item.email,
					phone: this.item.phone,
					socialMedia: this.item.socialMedia,
					birthDate: this.item.birthDate,
					userDetails: this.item.userDetails,
					role: this.item.role,
					avatarUu: this.item.avatarUu,
					lastLogin: this.item.lastLogin
				};
				bolean = false;
			}
			try {
				const response = await this.ui.api.post("/api/v1/user/update", {
					newUser:newUser,
					changedPass:bolean	
				});
				if (response) {
					this.item= {
						userId: "",
						userProductId:"",
						teamId:"",
						firstName: "",
						lastName: "",
						password: "",
						username: "",
						email: "",
						phone: "",
						socialMedia: {},
						birthDate: new Date(),
						userDetails: {},
						role: "",
						avatarUu: "",
						lastLogin: new Date()
					};
				}
				this.dialog = false;
				this.$forceUpdate();
			} catch (e) {
				console.error(e);
			}
			
		},
		exitDialog():void {
			this.item= {
				userId:"",
				userProductId:"",
				teamId:"",
				firstName: "",
				lastName: "",
				password: "",
				username: "",
				email: "",
				phone: "",
				socialMedia: {},
				birthDate: new Date(),
				userDetails: {},
				role: "",
				avatarUu: "",
				lastLogin: new Date()
			};
			this.dialog = false;
			
		}
	}
});
</script>

<style lang="less">
// @import "../style/vendor.less";
</style>