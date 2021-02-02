<template>
	<v-app>
		<v-main background-color="#fcfcfc">
			<v-container>
				<v-row no-gutters>
					<v-col cols="12" sm="6" md="8" lg="9" xl="9">
						<div class="justify-center">
							<v-row justify="center" no-gutters>
								<v-col md="auto">
									<h1 style="font-family: Georgia, serif; text-align: center; text-weight: bold, font-size: 20px; margin-top: 70px;"> Hello {{user.firstName}} {{user.lastName}} and welcome to StartupWay!</h1>
									<h1 v-if="teams.length === 0" style="font-family: Georgia, serif; text-align: center; text-weight: bold, font-size: 20px; margin-top: 20px;">Oops, it seems like you are not enroled in any team, please contact your mentor for more details.</h1>
									<h1 v-else style="font-family: Georgia, serif; text-align: center; text-weight: bold, font-size: 20px; margin-top: 20px;">You are currently enroled in {{ teams.length }} <div v-if="teams.length===1">team.</div> <div v-else>teams.</div></h1>
									<h1 v-if="!currentTeam" style="font-family: Georgia, serif; text-align: center; text-weight: bold, font-size: 20px; margin-top: 20px;">Please select your team from the top right corner.</h1>

									<v-container pr-7 pl-7 fluid>
										<v-card rounded v-for="(item, index) in productUpdates" :key="index" class="mb-4">
											<v-card-title style="font-weight: bold;">
												<v-icon large left color="#22542b" v-if="item.feedType===FeedTypes.INVESTMENT">mdi-account-cash</v-icon>
												<v-icon large left color="#e0ac1b" v-if="item.feedType===FeedTypes.AWARD">mdi-trophy</v-icon>
												<v-icon large left color="#9e2219" v-if="item.feedType===FeedTypes.UPDATE">mdi-update</v-icon>
												<v-icon large left color="#202b4f" v-if="item.feedType===FeedTypes.COLLABORATORS">mdi-account-tie</v-icon>
												
												{{ item.feedType }}
												<br/>
											</v-card-title>
											<v-card-subtitle v-if="item && item.date" style="font-size: 15px; font-weight: bold;">
												{{ formatDate(item.date) }}
											</v-card-subtitle>
											<v-divider></v-divider>
											<v-card-text>
												<span>{{ item.text["text"] }}</span>
												<v-spacer></v-spacer>
												<span v-if="item.feedType === FeedTypes.INVESTMENT"> Amount:{{ item.text["amount"] }} </span>
											</v-card-text>
										</v-card>
									</v-container>
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
import { Feed } from "@startupway/feed/lib/ui";
import { Team, Product } from "../../common";
export default Vue.extend({
	name: "FrontPage",
	data() {
		return {
			ui:UI.getInstance(),
			teamId: 0 as Number,
			role:false,
			userMenu:{
				title:"",
				subtitle:""
			},
			productUpdates:[] as Feed[],
		};
	},
	watch: {
		currentTeam: {
			immediate: true,
			async handler (newTeam: Team | null) { 
				if(newTeam) {
					let response = await this.ui.api.get("/api/v1/teams/product/" + newTeam.teamId);
					let product:Product | null = response.data;
					if(product) {
						(newTeam as any).businessTrack = product.businessTrack;
						(newTeam as any).teamType = product.teamType;
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
			handler (newToken:string) {
				if(newToken === null){
					if(this.$route.path !== "/login")
						this.$router.push("/login");
				}
			}
		},
		user: {
			immediate: true,
			async handler (newUser: any) {
				if(newUser){
					await this.ui.storeDispatch("teams/loadTeams",newUser.userId);
				}
			}
		},
		feed: {
			immediate: true,
			handler(newFeed: Feed[]) {
				this.productUpdates = newFeed;
			}
		}
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