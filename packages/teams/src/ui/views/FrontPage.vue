<template>
	<div>
		<v-container v-if="!loadingPage">
			<v-card color="primary" flat shaped outlined width="100%" class="ma-5">
				<v-card flat shaped outlined width="100%" class="pa-4">
					<v-card-title>
						<v-row justify="center">
							<h1 class="pt-2" v-if="user" style=" text-align: center; text-weight: bold, font-size: 20px;"> 
								Hello {{user.firstName}} {{user.lastName}} and welcome to StartupWay!
							</h1>
						</v-row>
					</v-card-title>
					<v-card-text class="pa-5" style="margin-top: 3%">
						<v-row justify="center">
							<h1 class="pt-2" v-if="teams.length === 0" style=" text-align: center;, font-size: 20px;">
								Oops, it seems like you are not enroled in any team, please contact your mentor for more details.
							</h1>
							<h1 class="pt-2" v-else style=" text-align: center;, font-size: 20px;">
								You are currently enroled in {{ teams.length }} 
								<div v-if="teams.length===1">
									team.
								</div> 
								<div v-else>
									teams.
								</div>
							</h1>
						</v-row>
						<v-row justify="center">
							<h1 class="pt-2" style="text-align: center;, font-size: 20px;">
								You can find a document of how to use the platform at the following link: <a target="_blank" href="https://docs.google.com/document/u/1/d/e/2PACX-1vTMWy4cQEquNi_mP4DQWl1VzzdCdtr35xdUZOBnyIpbyXxmKXEjMK5wgp7GPKp4_vXuLvyHQnOxqVd3/pub">User Guide</a>
							</h1>
						</v-row>
						<v-row justify="center">
							<h1 class="pt-2" v-if="!currentTeam" style=" text-align: center;, font-size: 20px; margin-top: 20px;">
								Please select your team from the top right corner.
							</h1>
						</v-row>
						<v-row justify="center">
							<v-col>
								<v-card color="primary" flat shaped outlined width="100%" class="ma-5">
									<v-card flat shaped outlined width="100%" class="pa-4">
										<v-card-title>
											<v-row justify="center">
												<v-col>
													<h3 style=" text-align: center;, font-size: 20px;">
														Key Performance Indicators
													</h3>
												</v-col>
											</v-row>	
										</v-card-title>
										<v-card-text v-if="ongoingKPIs.length > 0 || realizedKPIs.length > 0">
											<v-card>
												<v-card-title>
													Ongoing KPIs
												</v-card-title>
												<v-card-text v-if="ongoingKPIs.length > 0 ">
													<template v-for="kpi in ongoingKPIs">
														<v-row :key="kpi.kpiId">
															<v-col md="12">
																<h4 style="text-align: left">
																	{{kpi.text}}
																</h4>
															</v-col>
														</v-row>
													</template>
												</v-card-text>
												<v-card-text v-else>
													<h3 style=" text-align: center;, font-size: 20px;">
														No ongoing KPIs have been set!
													</h3>
												</v-card-text>
											</v-card>
											<v-card>
												<v-card-title>
													Realized KPIs
												</v-card-title>
												<v-card-text v-if="realizedKPIs.length > 0 ">
													<template v-for="kpi in realizedKPIs">
														<v-row :key="kpi.kpiId">
															<v-col md="12">
																<h4 style="text-align: left">
																	{{kpi.text}}
																</h4>
															</v-col>
														</v-row>
													</template>
												</v-card-text>
												<v-card-text v-else>
													<h3 style=" text-align: center;, font-size: 20px;">
														No realized KPIs have been set!
													</h3>
												</v-card-text>
											</v-card>
										</v-card-text>
										<v-card-text v-else>
											<h1 class="pt-2" style=" text-align: center;, font-size: 20px;">
												Oops, it seems like there are no KPIs set by the mentor!
											</h1>
										</v-card-text>
									</v-card>
								</v-card>
							</v-col>
						</v-row>
					</v-card-text>
					<v-spacer></v-spacer>
				</v-card>
			</v-card>
		</v-container>
		<v-container v-else>
			<v-row justify="center">
				<v-col md="auto">
					<v-progress-circular
					:size="500"
					color="primary"
					indeterminate
					></v-progress-circular>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { mapGetters } from "vuex";
import { UI } from "@startupway/main/lib/ui";
import { User } from "@startupway/users/lib/ui";
import { Team, Product, KPI, KPI_TYPE } from "../../common";
interface IFrontPage {
	ui: UI,
	teamId: string,
	role: boolean,
	loadingPage: boolean,
	userMenu:{
		title: string,
		subtitle: string
	},
	realizedKPIs: KPI[],
	ongoingKPIs: KPI[]
}
export default Vue.extend({
	name: "FrontPage",
	data(): IFrontPage {
		return {
			ui:UI.getInstance(),
			teamId: "",
			role:false,
			loadingPage:false,
			userMenu:{
				title:"",
				subtitle:""
			},
			realizedKPIs: [],
			ongoingKPIs: []
		};
	},
	watch: {
		currentTeam: {
			immediate: true,
			async handler (newTeam: Team | null):Promise<void> {
				this.loadingPage = true;
				if (newTeam) {
					let response = await this.ui.api.get<Product | null>("/api/v1/teams/product/" + newTeam.teamId);
					let product:Product | null = response.data;
					if (product) {
						(newTeam as Team&Product).businessTrack = product.businessTrack;
						(newTeam as Team&Product).teamType = product.teamType;
						this.teamId = newTeam.teamId;
						const realizedKPIsData = await this.ui.api.get<KPI[]>(`/api/v1/teams/kpi/${KPI_TYPE.REALIZED}/${this.teamId}`);
						if (realizedKPIsData && realizedKPIsData.data) {
							this.realizedKPIs = realizedKPIsData.data;
						}
						const ongoingKPIData = await this.ui.api.get<KPI[]>(`/api/v1/teams/kpi/${KPI_TYPE.ONGOING}/${this.teamId}`);
						if (ongoingKPIData && ongoingKPIData.data) {
							this.ongoingKPIs = ongoingKPIData.data;
						}
						try {
							await this.ui.storeDispatch("feed/loadFeed", this.teamId);
						} catch (e) {
							console.error(e);
						}
					}
				}
				this.loadingPage = false;
			}
		},
		_token: {
			immediate:true,
			handler (newToken:string):void {
				this.loadingPage = true;
				if (newToken === null){
					if (this.$route.path !== "/login")
						this.$router.push("/login");
				}
				this.loadingPage = false;
			}
		},
		user: {
			immediate: true,
			async handler (newUser: User):Promise<void> {
				this.loadingPage = true;
				if (newUser){
					await this.ui.storeDispatch("teams/loadTeams",newUser.userId);
				}
				this.loadingPage = false;
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