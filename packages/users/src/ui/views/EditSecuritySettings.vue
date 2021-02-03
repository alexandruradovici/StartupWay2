<template>
	<v-app>
		<v-container v-if="!loadingPage">
			<v-form v-model="valid" lazy-validation>
				<v-card flat style="margin: auto; padding-top: 20px;" max-width="900" color="#fcfcfc">
					<v-card-title class="justify-center">
							
						<v-list-item-avatar size="60">
							
							<v-hover v-slot:default="{ hover }" >
								<v-img :elevation="hover ? 16 : 0" v-if="imgData !== ''" :src="imgData" @click="extendImage(imgData)"></v-img>
								<v-icon v-else>mdi-account-circle mdi-48px</v-icon>
							</v-hover>
						</v-list-item-avatar>
						{{user.firstName}} {{user.lastName}}
					</v-card-title>
							
					<v-list-item-subtitle>
						Security Settings	
					</v-list-item-subtitle>

					<v-divider></v-divider>
					<v-card-text>
						<v-row justify="space-around">
							<v-col cols="4" align="center">
								<v-text-field
									v-model="username"
									label="Username"
									:placeholder="user.username"
									:rules="characterRules"
									color="primary"
									prepend-icon="mdi-account-convert"
								></v-text-field>
							</v-col>
							
							<v-col cols="4" aling="center">
								<v-text-field
									v-model="email"
									label="Email"
									:placeholder="user.email"
									:rules="emailRules"
									color="primary"
									prepend-icon="mdi-email"
								></v-text-field>
							</v-col>

							<v-col cols="4" align="center">
								<v-text-field
									v-model="passwordNew"
									:prepend-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
									@click:prepend="showNew = !showNew"
									:rules="passwordRules"
									:type="showNew ? 'text' : 'password'"
									label="New Password"
									color="primary"
								></v-text-field>
							</v-col>

						</v-row>
					</v-card-text>
					<v-card-actions class="justify-center">
						<v-btn :disabled="!valid" rounded color="primary" @click="update()" justify="center">Submit</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
			<v-dialog v-model="extendDialog" max-width="450">
				<v-card flat max-width="450">
					<v-img :src="extendedImage"></v-img>
					<v-card-actions class="justify-center">
						<v-btn text color="primary" @click="extendDialog=false">Exit</v-btn>
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
///TODO Adaugat camp poza de profil dupa 1 aprilie
import Vue from "vue";
import { UI } from "@startupway/main/lib/ui";
import { User, UserSocialMedia, UserDetails, universities} from "../../common";
import { mapGetters } from "vuex";
export default Vue.extend({
	name: "EditSecuritySettings",
	async mounted() {
		try {
			this.ui = UI.getInstance();
			if (await this.ui.storeDispatch("users/load", {})) {
				if(this.user) {
					try {
						this.firstName = (this.user as User).firstName;
						this.lastName = (this.user as User).lastName;
						this.username = (this.user as User).username;
						this.email = (this.user as User).email;
						this.phone = (this.user as User).phone;
						this.date = new Date((this.user as User).birthDate).toISOString().substr(0, 10);
						this.facebook = (this.user as User).socialMedia.facebook;
						this.linkedin = (this.user as User).socialMedia.linkedin;
						this.webpage = (this.user as User).socialMedia.webpage;
						this.faculty = (this.user as User).userDetails.faculty;
						this.group = (this.user as User).userDetails.group;
						this.details = (this.user as User).userDetails.details;
						let response = await this.ui.api.post<string | null>("/api/v1/uploadDownload/get/file/user/avatar", {userId:this.user.userId});
						if(response.data) {
							this.imgData = response.data;
						}
					} catch (e) {
						console.error(e);
					}
				}
			}
		} catch (e) {
			console.error(e);
		}
	},
	data() {
		return {
			ui:{} as UI,
			extendDialog: false,
			loadingPage:false,
			showNew: false,
			showConfirm: false,
			valid:true,

			imgData:{},

			extendedImage: "",
			universities:universities,
			firstName: "" as string,
			lastName: "" as string,
			email: "" as string,
			passwordNew: "" as string,
			passwordConfirm: "" as string,
			phone: "" as string,
			username: "" as string,
			date: new Date().toISOString().substr(0, 10),
			birthDate: {} as Date,
			facebook: "" as string,
			linkedin: "" as string,
			webpage: "" as string,
			details: "" as string,
			faculty: "" as string,
			group: "" as string,

			characterRules: [
				(f: string) => {
					for(let i = 0; i < f.length; i ++) {
						if(f.charCodeAt(i) > 127) {
							return 'Field must not contain unicode characters!'
						}
					}
					return true;
				},
				(f: string) => {
					if(f.length > 0)
						return true;
					else
						return "Filed cannot be empty!";
				}
			],
			passwordRules: [
				(p: string) => {
					if(p !== "" && p.length < 8)
						return "Password must be at least 8 characters long!";
					else
						return true;
				},
				(f: string) => {
					for(let i = 0; i < f.length; i ++) {
						if(f.charCodeAt(i) > 127) {
							return 'Field must not contain unicode characters!'
						}
					}
					return true;
				},
			],
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
			]
		};
	},
	computed: {
		...mapGetters({
			user: "users/user" 
		})
	},
	methods: {
		extendImage(image: string):void {
			this.extendedImage = image;
			this.extendDialog = true;
		},
		async update():Promise<void> {
			this.loadingPage = true;
			let socialMedia: UserSocialMedia = {
				facebook: this.facebook,
				linkedin: this.linkedin,
				webpage: this.webpage
			};
			let userDetails: UserDetails = {
				faculty:this.faculty,
				group: this.group,
				details: this.details,
				location:this.user.userDetails["location"]  
			};
			let newUser;
			let changedPass = false;
			if (this.passwordNew == "") {
				newUser = {
					userId: this.user.userId,
					firstName: this.firstName,
					lastName: this.lastName,
					role: this.user.role,
					username: this.username,
					password: this.user.password,
					email: this.email,
					phone: this.phone,
					socialMedia: socialMedia,
					avatarUu: this.user.avatarUu,
					birthDate: new Date(this.date),
					lastLogin: this.user.lastLogin,
					userDetails: userDetails
				} as User;
				changedPass = false;
			} else {
				newUser = {
					userId: this.user.userId,
					firstName: this.firstName,
					lastName: this.lastName,
					role: this.user.role,
					username: this.username,
					password: this.passwordNew,
					email: this.email,
					phone: this.phone,
					socialMedia: socialMedia,
					avatarUu: this.user.avatarUu,
					birthDate: new Date(this.date),
					lastLogin: this.user.lastLogin,
					userDetails: userDetails
				} as User;
				changedPass = true;
			}
			try {
				let response = await this.ui.api.post<boolean>("/api/v1/users/user/update", {
					newUser:newUser,
					changedPass:changedPass	
				});
				//TODO ADD SNACKBAR
				if (response.data) {
					if (await this.ui.storeDispatch("users/load", {})) {
						this.firstName = this.user.firstName;
						this.lastName = this.user.lastName;
						this.username = this.user.username;
						this.email = this.user.email;
						this.phone = this.user.phone;
						this.date = new Date(this.user.birthDate).toISOString().substr(0, 10);
						this.facebook = this.user.socialMedia.facebook;
						this.linkedin = this.user.socialMedia.linkedin;
						this.webpage = this.user.socialMedia.webpage;
						this.details = this.user.userDetails.details;
						this.faculty = this.user.userDetails.faculty;
						this.group = this.user.userDetails.group;
					}
				}
			} catch (error) {
				console.error(error);
			}
			this.loadingPage = false;
		},
	}
});
</script>

<style lang="less">
</style>
