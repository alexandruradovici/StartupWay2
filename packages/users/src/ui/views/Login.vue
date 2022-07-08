<template>
	<v-app>
		<v-container
			fluid 
			fill-height
			class="bg"
		>
			<v-layout align-center justify-center> 
				<v-flex xs12 sm8 md4>
					<v-fab-transition>
						<v-card v-if="loadedPage" class="elevation-12" shaped>
							<v-toolbar color="primary" dark flat height="170px" style="padding">
								<v-img contain :src="loginImage" max-height="170"></v-img>								 								
							</v-toolbar>
							<v-card-text style="margin-top: 50px;">
								<v-form>
									<v-text-field
										id="login"
										v-model="login"
										label="Username"
										name="login"
										type="text"
										rounded
										outlined
										color="primary"
										prepend-icon="mdi-account-circle mdi-36px"
										@keyup.enter="loginFunction()"
										class="pb-2"
									></v-text-field>

									<v-text-field
										id="password"
										v-model="pass"
										label="Password"
										name="password"
										:type="showPassword ? 'text' : 'password'"
										rounded
										outlined
										color="primary"
										prepend-icon="mdi-key-variant mdi-36px"
										:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
										@click:append="showPassword = !showPassword"
										@keyup.enter="loginFunction()"
										class="pb-2"
									></v-text-field>
								</v-form>
							</v-card-text>
							<v-card-actions class="justify-center">
								<v-col class="justify-center">
									<v-row class="justify-center">
										<v-btn :disabled="triggered" rounded min-height="10%" width="75%" color="primary" @click="loginFunction()">Login</v-btn>
									</v-row>
									<v-row class="justify-center">
										<v-btn color="primary" width="75%" text @click="dialog=true" style="margin-top: 30px;">Forgot Password?</v-btn>
									</v-row>
								</v-col>
							</v-card-actions>
						</v-card>
					</v-fab-transition>
				</v-flex>
			</v-layout>
			<v-scale-transition>
				<v-dialog width="450" v-model="dialog" persistent>
					<v-card width="450" flat>
						<v-card-title class="justify-center" style=" margin: auto;">
							Password Recovery
						</v-card-title>
						<v-divider></v-divider>
						<v-card-text v-if="!sent" style="margin-top: 20px;">
							An email with the reset link has been sent to your account
						</v-card-text>
						<v-card-text v-else style="margin-top: 20px;">
							Please enter your email
							<v-spacer></v-spacer>
							<v-text-field v-model="email" placeholder="Email"></v-text-field>
							<v-scale-transition>
								<vue-recaptcha v-show="loadedRecaptcha" @hook:mounted="loadedRecaptcha = true" @verify="validate" :sitekey="aKey" :loadRecaptchaScript="true"></vue-recaptcha>
							</v-scale-transition>
						</v-card-text>
						<v-card-actions>
							<v-btn v-if="sent" :disabled="verified" @click="resetPassword()">Reset Password</v-btn>
							<v-spacer></v-spacer>
							<v-btn color="primary" @click="dialog=false, sent=true">Close</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-scale-transition>
		</v-container>
		<SnackBar :options="snackOptions" @update-snackbar="update" :snackbar="snackbar"></SnackBar>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import login from "../img/welcome-startupway-white-668px.png";
