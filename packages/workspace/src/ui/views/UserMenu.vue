<template>
	<div>
		<SimpleMenu :options="options" @click="click" ></SimpleMenu>
		<SnackBar :options="snackOptions" :snackbar="snackbar" @update-prop="update"></Snackbar>
	</div>
	
</template>

<script lang="ts">
import Vue from "vue";
import { UI } from '@startupway/main/lib/ui';
import { SnackBarOptions, SnackBarTypes, SimpleMenuOptions } from "@startupway/menu/lib/ui"
import { User } from "@startupway/users/lib/ui";
import { mapGetters } from "vuex";
enum MenuOptions {
	MY_ACCOUNT, LOGOUT
};

export default Vue.extend({
	name: "UserMenu",
	mounted() {
		this.ui = UI.getInstance()
	},
	data () {
		return {
			ui: {} as UI,
			options: {
				menuName: "",
				menuIcon: "mdi-account",
				img:"",
				menuTooltip:"Your Account",
				items: [
					{
						id: MenuOptions.MY_ACCOUNT,
						title:"My Account",
						icon:"mdi-account-settings",
						link:"/user/account",
					},
					{
						id: MenuOptions.LOGOUT,
						title: "Logout",
						icon: "mdi-exit-run",
					}
				]
			} as SimpleMenuOptions,
			snackOptions: {
				text:"",
				type:"info",
				timeout:2000
			} as SnackBarOptions,
			snackbar:false,
		}
	},
	watch: {
		user: {
			immediate: true,
			async handler (user: User) {
				this.options.menuName = user.firstName + " " + user.lastName;
				try {
					if(user.userId !== 0 && user.userId !== undefined) {
						let response = await this.ui.api.post("/api/v1/get/file/user/avatar", {userId:user.userId});

						if(response.status === 200) {
							let aux = this.options;
							aux.img = response.data;
							this.options = aux;
						} else if(response.status === 500) {
							this.snackOptions.text = "Server Error while Loading User Avatar. If the error persists, please contact technical support: teams@tech-lounge.ro.";
							this.snackOptions.type = SnackBarTypes.ERROR;
							this.snackOptions.timeout = 2000;
							this.snackbar = true;
						} else {
							this.options.img = "";
						}
					}
				} catch (e) {
					if(e.status === 500) {
						console.error(e);
						this.snackOptions.text = "Server Error while Loading User Avatar. If the error persists, please contact technical support: teams@tech-lounge.ro.";
						this.snackOptions.type = SnackBarTypes.ERROR;
						this.snackOptions.timeout = 2000;
						this.snackbar = true;
					}
					this.options.img = "";
				}
				
			}
		},
	},
	computed: {
		...mapGetters ({
			user: "users/user"
		}),
	},
	methods: {
		async click (id: number) {
			if (id === MenuOptions.LOGOUT) {
				try {
					await this.ui.storeDispatch ('users/logout', {});
					// await this.ui.storeDispatch("teams/selectTeam", 0);
					if(this.$route.path !== "/login")
							this.$router.push("/login");
				} catch (error) {
					console.error(error);
				}
			
			}
		},
		update(prop:boolean) {
			this.snackbar = prop;
		},
	}
});
</script>