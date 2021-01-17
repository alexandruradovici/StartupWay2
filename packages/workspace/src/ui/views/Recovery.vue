<template>
	<v-app>
		<v-main>
			<v-container fluid fill-height>
				<v-layout align-center justify-center>
					<v-flex xs12 sm8 md4>
						<v-img src="img/startupway-668px.png" contain></v-img>
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
import VueRecaptcha from 'vue-recaptcha';
import { NO_TOKEN } from "@startupway/users/lib/ui";
import { UI } from "@startupway/main/lib/ui";
export default Vue.extend({
	name: "Recovery",
	components: {
		VueRecaptcha
	},
	mounted() {
		this.ui = UI.getInstance();
	},
	data() {
		return {
			ui:{} as UI,
            password:"",
            newPassword:"",
			token:"",
			match:false,
			email:""
		};
    },
	watch: {
		_token: {
			immediate: true,
			async handler(value: string) {
				if (value !== "") {
					let serverResponse = await axios.get("/api/v1/user", {
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
			async handler(newRoute) {
				this.token = this.$route.params.token;
                try {
                    let response = await this.ui.api.post("/api/v1/checkToken",{token:this.token});
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
		async resetPassword() {
            try {
                if(this.password !== this.newPassword) {
                    this.match=true;
                } else {
                    let response = await this.ui.api.post("/api/v1/resetPassword", {
                        token:this.token,
                        password:this.password
                    });
                    if(response.data.username) {
                        let token = await this.ui.storeDispatch("users/login", {
							username: response.data.username,
							password: this.password,
							lastLogin: new Date()
						});
						if(token !== NO_TOKEN)
							await this.ui.api.post("/api/v1/deleteRecovery",{token:this.token});
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