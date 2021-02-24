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
	ADMIN_PANEL = "1",
	CSV = "2"
};

export default Vue.extend({
	name: "AdminMenu",
	data () {
		return {
			ui: UI.getInstance(),
			userRole:"",
			options: {
				menuName: "",
				menuIcon: "mdi-cogs",
				menuTooltip:"Admin Panel",
				items: [
					{
						id: MENU.ADMIN_PANEL,
						title:"Manage",
						icon:"mdi-wan",
						link:"/admin/users"
					},
					{
						id: MENU.CSV,
						title:"Import CSV",
						icon:"mdi-file-delimited",
						link:"/admin/csv"
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
			async handler(newUser: User):Promise<void> {
				if(newUser) {
					if (newUser.role === "Admin" || newUser.role === "SuperAdmin" ) {
						this.userRole = newUser.role;
					}
				}
			}
		},
	},
	methods: {
		async click (id: number):Promise<void> {
		}
	}
});
</script>