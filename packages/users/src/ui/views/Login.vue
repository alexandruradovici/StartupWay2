<template>
	<v-main style="background-color: rgba(25, 126, 129, 0.1)">
			<v-container fluid fill-height>
				<v-layout align-center justify-center> 
					<v-flex xs12 sm8 md4>
						<!-- <p class="text-center display-2">
							Welcome to
						</p>
						<v-img src="img/startupway-668px.png" contain></v-img>
						<v-spacer></v-spacer> -->
						<v-card class="elevation-12">
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
									></v-text-field>

									<v-text-field
										id="password"
										v-model="pass"
										label="Password"
										name="password"
										type="password"
										rounded
										outlined
										color="primary"
										prepend-icon="mdi-key-variant mdi-36px"
										@keyup.enter="loginFunction()"
									></v-text-field>
								</v-form>
							</v-card-text>
							<v-card-actions class="justify-center">
								<v-col class="justify-center">
									<v-row class="justify-center">
										<v-btn rounded height="40" width="300" color="primary" @click="loginFunction()">Login</v-btn>
									</v-row>
									<v-row class="justify-center">
										<v-btn color="primary" text @click="dialog=true" style="margin-top: 30px;">Forgot Password?</v-btn>
									</v-row>
								</v-col>
								
							</v-card-actions>
						</v-card>
					</v-flex>
				</v-layout>
				<v-dialog width="450" v-model="dialog" persistent>
					<v-card width="450" flat>
						<v-card-title class="justify-center" style="font-family: Georgia, serif; margin: auto;">
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
							<vue-recaptcha @verify="validate" :sitekey="aKey" :loadRecaptchaScript="true"></vue-recaptcha>
						</v-card-text>
						<v-card-actions>
							<v-btn v-if="sent" :disabled="verified" @click="resetPassword()">Reset Password</v-btn>
							<v-spacer></v-spacer>
							<v-btn color="primary" @click="dialog=false, sent=true">Close</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-container>
			<SnackBar :options="snackOptions" :snackbar="snackbar" @update-prop="update"></SnackBar>
		</v-main>
</template>

<script lang="ts">
import Vue from "vue";
import login from "../img/welcome-startupway-white-668px.png";
import { UI } from '@startupway/main/lib/ui';
import { SnackBarOptions, SnackBarTypes } from '@startupway/menu/lib/ui';
import { NO_TOKEN } from '../../common';
import { mapGetters } from "vuex";
export default Vue.extend({
	name: "Login",
	// components: {
	// 	"SnackBar": SnackBar
	// },
	mounted() {
		this.ui = UI.getInstance()
	},
	data() {
		return {
			ui: {} as UI,
			login: "" as string,
			pass: "" as string,
			snackOptions: {
				text:"",
				type:"info",
				timeout:2000
			} as SnackBarOptions,
			snackbar:false,
			dialog:false,
			verified:true,
			sent:true,
			email:"",
			lightOff: true,
			lightOn: false,
			aKey:"6Le6Jq4ZAAAAAEf_TFh2ZR-3tv3wycflW7ctlEeF",
			loginImage: login,
		};
	},
	watch: {
		_token: {
			immediate: true,
			async handler(value: string) {
				if (value !== NO_TOKEN) {
					let serverResponse = await this.ui.api.get("/api/v1/users/user", {
						headers: { Authorization: `Bearer ${this._token}` }
					});
					if (serverResponse.status !== 401) {
						if(this.$route.path!=="/workspace")
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
			handler() {
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
		update(prop:boolean) {
			this.snackbar = prop;
		},
		validate(response:any) {
			if(response) {
				this.verified = false;
			}
		},
		
		async resetPassword() {
			try {
				let response = await this.ui.api.get("/api/v1/verify/"+this.email);
				if(response.data.accept = "Yes") {
					await this.ui.api.post("/api/v1/createResetEmail", {email:this.email});
					this.verified = false;
					this.sent=false;
				}
			} catch (e) {
				if(e.response.status === 404) {
					this.snackOptions.text = "The email does not exists. If the error persists, please contact technical support: teams@tech-lounge.ro.";
					this.snackOptions.type = SnackBarTypes.ERROR;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;

				} else {
					console.error(e);
					this.snackOptions.text = "Server Error. If the error persists, please contact technical support: teams@tech-lounge.ro.";
					this.snackOptions.type = SnackBarTypes.ERROR;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;

				}
			}
		},
		async loginFunction() {
			try {
				let token = <any> await this.ui.storeDispatch("users/login", {
					username: this.login,
					password: this.pass,
					lastLogin: new Date()
				});
				if(token === "cred") {
					this.snackOptions.text = "Password or Username incorrect";
					this.snackOptions.type = SnackBarTypes.ERROR;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				} else if(token === "error") {
					this.snackOptions.text = "Server Error. If the error persists, please contact technical support: teams@tech-lounge.ro.";
					this.snackOptions.type = SnackBarTypes.ERROR;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				}
			} catch (error) {
				this.snackOptions.text = "Server Error. If the error persists, please contact technical support: teams@tech-lounge.ro.";
				this.snackOptions.type = SnackBarTypes.ERROR;
				this.snackOptions.timeout = 2000;
				this.snackbar = true;
				console.error(error);
			}
			
		}
	}
});
</script>

<style lang="less">
</style>