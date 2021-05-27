<template>
	<v-app>
		<v-main>
			<v-container fluid fill-height>
				<v-layout align-center justify-center>
					<v-flex xs12 sm8 md4>
						<v-img :src="logoImage" contain></v-img>
						<v-spacer></v-spacer>
						<v-card class="elevation-12">
							<v-toolbar color="primary" dark flat>
								<v-toolbar-title align-center>Password Reset</v-toolbar-title>
								<v-spacer></v-spacer>
							</v-toolbar>
							<v-card-text>
								<v-form>
									<v-text-field
										id="password"
										v-model="password"
										label="New Password"
										name="password"
										type="password"
										@keyup.enter="resetPassword()"
									></v-text-field>
									<v-text-field
										id="newPassword"
										v-model="newPassword"
										label="Retype your password"
										name="newPassword"
										type="password"
										@keyup.enter="resetPassword()"
									></v-text-field>
                                    <span v-if="match">Passwords do not match</span>
								</v-form>
							</v-card-text>
							<v-card-actions>
								<v-btn color="primary" @click="resetPassword()">Reset</v-btn>
							</v-card-actions>
						</v-card>
					</v-flex>
				</v-layout>
			</v-container>
		</v-main>
	</v-app>
</template>



<script lang="ts">
import { mapGetters } from "vuex";
import Vue from "vue";
import axios from "axios";
import logo from "../img/startupway-668px.png";
import VueRecaptcha from 'vue-recaptcha';
import { UI } from "@startupway/main/lib/ui";
export default Vue.extend({
	name: "Recovery",
	components: {
		VueRecaptcha
	},
	data() {
		return {
			ui:UI.getInstance(),
            password:"",
            newPassword:"",
			token:"",
			match:false,
			email:"",
			logoImage:logo
		};
    },
	watch: {
		_token: {
			immediate: true,
			async handler(value: string):Promise<void> {
				if (value && value !== "") {
					let serverResponse = await axios.get("/api/v1/users/user", {
						headers: { Authorization: `Bearer ${this._token}` }
					});
					if (serverResponse.status !== 401) {
						if(this.$route.path !== "/workspace")
							this.$router.push("/workspace");
					}
					// get user - if not 401 push this.$router.push ("/workspace")
					// else delete token
				} else {
					// error
				}
			}
		},
        $route: {
            immediate:true,
			async handler(newRoute?:string):Promise<void> {
				this.token = this.$route.params.token;
                try {
					let response = await this.ui.api.post<{matched:true} | null>("/api/v1/admin/checkToken",{token:this.token});
					if(response.data)
						if(!response.data.matched)
							if(this.$route.path !== "/login")
								this.$router.push("/login"); 
                } catch (e) {
                    console.error(e);
                }
            }
        }
    },
    computed: {
		...mapGetters({
			_token: "users/token"
		})
    },
	methods: {
		async resetPassword():Promise<void> {
            try {
                if(this.password !== this.newPassword) {
                    this.match=true;
                } else {
                    let response = await this.ui.api.post<{username:string} | null>("/api/v1/admin/resetPassword", {
                        token:this.token,
                        password:this.password
					});
                    if(response.data) {
                        let token = await this.ui.storeDispatch("users/login", {
							username: response.data.username,
							password: this.password,
							lastLogin: new Date()
						});
						if(token)
							await this.ui.api.post<boolean>("/api/v1/admin/deleteRecovery",{token:this.token});
                    } else {
                        console.error("Couldn't reset password");
                    }
                }
            } catch (e) {
                console.error(e);
            }
		},
	}
});
</script>