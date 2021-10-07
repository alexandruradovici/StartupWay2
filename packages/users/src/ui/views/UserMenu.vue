<template>
	<div>
		<SimpleMenu :options="options" @click="click" ></SimpleMenu>
		<SnackBar :options="snackOptions" v-if="snackbar" @update-snackbar="update"></SnackBar>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { UI } from "@startupway/main/lib/ui";
import { SnackBarOptions, SnackBarTypes, SimpleMenuOptions } from "@startupway/menu/lib/ui"
import { User } from "../../common";
import { mapGetters } from "vuex";
enum MenuOptions {
	MY_ACCOUNT = "1", LOGOUT = "2"
};
interface UserMenu {
	ui: UI,
	options: SimpleMenuOptions,
	snackOptions: SnackBarOptions,
	snackbar: boolean,
}
export default Vue.extend({
	name: "UserMenu",
	async mounted() {
		this.ui = UI.getInstance();
		await this.ui.storeDispatch("users/load", {});
	},
	data (): UserMenu {
		return {
			ui: {} as UI,
			options: {
				menuName: "User Menu",
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
			},
			snackOptions: {
				text:"",
				type:SnackBarTypes.INFO,
				timeout:2000
			},
			snackbar: false,
		}
	},
	watch: {
		user: {
			immediate: true,
			async handler (user: User): Promise<void> {
				try {
					if (user) {
						this.options.menuName = user.firstName + " " + user.lastName;
						let response = await this.ui.api.post<string | null>("/api/v1/uploadDownload/get/file/user/avatar", {userId:user.userId});

						if (response.data) {
							let aux = this.options;
							aux.img = response.data;
							this.options = aux;
						} else if (response.status === 500) {
							this.snackOptions.text = "Server Error while Loading User Avatar. If the error persists, please contact technical support: teams@tech-lounge.ro.";
							this.snackOptions.type = SnackBarTypes.ERROR;
							this.snackOptions.timeout = 2000;
							this.snackbar = true;
						} else {
							this.options.img = "";
						}
					}
				} catch (e) {
					if (e.status === 500) {
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
		async click (id: string): Promise<void> {
			try {
				if (id === MenuOptions.LOGOUT) {
					await this.ui.storeDispatch ('users/logout', {});
					// await this.ui.storeDispatch("teams/selectTeam", 0);
					if (this.$route.path !== "/login") {
						this.$router.push("/login");
					}
				}
			} catch (error) {
				const e = error as Error;
				console.error(e);
			}
		},
		update (prop:boolean): void {
			this.snackbar = prop;
		},
	}
});
</script>