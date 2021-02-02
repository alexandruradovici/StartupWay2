<template>
	<v-app>
		<v-container v-if="!loadingPage">
			<v-form v-model="valid" lazy-validation> 
				<v-card flat style="margin: auto; padding-top: 20px;" max-width="900" color="#fcfcfc">
					<v-card-title class="justify-center">
						<v-list-item-avatar size="60">
								<v-img   v-if="imgData !== ''" :src="imgData" @click="extendImage(imgData)"></v-img>
								<v-icon v-else>mdi-account-circle mdi-48px</v-icon>
						</v-list-item-avatar>
						{{user.firstName}} {{user.lastName}}
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-row justify="center"> 
							<v-col cols="6" align="center">
								<v-file-input 
									type="file" 
									prepend-icon="mdi-camera"
									v-model="file"
									:rules="imageRules"
									filled 
									auto-grow 
									accept="image/*"
									label="Profile Photo"
									color="primary"
								></v-file-input>
								<v-btn rounded color="primary" @click="uploadImage()" justify="center">Upload</v-btn>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="6" align="center">
								<v-text-field
									v-model="firstName"
									:rules="characterRules"
									label="First Name"
									:placeholder="user.firstName"
									color="primary"
									prepend-icon="mdi-account-badge-outline"
								></v-text-field>
							</v-col>
							<v-col cols="6" align="center">
								<v-text-field
									v-model="lastName"
									:rules="characterRules"
									label="Last Name"
									:placeholder="user.lastName"
									color="primary"
									prepend-icon="mdi-account-badge"
								></v-text-field>
							</v-col>
						</v-row>

						<v-row>
							<v-col cols="6" align="center">
								<v-text-field	
									v-model="phone"
									label="Phone"
									:placeholder="user.phone"
									:rules="phoneRules"
									color="primary"
									prepend-icon="mdi-phone"
								></v-text-field>
							</v-col>
							<v-col cols="6" align="center">
								
								<v-btn @click="goToSecurity()" color = primary rounded>
									<v-icon>
										mdi-cog
									</v-icon>
 									Change Security Settings
								</v-btn>
							</v-col>
						</v-row>

						<v-row>
							<v-col cols="6" align="center">
								<v-menu
									ref="dateMenu"
									v-model="dateMenu"
									:close-on-content-click="false"
									:return-value.sync="date"
									transition="scale-transition"
									offset-y
									>
									<template v-slot:activator = "{ on }">
										<v-text-field
											v-model="date"
											label="BirthDate"
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
							</v-col>
							<v-col cols="6" align="center">
								<v-text-field 
									v-model="details" 
									label="User Details" 
									optional
									prepend-icon="mdi-information-outline"
									color="primary"
								></v-text-field>
							</v-col>
						</v-row>

						<v-row>
							<v-col cols="6" align="center">
								<v-select 
									v-model="faculty" 
									:items="universities" 
									label="Faculty"
									optional
									prepend-icon="mdi-school"
									color="primary"
								></v-select>
							</v-col>
							<v-col cols="6" align="center">
								<v-text-field 
									v-model="group" 
									label="Group" 
									optional
									prepend-icon="mdi-group"
									color="primary"
								></v-text-field>
							</v-col>
						</v-row>

						<v-row justify="space-around">
							<v-col cols="4">
								<v-text-field 
								v-model="webpage" 
								label="Webpage Link" 
								optional
								prepend-icon="mdi-web"
								color="primary"
								style="width: 250px;"
								></v-text-field>
							</v-col>
							<v-col cols="4">
								<v-text-field 
								v-model="facebook" 
								label="Facebook Link"
								optional
								prepend-icon="mdi-facebook-box"
								color="primary"
								style="width: 250px;"
								></v-text-field>
							</v-col>
							<v-col cols="4">
								<v-text-field 
								v-model="linkedin" 
								label="Linkedin Link" 
								optional
								prepend-icon="mdi-linkedin-box"
								color="primary"
								style="width: 250px;"
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
	name: "EditAccount",
	async mounted() {
		try {
			this.ui = UI.getInstance();
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
				this.faculty = this.user.userDetails.faculty;
				this.group = this.user.userDetails.group;
				this.details = this.user.userDetails.details;
				if(this.user) {
					try {
						let response = await this.ui.api.post("/api/v1/uploadDownload/get/file/user/avatar", {userId:this.user.userId});
						if(response.status !== 500) {
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
			extendedImage: "",
			extendDialog: false,
			loadingPage:false,
			show: false,
			dateMenu: false,
			universities:universities,
			firstName: "" as string,
			lastName: "" as string,
			email: "" as string,
			password: "" as string,
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
			imageRules: [
				(value:File) => !value || value.size < 5000000 || 'Image size should be less than 5 MB!',
			],
			characterRules: [
				(f: string) => {
					if(f.length > 0)
						return true;
					else
						return "Filed cannot be empty!";
				}
			],
			phoneRules:[
				(v:string) => {
					var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
						if(v.match(phoneno))
							return true;
						else
							return "Phone number is not valid";
				}
			],
			//File upload
			file:(undefined  as unknown) as File,
			encoded:false,
			base64Encode:"" as string,
			ext:"" as string,
			profileImage:{},
			imgData:"",
			valid:true
		};
	},
	watch: {
		//FILE upload
		base64Encode: {
			immediate:true,
			handler (base64Encode) {
				if(base64Encode !== '' && base64Encode !== undefined) {
					this.encoded = false;
				} else {
					this.encoded = true;
				}
			}
		},
		file: {
			immediate:false,
			handler(newFile) {
				if(newFile !== "" && newFile !== undefined) {
					this.ext = newFile.name.split('.')[1].toLowerCase();
					if(newFile !== undefined) {
						this._toBase64(newFile);
					} else {
						this.base64Encode = '';
					}			
				}	
			}
		}
	},
	computed: {
		...mapGetters({
			user: "users/user" 
		})
	},
	methods: {
		extendImage(image: string) {
			this.extendedImage = image;
			this.extendDialog = true;
		},
		_toBase64(file:File) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				let result = (reader.result as any).toString().split(",");
				(this.base64Encode as any) = result[1];
			};
			reader.onerror = (err) => {
				console.error(err);
			};
			return true;
		},
		goToSecurity() {
			if(this.$route.path !== "/user/security")
				this.$router.push("/user/security");
		},
		async uploadImage() {
			try {
				let response = await this.ui.api.post("/api/v1/uploadDownload/upload/file/user/avatar", {
					userId:this.user.userId,
					base64Encode:this.base64Encode	
				});
				//TODO ADD SNACKBAR
				if (response) {
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
						let response = await this.ui.api.post("/api/v1/uploadDownload/get/file/user/avatar", {userId:this.user.userId});
						if(response.status !== 500) {
							this.imgData = response.data;
						}
					}
				}
			} catch (error) {
				console.error(error);
			}
		},
		_verifyString(check:string) {
			for(let i = 0; i< check.length; i++) {
				if(check.charCodeAt(i) > 255) {
					this.valid = false;
					return false;
				}
			}
			this.valid = true;
			return true;
		},
		async update() {
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
			if (this.password == "") {
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
					birthDate: (this.date as any) as Date,
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
					password: this.password,
					email: this.email,
					phone: this.phone,
					socialMedia: socialMedia,
					avatarUu: this.user.avatarUu,
					birthDate: (this.date as any) as Date,
					lastLogin: this.user.lastLogin,
					userDetails: userDetails
				} as User;
				changedPass = true;
			}
			try {
				let response = await this.ui.api.post("/api/v1/users/user/update", {
					newUser:newUser,
					changedPass:changedPass	
				});
				//TODO ADD SNACKBAR
				if (response) {
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