import { UI } from "@startupway/main/lib/ui";
import { User } from "../../common";
import { SnackBarOptions, SnackBarTypes, SnackBarHorizontal, SnackBarVertical } from "@startupway/menu/lib/ui";
import { mapGetters } from "vuex";
import VueRecaptcha from "vue-recaptcha";
interface ILogin {
	ui: UI,
	login: string,
	pass: string,
	snackOptions: SnackBarOptions,
	showPassword: boolean,
	snackbar: boolean,
	dialog: boolean,
	verified: boolean,
	sent: boolean,
	email: string,
	lightOff: boolean,
	lightOn: boolean,
	aKey: string,
	loginImage: string,
	triggered: boolean,
	loadedPage: boolean,
	loadedRecaptcha: boolean,
}
export default Vue.extend({
	name: "Login",
	components: {
		VueRecaptcha
	},
	mounted () {
		this.ui.logEvent(
			"USERS",
			(this.$options.name ? this.$options.name : "UNKOWN"),
			`${VueRecaptcha.name} Loaded`
		);
		this.loadedPage = true;
	},
	data (): ILogin {
		return {
			ui: UI.getInstance(),
			login: "" as string,
			pass: "" as string,
			snackOptions: {
				text:"",
				type: SnackBarTypes.INFO,
				timeout:2000,
				horizontal: SnackBarHorizontal.RIGHT,
				vertical: SnackBarVertical.BOTTOM
			},
			showPassword: false,
			snackbar: false,
			dialog: false,
			verified: true,
			sent: true,
			email: "",
			lightOff: true,
			lightOn: false,
			aKey:"6Le6Jq4ZAAAAAEf_TFh2ZR-3tv3wycflW7ctlEeF",
			loginImage: login,
			triggered: false,
			loadedPage: false,
			loadedRecaptcha: false,
		};
	},
	watch: {
		_token: {
			immediate: true,
			async handler(value: string):Promise<void> {
				if (value) {
					let serverResponse = await this.ui.api.get<User | null>("/api/v1/users/user", {
						headers: { Authorization: `Bearer ${this._token}` }
					});
					if (serverResponse.status !== 401) {
						if (this.$route.path!=="/workspace")
							this.$router.push("/workspace");
					}
					// get user - if not 401 push this.$router.push ("/workspace")
					// else delete token
				} else {
					// error
				}
			}
		},
		ligthOff: {
			immediate: true,
			handler():void {
				setInterval( () => {
					this.lightOff = !this.lightOff;
					this.lightOn = !this.lightOn;
				}, 1000);
			}
		}
	},
	computed: {
		...mapGetters({
			_token: "users/token"
		})
	},
	methods: {
		update (prop:boolean): void {
			this.snackbar = prop;
		},
		// as any -> Google api, to reseach into response type.
		validate(response:any):void {
			if (response) {
				this.verified = false;
			}
		},
		
		async resetPassword():Promise<void> {
			try {
				let response = await this.ui.api.get<{accept:string}>("/api/v1/users/verify/"+this.email);
				if (response.data.accept = "Yes") {
					await this.ui.api.post("/api/v1/admin/createResetEmail", {email:this.email});
					this.verified = false;
					this.sent=false;
				}
			} catch (error) {
				console.error(error);
				this.snackOptions.text = "FrontEnd error. If the error persists, please contact technical support: teams@tech-lounge.ro.";
				this.snackOptions.type = SnackBarTypes.ERROR;
				this.snackOptions.timeout = 2000;
				this.snackbar = true;
			}
		},
		async loginFunction():Promise<void> {
			this.triggered = true;
			try {
				let token = <string> await this.ui.storeDispatch("users/login", {
					username: this.login,
					password: this.pass,
					lastLogin: new Date()
				});
				if (token === "cred") {
					this.snackOptions.text = "Password or Username incorrect";
					this.snackOptions.type = SnackBarTypes.ERROR;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				} else if (token === "error") {
					this.snackOptions.text = "Server Error. If the error persists, please contact technical support: teams@tech-lounge.ro.";
					this.snackOptions.type = SnackBarTypes.ERROR;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				}
			} catch (error) {
				console.error(error);
				this.snackOptions.text = "FrontEnd error. If the error persists, please contact technical support: teams@tech-lounge.ro.";
				this.snackOptions.type = SnackBarTypes.ERROR;
				this.snackOptions.timeout = 2000;
				this.snackbar = true;
			}
			this.triggered = false;
		}
	}
});
</script>

<style lang="css">
.bg {
	background-image: linear-gradient(to right top, #ffffff, #fafbfe, #f4f8fc, #ecf5fa, #e4f2f6, #d2e7eb, #c0dcde, #aed1d1, #8dbcbc, #6ca7a8, #499294, #197e81);
}
</style>