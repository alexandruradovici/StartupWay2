<template>
	<v-app>
		<v-main background-color="#fcfcfc">
			<v-container>
				<v-row no-gutters>
					<v-col cols="12" sm="6" md="8" lg="9" xl="9">
						<div class="justify-center">
							<v-row justify="center" no-gutters>
								<v-col md="auto">
									<h1 v-if="user" style="font-family: Georgia, serif; text-align: center; text-weight: bold, font-size: 20px; margin-top: 70px;"> Hello {{user.firstName}} {{user.lastName}} and welcome to StartupWay!</h1>
									<h1 v-if="teams.length === 0" style="font-family: Georgia, serif; text-align: center; text-weight: bold, font-size: 20px; margin-top: 20px;">Oops, it seems like you are not enroled in any team, please contact your mentor for more details.</h1>
									<h1 v-else style="font-family: Georgia, serif; text-align: center; text-weight: bold, font-size: 20px; margin-top: 20px;">You are currently enroled in {{ teams.length }} <div v-if="teams.length===1">team.</div> <div v-else>teams.</div></h1>
									<h1 v-if="!currentTeam" style="font-family: Georgia, serif; text-align: center; text-weight: bold, font-size: 20px; margin-top: 20px;">Please select your team from the top right corner.</h1>
								</v-col>
							</v-row>
						</div>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { mapGetters } from "vuex";
import { UI } from "@startupway/main/lib/ui";
import { User } from "@startupway/users/lib/ui";
import { Team, Product } from "../../common";
export default Vue.extend({
	name: "FrontPage",
	data() {
		return {
			ui:UI.getInstance(),
			teamId: "",
			role:false,
			userMenu:{
				title:"",
				subtitle:""
			},
		};
	},
	watch: {
		currentTeam: {
			immediate: true,
			async handler (newTeam: Team | null):Promise<void> { 
				if(newTeam) {
					let response = await this.ui.api.get<Product | null>("/api/v1/teams/product/" + newTeam.teamId);
					let product:Product | null = response.data;
					if(product) {
						(newTeam as Team&Product).businessTrack = product.businessTrack;
						(newTeam as Team&Product).teamType = product.teamType;
						this.teamId = newTeam.teamId;
						{
							try {
								await this.ui.storeDispatch("feed/loadFeed", this.teamId);
							} catch (e) {
								console.error(e);
							}
						}
					}
				}
				
			}
		},
		_token: {
			immediate:true,
			handler (newToken:string):void {
				if(newToken === null){
					if(this.$route.path !== "/login")
						this.$router.push("/login");
				}
			}
		},
		user: {
			immediate: true,
			async handler (newUser: User):Promise<void> {
				if(newUser){
					await this.ui.storeDispatch("teams/loadTeams",newUser.userId);
				}
			}
		},
	},
	computed: {
		...mapGetters({
			_token: "users/token",
			user: "users/user",
			currentTeam: "teams/currentTeam",
			_teams: "teams/teams",
			feed: "feed/feed"
		}),
		teams (): Team[] {
			return this._teams as Team[];
		},
	},
	methods: {
		moment() {
			return moment();
		},
	}
});
</script>
<style lang="less">
</style>