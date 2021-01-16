<template>
	<v-main>
		<v-container>
			<v-card class="elevation-12">
				<v-card-text style="margin-top: 50px;">
					<v-img :src="loginImage"/>
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
					<v-btn rounded height="40" width="300" color="primary" @click="loginFunction()">Login</v-btn>
				</v-card-actions>
			</v-card>
		</v-container>
	</v-main>
</template>

<script lang="ts">
import Vue from "vue";
import login from "../img/login.jpeg";
import { UI } from '@startupway/main/lib/ui';
import { NO_TOKEN } from '../../common/common';
import { mapGetters } from "vuex";
export default Vue.extend({
	name: "Login",
	mounted() {
		this.ui = UI.getInstance()
	},
	data() {
		return {
			ui: {} as UI,
			login: "" as string,
			pass: "" as string,
			snackbar:false,
			dialog:false,
			verified:true,
			sent:true,
			email:"",
			lightOff: true,
			lightOn: false,
			aKey:"6Le6Jq4ZAAAAAEf_TFh2ZR-3tv3wycflW7ctlEeF",
			loginImage: login
		};
	},
	watch: {
		_token: {
			immediate: true,
			async handler(value: string) {
				if (value !== NO_TOKEN) {
					let serverResponse = await this.ui.api.get("/api/v1/user", {
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
		// update(prop:boolean) {
		// 	this.snackbar = prop;
		// },
		// validate(response:any) {
		// 	if(response) {
		// 		this.verified = false;
		// 	}
		// },
		// 
		async resetPassword() {
			// try {
			// 	let response = await this.ui.application.api.get("/api/v1/verify/"+this.email);
			// 	if(response.data.accept = "Yes") {
			// 		await this.ui.application.api.post("/api/v1/createResetEmail", {email:this.email});
			// 		this.verified = false;
			// 		this.sent=false;
			// 	}
			// } catch (e) {
			// 	if(e.response.status === 404) {
			// 		this.snackOptions.text = "The email does not exists. If the error persists, please contact technical support: teams@tech-lounge.ro.";
			// 		this.snackOptions.type = SnackBarTypes.ERROR;
			// 		this.snackOptions.timeout = 2000;
			// 		this.snackbar = true;

			// 	} else {
			// 		console.error(e);
			// 		this.snackOptions.text = "Server Error. If the error persists, please contact technical support: teams@tech-lounge.ro.";
			// 		this.snackOptions.type = SnackBarTypes.ERROR;
			// 		this.snackOptions.timeout = 2000;
			// 		this.snackbar = true;

			// 	}
			// }
		},
		async loginFunction() {
			try {
				let token = <any> await this.ui.storeDispatch("users/login", {
					username: this.login,
					password: this.pass,
					lastLogin: new Date()
				});
				console.log(token)
				if(token === "cred") {
					// this.snackOptions.text = "Password or Username incorrect";
					// this.snackOptions.type = SnackBarTypes.ERROR;
					// this.snackOptions.timeout = 2000;
					this.snackbar = true;
				} else if(token === "error") {
					// this.snackOptions.text = "Server Error. If the error persists, please contact technical support: teams@tech-lounge.ro.";
					// this.snackOptions.type = SnackBarTypes.ERROR;
					// this.snackOptions.timeout = 2000;
					this.snackbar = true;
				}
			} catch (error) {
				// this.snackOptions.text = "Server Error. If the error persists, please contact technical support: teams@tech-lounge.ro.";
				// this.snackOptions.type = SnackBarTypes.ERROR;
				// this.snackOptions.timeout = 2000;
				this.snackbar = true;
				console.error(error);
			}
			
		}
	}
});
</script>

<style lang="less">
</style>