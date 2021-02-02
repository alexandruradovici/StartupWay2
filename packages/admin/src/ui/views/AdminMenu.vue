<template>
	<SimpleMenu v-if="userRole" :options="options" @click="click"></SimpleMenu>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { User } from "@startupway/users/lib/ui";
import { UI } from "@startupway/main/lib/ui";
import { SimpleMenuOptions } from "@startupway/menu/lib/ui";
enum MENU {
	ADMIN_PANEL,
	CSV
};

export default Vue.extend({
	name: "AdminMenu",
	data () {
		return {
			ui: UI.getInstance(),
			userRole:false,
			options: {
				menuName: "",
				menuIcon: "mdi-cogs",
				menuTooltip:"Admin Panel",
				items: [
					{
						id: MENU.ADMIN_PANEL,
						title:"Manage",
						icon:"mdi-wan",
						link:"/admin"
					},
					{
						id: MENU.CSV,
						title:"Import CSV",
						icon:"mdi-file-delimited",
						link:"/csv"
					}
				]
			} as SimpleMenuOptions
		}
	},
	computed: {
		...mapGetters({
			user:"users/user"
		})
	},
	watch: {
		user: {
			immediate: true,
			async handler(newUser: User) {
				if(newUser) {
					const role = JSON.parse(this.user.role);
					if (role["Admin"]) {
						this.userRole = role["Admin"];
					} else if(role["SuperAdmin"]) {
						this.userRole = role["SuperAdmin"];
					}
				}
			}
		},
	},
	methods: {
		async click (id: number) {
			
			
		}
	}
});
</script>