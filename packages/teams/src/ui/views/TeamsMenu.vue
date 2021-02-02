<template>
	<div>
		<SimpleMenu v-if="teams.length !== 0" :options="options" @click="click"></SimpleMenu>
		<SnackBar :options="snackOptions" :snackbar="snackbar" @update-prop="update"></SnackBar>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Team } from "../../common";
import { mapGetters } from "vuex";
import { UI } from '@startupway/main/lib/ui';
import { User } from '@startupway/users/lib/ui';
import { SnackBarOptions, SnackBarTypes, SimpleMenuItem, SimpleMenuOptions } from "@startupway/menu/lib/ui";

export default Vue.extend({
	name: "TeamsMenu",
	async mounted() {
		try {
			await this.ui.storeDispatch("users/load", {});	
		} catch(e) {
			console.error(e);
		}
	},
	watch: {
		currentTeam: {
			immediate: true,
			async handler (newTeam: Team) {
				if(newTeam) {
					this.options.menuName = newTeam.teamName;
					try {
						if(newTeam.teamId !== 0 && newTeam.teamId !== undefined) {
							const response = await this.ui.api.get("/api/v1/uploadDownload/get/file/product/logo/"+ newTeam.productId);
							if(response.status === 200) {
								const aux = this.options;
								aux.img = response.data[0].data;
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
							this.snackOptions.text = "Server Error while Loading Team Avatar. If the error persists, please contact technical support: teams@tech-lounge.ro.";
							this.snackOptions.type = SnackBarTypes.ERROR;
							this.snackOptions.timeout = 2000;
							this.snackbar = true;
						}
						this.options.img = "";
					}
				}
			}
		},
		teams: {
			immediate: true,
			async handler (newTeams: Team[]) {
				this.options.items = [];
				for(const team of this.teams) {
					await this.getTeamImage(team);
					const item: SimpleMenuItem = {
						id: team.teamId,
						title: team.teamName,
						icon: "mdi-group",
						img:(this.img as any).data
					}
					if(this.options.items.find((letter:any) => {
						return letter.id === item.id;
					}) === undefined) {
						this.options.items.push(item)
					}
				}
				if(this.options.items.length > 0)
					this.$store.dispatch ("teams/selectTeam", this.options.items[0].id);
			},
		},
		user: {
			immediate:true,
			async handler (newUser:User) {	
				if(newUser) {
					if( newUser.userId != 0 || newUser.userId )
					{
						try {
							await this.ui.storeDispatch("teams/loadTeams",newUser.userId);
						} catch(e) {
							console.error(e);
						}
					}
				}
			}
		}

	},
	computed: {
		...mapGetters ({
			currentTeam: "teams/currentTeam",
			_teams: "teams/teams",
			user:"users/user"
		}),
		teams (): Team[] {
			return this._teams as Team[];
		}
	},
	data () {
		return {
			ui: UI.getInstance(),
			length:false,
			options: {
				menuName: "Select a team",
				menuIcon: "mdi-account-group-outline",
				menuTooltip:"View Your Teams",
				items: []
			} as SimpleMenuOptions,
			snackOptions: {
				text:"",
				type:"info",
				timeout:2000
			} as SnackBarOptions,
			snackbar:false,
			img:{data:""},
		}
	},
	methods: {
		async getTeamImage(team:Team){
			if(team.teamId !== 0 && team.teamId !== undefined) {
				const response = await this.ui.api.get("/api/v1/uploadDownload/get/file/product/logo/"+ team.productId);
				if(response.status === 200) {
					if(response.data.length > 0)
					this.img=response.data[0];
					else 
					this.img={data:""};
				} else if(response.status === 500) {
					// const item: SimpleMenuItem = {
					// 	id: team.teamId,
					// 	title: team.teamName,
					// 	icon: "mdi-group",
					// }
					this.img={data:""};
					this.snackOptions.text = "Server Error while Loading User Avatar. If the error persists, please contact technical support: teams@tech-lounge.ro.";
					this.snackOptions.type = SnackBarTypes.ERROR;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				} else {
					this.img={data:""};
				}
			}
		},
		click(id: number) {
			this.$store.dispatch ("teams/selectTeam", id);
		},
		update(prop:boolean) {
			this.snackbar = prop;
		},
	}
});
</script>