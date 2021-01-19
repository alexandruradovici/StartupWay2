<template>
	<v-app id="app">
		<v-app-bar app dark flat color="primary">
			<v-toolbar-title link contain>
				<a href="/#/workspace"
					><v-img left contain src="img/startupway-white-668px.png" max-height="45" max-width="250"></v-img
				></a>
			</v-toolbar-title>
			<component
				v-for="(toolbarButton, index) in toolbarButtonsLeft"
				:key="'toolbarButtonsLeft' + index"
				:is="toolbarButton.view"
			>
			</component>
			<v-spacer></v-spacer>
			<component
				v-for="(toolbarButton, index) in toolbarButtonsRight"
				:key="'toolbarButtonsRight' + index"
				:is="toolbarButton.view"
			>
			</component>
		</v-app-bar>
		<v-main background-color="#fcfcfc">
			<!-- <v-container fluid pr-7 pl-7 background-color="#fcfcfc">
				<div v-show="role==='User'">
					<v-row no-gutters>
						<v-col cols="12" sm="6" md="4" lg="3" xl="3">
								<v-list nav dense class="nav" color="#fcfcfc">
									<v-list-item class="px-2">
										<v-list-item-avatar>
											<v-img src="img/badge1-1650px.png"></v-img>
										</v-list-item-avatar>

										<v-list-item-content>
											<div v-if="role==='User'">
												<v-list-item-title id="user-title" v-if="currentTeam.teamId !== 0">{{currentTeam.teamName}}</v-list-item-title>
												<v-list-item-title id="user-title" v-else>No team selected</v-list-item-title>
											</div>
										</v-list-item-content>
									</v-list-item>
									<v-divider></v-divider>
									<v-list-item link
									v-for="tab in tabs"
									:key="tab.key"
									@click="changeRoute(tab.link)"
									class="menu-item"
									>
									<v-list-item-icon>
										<v-icon color="#197E81">{{ tab.icon }}</v-icon>
									</v-list-item-icon>

									<v-list-item-content>
										<v-list-item-title class="active-element" style="font-size: 16px; font-weight: 900;">{{ tab.title }}</v-list-item-title>
									</v-list-item-content>
									</v-list-item>
								</v-list>
							</div>
						</v-col>
						<v-col cols="12" sm="6" md="8" lg="9" xl="9">
							<transition fluid pa-0 @after-leave="router=true" @before-appear="router=false" >				
								<div v-show="currentContent">
									<div class="justify-center">
										<v-row justify="center" no-gutters>
											<v-col md="auto">
												<h1 style="font-family: Georgia, serif; text-align: center; text-weight: bold, font-size: 20px; margin-top: 70px;"> Hello {{user.firstName}} {{user.lastName}} and welcome to StartupWay!</h1>
												<h1 v-if="teams.length === 0" style="font-family: Georgia, serif; text-align: center; text-weight: bold, font-size: 20px; margin-top: 20px;">Oops, it seems like you are not enroled in any team, please contact your mentor for more details.</h1>
												<h1 v-else style="font-family: Georgia, serif; text-align: center; text-weight: bold, font-size: 20px; margin-top: 20px;">You are currently enroled in {{ teams.length }} <div v-if="teams.length===1">team.</div> <div v-else>teams.</div></h1>
												<h1 v-if="currentTeam.teamId === 0" style="font-family: Georgia, serif; text-align: center; text-weight: bold, font-size: 20px; margin-top: 20px;">Please select your team from the top right corner.</h1>

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
								</div>
							</transition>
							<transition @after-leave="currentContent=true">
								<div v-if="router">
									<router-view ></router-view>
								</div>
							</transition> 
							
						</v-col>
					</v-row>
				</div>
				<div v-show="role==='Mentor' || role==='Admin' || role==='SuperAdmin'">
					<transition fluid pa-0 @after-leave="router=true" @before-appear="router=false"> 
						<div v-if="currentContent">
							<div class="justify-center">
								 <v-row class="mb-6" justify="center" no-gutters>
									 <v-col>
										 <v-row class="justify-center" align="center">
											 <h1 v-if="role!=='Mentor' && role!=='User'" class="landing-message">Admin View</h1>
											 <h1 v-else class="landing-message">Admin View</h1>
										 </v-row>
										 <v-row>
											 <v-divider></v-divider>
										 </v-row>
									 </v-col>
								</v-row>
								<v-row class="mb-6" justify="center" >
									<v-card class="mx-auto" flat color="#fcfcfc">
										<v-container fluid pl-7 pr-7 v-show="!loadingPage">
										<v-data-table
											item-key="startupName"
											:headers="headers"
											:items="filteredReviews"
											:search="search"
											:expanded.sync="expanded"
											:single-expand="false"
											multi-sort
											show-expand
										>
											<template v-slot:top>
												<v-text-field
													v-model="search"
													append-icon="search"
													label="Search"
													single-line
													hide-details
												></v-text-field>
											</template>
											<template v-slot:header>
												<div>
													<v-divider class="mx-4" inset vertical></v-divider>
													<v-spacer></v-spacer>
													<v-dialog persistent v-model="approveDialog" max-width="600px">
														<v-card>
															<v-form lazy-validation v-model="validDesc">
																<v-card-title class="justify-center" style="font-family: Georgia, serif;">Approve Pending Description</v-card-title>
																<v-divider></v-divider>
																<v-card-text>
																	<div>Startup Name</div>
																	<v-text-field
																		readonly
																		outlined
																		rounded
																		color="primary"
																		:rules="startupRules"
																		v-model="updated.Product_startupName"
																	></v-text-field>
																	<div>Pending English Description</div>
																	<v-textarea
																		outlined
																		rounded
																		color="primary"
																		v-model="updated.Product_pendingDescriptionEN"
																		:rules="rulesDesc"
																		no-resize counter="600"
																	></v-textarea>
																	<div>Pending Romanian Description</div>
																	<v-textarea
																		outlined
																		rounded
																		color="primary"
																		v-model="updated.Product_pendingDescriptionRO"
																		:rules="rulesDesc"
																		no-resize counter="600"
																	></v-textarea>
																</v-card-text>
																<v-card-actions>
																	<v-card-actions class="justify-center">
																		<v-btn :disabled="!validDesc" rounded color="primary" @click="approveDescription()">Approve Descriptions</v-btn>
																		<v-btn color="primary" text @click="exitApproveDialog()">Exit</v-btn>
																	</v-card-actions>
																</v-card-actions>
															</v-form>
														</v-card>
													</v-dialog>
													<v-dialog persistent v-model="dialog" max-width="600px">
														<v-card>
															<v-form lazy-validation v-model="valid">
																<v-card-title class="justify-center" style="font-family: Georgia, serif;">Edit Team Details</v-card-title>
																<v-divider></v-divider>
																<v-card-text style="margin-top: 50px;">
																	<v-text-field 
																		outlined 
																		rounded 
																		color="primary" 
																		prepend-icon="mdi-lightbulb-on-outline" 
																		v-model="team.startupName" 
																		label="Startup Name" 
																		optional
																		:rules="startupRules"
																	></v-text-field>
																	<v-text-field 
																		outlined 
																		rounded 
																		color="primary"
																		prepend-icon="mdi-map-marker-outline" 
																		v-model="team.location" 
																		label="Location" 
																		optional
																	></v-text-field>
																	<v-text-field 
																		outlined 
																		rounded 
																		color="primary" 
																		prepend-icon="mdi-account-tie-outline"
																		v-model="team.mentor" 
																		label="Mentor" 
																		optional
																	></v-text-field>
																	<v-text-field 
																		outlined 
																		rounded 
																		color="primary"
																		prepend-icon="mdi-web" 
																		v-model="team.webLink" 
																		label="Website" 
																		optional
																	></v-text-field>
																	<v-textarea 
																		rounded
																		outlined
																		color="primary"
																		prepend-icon="mdi-script-text-outline"
																		:rules="rulesDesc"
																		v-model="team.description" 
																		label="Description" 
																		optional
																	></v-textarea>
																	<v-select 
																		v-model="team.teamTrack" 
																		label="Team Track" 
																		optional 
																		:items="teamTypes"
																		prepend-icon="mdi-briefcase-search-outline"
																		color="primary"
																	></v-select>
																	<v-select 
																		v-model="team.businessTrack" 
																		label="Business Track" 
																		:items="businessTracks" 
																		optional
																		prepend-icon="mdi-domain"
																		color="primary"
																	></v-select>
																	<v-text-field 
																		outlined
																		rounded
																		color="primary"
																		prepend-icon="mdi-calendar-month-outline"
																		v-model="team.workshopNr" 
																		label="Workshop Nr." 
																		optional></v-text-field>
																	<v-textarea 
																		rounded
																		outlined
																		color="primary"
																		prepend-icon="mdi-note-text-outline"
																		v-if="user.role['Mentor']" 
																		v-model="team.mentorNotes" 
																		label="Mentor Notes" 
																		optional
																	></v-textarea>
																	<v-textarea 
																		rounded
																		outlined
																		color="primary"
																		prepend-icon="mdi-note-text-outline"
																		v-if="user.role['Admin']" 
																		v-model="team.adminNotes" 
																		label="Admin Notes" 
																		optional
																	></v-textarea>
																	<v-select 
																		color="primary"
																		prepend-icon="mdi-clipboard-check-outline"
																		:items="values" 
																		label="Assessment 20 May" 
																		v-model="team.assessment20May">
																	</v-select>
																	<v-select
																		color="primary"
																		prepend-icon="mdi-clipboard-check-outline"
																		:items="values" 
																		label="Assessment 12 Oct" 
																		v-model="team.assessment12Oct">
																	</v-select>
																</v-card-text>
																<v-card-actions class="justify-center">
																	<v-btn :disabled="!valid" rounded color="primary" @click="changeData()">Apply</v-btn>
																	<v-btn color="primary" text @click="exitDialog()">Exit</v-btn>
																</v-card-actions>
															</v-form>
														</v-card>
													</v-dialog>
												</div>
											</template>
											<template v-slot:item.actions="{ item }">
												<v-icon small @click="openDialog(item)">
													mdi-pencil mdi-24px
												</v-icon>
											</template>
											<template v-slot:item.updated="{ item }">
												<v-icon small :color="updateColor(item)" :disabled="disabledIcon(item)" @click="openForApprove(item)">
													mdi-chat-processing mdi-24px
												</v-icon>
											</template>
											
											<template v-slot:expanded-item="{ headers, item }">
												<td :colspan="headers.length">
												<v-card flat outlined>
													<v-card-title style="font-family: Georgia, serif; font-size: 18px; font-weight: 600;">
														Team Description
													</v-card-title>
													<v-card-text style="font-family: Georgia; font-size: 16px;">
														{{allDescriptions[item.teamId]}}
													</v-card-text>
													<v-card-actions class="justify-center">
														<v-btn :disabled="item.webLink.trim() === ''" @click="openLink(item)">Visit Website</v-btn>
														 <v-btn @click="goToTeam(item)">
															Team Details
														</v-btn> 
														<v-btn rounded color="primary" @click="selectTeam(item)">Edit Team</v-btn>
														<v-btn rounded color="primary" @click="editProduct(item)">Edit Product</v-btn>
														<v-btn rounded color="primary" @click="teamActivity(item)">Team Activity</v-btn>
														<v-btn rounded color="primary" @click="productNewUpdates(item)">Product Updates</v-btn>
														<v-btn rounded color="primary" @click="openCanvas(item)">Canvas</v-btn>
													</v-card-actions>
												</v-card>
												</td>
											</template>
										</v-data-table>
										<v-divider style="margin-top: 30px; margin-bottom: 30px;"></v-divider>
										<v-row class="mb-6" justify="center" no-gutters>
											<v-col md="auto" style="font-family: Georgia, serif; font-size: 18px; font-weight: bold;">
												Table Filters
											</v-col>
										</v-row>
										<v-row class="mb-6" justify="center" no-gutters>
											<v-col md="auto">
												<v-select v-model="teamTypeFilter" :items="teamTypes" label="Team Track">
													<template v-slot:prepend>
														<v-btn v-if="teamTypeFilter.trim() !== ''" icon @click="teamTypeFilter = ''"><v-icon>mdi-close</v-icon></v-btn>
													</template>
												</v-select>
											</v-col>
											<v-col md="auto">
												<v-select v-model="businessTracksFilter" :items="businessTracks" label="Business Track">
													<template v-slot:prepend>
														<v-btn v-if="businessTracksFilter.trim() !== ''" icon @click="businessTracksFilter = ''"><v-icon>mdi-close</v-icon></v-btn>
													</template>
												</v-select>
											</v-col>
											<v-col md="auto">
												<v-select v-model="may20Filter" :items="values" label="Assesment 20 May">
													<template v-slot:prepend>
														<v-btn v-if="may20Filter.trim() !== ''" icon @click="may20Filter = ''"><v-icon>mdi-close</v-icon></v-btn>
													</template>
												</v-select>
											</v-col>
											<v-col md="auto">
												<v-select v-model="oct12Filter" :items="values" label="Assesment 12 Oct">
													<template v-slot:prepend>
														<v-btn v-if="oct12Filter.trim() !== ''" icon @click="oct12Filter = ''"><v-icon>mdi-close</v-icon></v-btn>
													</template>
												</v-select>
											</v-col>
											<v-col md="auto">
												<v-select v-model="locationFilter" :items="locations" label="Location">
													<template v-slot:prepend>
														<v-btn v-if="locationFilter.trim() !== ''" icon @click="locationFilter = ''"><v-icon>mdi-close</v-icon></v-btn>
													</template>
												</v-select>
											</v-col>
											<v-col md="auto">
												<v-select v-model="workshopFilter" :items="workshopDays" label="Workshop">
													<template v-slot:prepend>
														<v-btn v-if="workshopFilter.trim() !== ''" icon @click="workshopFilter = ''"><v-icon>mdi-close</v-icon></v-btn>
													</template>
												</v-select>
											</v-col>
											<v-col md="auto">
												<v-btn outlined rounded color="primary" @click="clearFilters()">Clear Filters</v-btn>
											</v-col>
										</v-row>
									</v-container>
									</v-card>
								</v-row>
							</div>
						</div>
					</transition> 
					<transition @after-leave="currentContent=true">-->
						<!-- <div v-if="router"> -->
							<router-view ></router-view>
						<!-- </div> -->
				<!-- 	</transition> 
				</div>
				 
			</v-container>
			 -->
		</v-main>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { mapGetters } from "vuex";
import { UI } from "@startupway/main/lib/ui";
import { NO_TOKEN,User } from "@startupway/users/lib/ui";
import { ToolbarButton, ToolbarButtonPosition } from "../../common/common";
// import { Team, Product, BusinessTrack, WorkshopDay, TeamType, Feed, FeedText, FeedTypes } from "../../feed/ui/ui_types";
export default Vue.extend({
	name: "Workspace",
	components: {},
	async mounted() {
		try {
			this.ui = UI.getInstance();
			// await this.ui.storeDispatch("feed/loadFeed", this.teamId);
		} catch (e) {
			console.error(e);
		}
		// let _varToString = (varObj: Object): string => Object.keys(varObj)[0];
		// let name = _varToString({ BusinessTrack });
		// this._enumToData(BusinessTrack, name);
		// name = _varToString({ TeamType });
		// this._enumToData(TeamType, name);
		// name = _varToString({ WorkshopDay });
		// this._enumToData(WorkshopDay, name);
		try {
			// await this.ui.storeDispatch("teams/loadProduct", this.teamId);
		} catch (e) {
			console.error(e);
		}
	},
	data() {
		return {
			ui:{} as UI,
			allTeams: [] as any[],
			startupRules: [
				(value: string) => {
					if(value && value.length > 0) 
						return true;
					else
						return "Team needs a name";
				},
			],
			rulesDesc: [
				(value:string) => !value || value.length <= 600 || 'Description must have at most 600 characters',
			],
			valid:true,
			validDesc:true,
			// productUpdates: [] as Feed[],
			newFeedUpdate: 0 as number,
			// FeedTypes: FeedTypes,
			// items: [
			// 	{
			// 		name: "Investments",
			// 		value: FeedTypes.INVESTMENT
			// 	},
			// 	{
			// 		name: "Awards",
			// 		value: FeedTypes.AWARD
			// 	},
			// 	{
			// 		name: "Current Status",
			// 		value: FeedTypes.UPDATE
			// 	},
			// 	{
			// 		name: "Collaborations",
			// 		value: FeedTypes.COLLABORATORS
			// 	}
			// ],
			teamId: 0 as Number,
			role:"" as string,
			menuName:{
				title:"",
			},
			router:false,
			show:true,
			currentContent:true,
			currentRoute:"" as string,
			mentoredTeams:[] as any[],
			// selectedMentoredTeam: {} as Team,
			id:0 as number,
			tabs: [] as any,
			editElement: true,
			dialog: false,
			team: {
				workshopNr:"",
				mentor:"",
				teamTrack:"",
				businessTrack:"",
				startupName:"",
				description:"",
				webLink:"",
				mentorNotes:"",
				adminNotes:"",
				assesment20May:"",
				assesment12Oct:""
			},
			values:[
				"Yes",
				"Maybe",
				"No"
			],
			teamTypes: [
				"Spin-off",
				"Start-up",
				"Scale-up"
			],
			businessTracks: [
				"Agriculture",
				"CyberSecurity",
				"FinTech",
				"Health&Lifestyle",
				"Retail",
				"SmartCity",
				"SmartMobility",
				"Other"
			],
			workshopDays: [],
			locations:[
				"Bucharest",
				"Cluj",
				"Iasi",
				"Sibiu",
				"Timisoara"
			],
			reviews: [],
			type: "",
			loadingPage:false,
			loading:false,
			oct12Filter:"" as string,
			may20Filter:"" as string,
			businessTracksFilter:"" as string,
			teamTypeFilter:"" as string,
			locationFilter:"" as string,
			workshopFilter:"" as string,
			expanded: [],
			singleSelect: false,
			search:"",
			headers: [
				{
					text: "Location",
					align: "left",
					sortable: true,
					value: "location"
				},
				{ text: "Workshop Nr.", value: "workshopNr" },
				{ text: "Mentor", value: "mentor" },
				{ text: "Team Track", value: "teamTrack" },
				{ text: "Business Track", value: "businessTrack" },
				{ text: "Startup Name", value: "startupName" },
				{ text: "Web Page Link", value: "webLink"},
				{ text: "Assesment 20 May", value:"assessment20May"},
				{ text: "Assesment 12 Oct", value:"assessment12Oct"},
				{ text: "Actions", value: "actions", sortable: false },
				{ text: "Updated Description", value: "updated", sortable: false },
				{ text: "Last Team Update", value: "updatedAt", sortable: false},
				{ text: "Last Mentor Update", value: "lastMentorUpdate", sortable: false}
			],
			existsUpdate: false,
			approveDescriptions: [] as any,
			updated: {
				Product_businessTrack: "",
				Product_descriptionEN: "",
				Product_descriptionRO: "",
				Product_mentorId: 0,
				Product_pendingDescriptionEN: "",
				Product_pendingDescriptionRO: "",
				Product_productDetails: {},
				Product_productId: 0,
				Product_startupName: "",
				Product_teamType: "",
				Product_workshopDay: "",
				Product_updatedAt: new Date(),
				Product_lastMentorUpdate: new Date(),
				Team_location: "",
				Team_productId: 0,
				Team_teamDetails: {},
				Team_teamId: 0,
				Team_teamName: "",
				Team_year: 0
			},
			approveDialog: false,
			selectedTeam: 0,
			allDescriptions: {} as any
		};
	},
	created() {},
	filters: {
		moment(date: Date) {
			return moment(date).format("MMMM Do YYYY, h:mm:ss a");
		}
	},
	watch: {
		// mentoredTeam: {
		// 	immediate:true,
		// 	async handler(newTeam:number) {
		// 		if(this.mentoredTeams.length > 0){
		// 			(this.selectedMentoredTeam as any) = this.mentoredTeams.find( team => {
		// 				return team.teamId == newTeam;
		// 			});
		// 			this.id = newTeam;
		// 		}
		// 	}
		// },
		// selectedMentoredTeam: {
		// 	immediate:true,
		// 	async handler(newTeam:Team) {
		// 		if(newTeam !== undefined && newTeam.teamId !== undefined) {
		// 			let response = await this.ui.application.api.get("/api/v1/product/" + newTeam.teamId);
		// 			let product:Product = response.data;
		// 			(newTeam as any).businessTrack = product.businessTrack;
		// 			(newTeam as any).teamType = product.teamType;
		// 		}
		// 	}
		// },
		async $route (to, from){
			if(to.path == "/workspace") {
				this.router=false;
			} else if(to.path == "/login") {
				this.tabs=[];
			} else {
				this.currentContent = false;
			}
			this.currentRoute=to.name;
			// if (this.role === "Mentor") {
			// 	let response = await this.ui.api.get("/api/v1/mentor/teamsAndProduct/" + this.user.userId);
			// 	if (response) {
			// 		this.mentoredTeams = this.modifyTeams(response.data);
					
			// 	}
			// } else if (this.role === "Admin" || this.role === "SuperAdmin") {
			// 	let response = await this.ui.api.get("/api/v1/admin/teams/" + this.user.userDetails["location"]);
			// 	if (response) {
			// 		this.mentoredTeams = this.modifyTeams(response.data);
			// 	}
			// }
    	},
		_token: {
			immediate:true,
			handler (newToken:string) {
				if(newToken === NO_TOKEN){
					if(this.$route.path !== "/login")
						this.$router.push("/login");
				} else {
					if(this.$route.path !== "/workspace")
						this.$router.push("/workspace");
				}
			}
		},
		user: {
			immediate: true,
			async handler (newUser: User) {
		// 		if(newUser.userId !== 0) {
		// 			if(newUser.role["Mentor"]) {
		// 				this.type="mentor";
		// 			} else if(newUser.role["Admin"]) {
		// 				this.type="admin";
		// 			} else if(newUser.role["SuperAdmin"]) {
		// 				this.type="superAdmin";
		// 			} else {
		// 				this.loading = false;
		// 				this.loadingPage = false;
		// 			}
		// 			if(newUser.role["Mentor"] !== undefined || newUser.role["Admin"] !== undefined || newUser.role["SuperAdmin"] !== undefined) {
		// 				if(this.tabs.length > 0) {
		// 					this.tabs = [];
		// 				}
		// 				if (newUser.role["Admin"] || newUser.role["SuperAdmin"]) {
		// 					if(newUser.role["Admin"])
		// 						this.role="Admin";
		// 					else
		// 						this.role="SuperAdmin";
		// 					let response = await this.ui.api.get("/api/v1/admin/teams/"+newUser.userDetails["location"]);
		// 					if (response) {
		// 						this.mentoredTeams = this.modifyTeams(response.data);
		// 						for(let team in this.mentoredTeams) {
		// 							let id = this.mentoredTeams[team].teamId;
		// 							this.mentoredTeams[team].description = response.data[team].Product_descriptionEN;
		// 							this.mentoredTeams[team].mentor = JSON.parse(this.mentoredTeams[team].teamDetails).mentor;
		// 						}
		// 					}
							
		// 				} else if(newUser.role["Mentor"]) {
		// 					this.role="Mentor";
		// 					let response = await this.ui.api.get("/api/v1/mentor/teamsAndProduct/" + newUser.userId);
		// 					if (response) {
								
		// 						this.mentoredTeams = this.modifyTeams(response.data);
		// 						for(let team in this.mentoredTeams) {
		// 							this.mentoredTeams[team].teamId;
		// 							this.mentoredTeams[team].description = response.data[team].Product_descriptionEN;
		// 						}
		// 					}
		// 				}
		// 				this.pushToTabs({
		// 					key:this.tabs.length,
		// 					title:"Workshops",
		// 					icon:"mdi-briefcase",
		// 					link:"/workshop"
		// 				});
		// 				this.pushToTabs({
		// 					key:this.tabs.length,
		// 					title:"Review Teams",
		// 					icon:"mdi-account-search",
		// 					link:"/teams/review"
		// 				});
		// 				this.pushToTabs({
		// 					key:this.tabs.length,
		// 					title:"Team Composition",
		// 					icon:"mdi-account-group",
		// 					link:"/viewTeam/composition"
		// 				});
		// 				this.pushToTabs({
		// 					key:this.tabs.length,
		// 					title:"Product Details",
		// 					icon:"mdi-chart-bar",
		// 					link:"/viewTeam/product"
		// 				});
		// 				this.pushToTabs({
		// 					key:this.tabs.length,
		// 					title:"User Activities",
		// 					icon:"mdi-calendar",
		// 					link:"/viewTeam/activities"
		// 				});
		// 				this.pushToTabs({
		// 					key:this.tabs.length,
		// 					title:"Product Feed",
		// 					icon:"mdi-cog-clockwise",
		// 					link:"/viewTeam/updates"
		// 				});
		// 				this.pushToTabs({
		// 					key:this.tabs.length,
		// 					title:"Business Canvas",
		// 					icon:"mdi-clipboard-text-multiple",
		// 					link:"/viewTeam/canvas"
		// 				});
		// 				this.menuName.title = "Mentor Menu";
		// 			} else if(newUser.userId !== 0) {
		// 				this.tabs = [];
		// 				this.role="User";
		// 				await this.ui.application.storeDispatch("teams/loadTeams",newUser.userId);
		// 				this.pushToTabs({
		// 					key:this.tabs.length,
		// 					title:"View Team",
		// 					icon:"mdi-account-supervisor",
		// 					link:"/team"
		// 				});
		// 				this.pushToTabs({
		// 					key:this.tabs.length,
		// 					title:"Weekly Updates",
		// 					icon:"mdi-calendar-edit",
		// 					link:"/team/updates"
		// 				});
		// 				this.pushToTabs({
		// 					key:this.tabs.length,
		// 					title:"Business Canvas",
		// 					icon:"mdi-clipboard-text-multiple",
		// 					link:"/product/canvas"
		// 				});
		// 				this.pushToTabs({
		// 					key:this.tabs.length,
		// 					title:"Summary",
		// 					icon:"mdi-chart-bar",
		// 					link:"/product/summary"
		// 				});
		// 				this.pushToTabs({
		// 					key:this.tabs.length,
		// 					title:"Feed",
		// 					icon:"mdi-cog-clockwise",
		// 					link:"/product/feed"
		// 				});
						
		// 				this.menuName.title = "User Menu";
		// 			}
		// 			try {
		// 				let id = newUser.userId;
		// 				let location = newUser.userDetails.location;
		// 				let response = await this.ui.api.post("/api/v1/admin/teams/review", {
		// 					type:this.type,
		// 					id:id,
		// 					location:location
		// 				});
		// 				this.reviews = response.data;

		// 			} catch (e) {
		// 				console.error(e);
		// 			}
		// 			this.loading = false;
		// 			this.loadingPage = false;
					
		// 		}
			}
		},
		// mentoredTeams: {
		// 	immediate: true,
		// 	async handler (newTeams: any[]) {
		// 		if (this.role==="Mentor") {
		// 			for(let team of newTeams) {
		// 				let response = await this.ui.api.get("/api/v1/product/" + team.teamId);
		// 				let product:Product = response.data;
		// 				(team as any).businessTrack = product.businessTrack;
		// 				(team as any).teamType = product.teamType;
		// 			}
		// 		}
		// 	},
		// },
		// currentTeam: {
		// 	immediate: true,
		// 	async handler (newTeam: Team) {
		// 		let response = await this.ui.application.api.get("/api/v1/product/" + newTeam.teamId);
		// 		let product:Product = response.data;
		// 		(newTeam as any).businessTrack = product.businessTrack;
		// 		(newTeam as any).teamType = product.teamType;
		// 		this.teamId = newTeam.teamId;
		// 		if (this.teamId === 0) {
		// 			if(this.$route.path !== "/workspace")
		// 				this.$router.push("/workspace");
		// 			this.productUpdates = [] as Feed[];
		// 		} else {
		// 			try {
		// 				await this.ui.application.storeDispatch("feed/loadFeed", this.teamId);
		// 			} catch (e) {
		// 				console.error(e);
		// 			}
		// 		}
		// 	}
		// },
		// feed: {
		// 	immediate: true,
		// 	handler(newFeed: Feed[]) {
		// 		this.productUpdates = newFeed;
		// 	}
		// }
	},
	computed: {
		...mapGetters({
			toolbarButtons: "workspace/toolbarButtons",
			_token: "users/token",
			user: "users/user"
			// currentTeam: "teams/currentTeam",
			// mentoredTeam: "teams/mentoredTeam",
			// _teams: "teams/teams",
			// feed: "feed/feed"
		}),
		// teams (): Team[] {
		// 	return this._teams as Team[];
		// },
		// filteredReviews():any[] {
		// 	let filteredRev:any[] = [];
		// 	if(this.reviews.length > 0) {
		// 	filteredRev = this.reviews.filter((review:any) => {
		// 		return ((review as any).teamTrack as string).includes(this.teamTypeFilter) &&
		// 			((review as any).businessTrack as string).includes(this.businessTracksFilter) &&
		// 			((review as any).assessment20May as string).includes(this.may20Filter) &&
		// 			((review as any).location as string).includes(this.locationFilter) &&
		// 			((review as any).workshopNr as string).includes(this.workshopFilter) &&
		// 			((review as any).assessment12Oct as string).includes(this.oct12Filter);
		// 	}
				 
		// 	)
		// 	}
		// 	return filteredRev;
		// },
		toolbarButtonsRight(): ToolbarButton[] {
			return this["toolbarButtons"]
				.filter((toolbarButton: ToolbarButton) => toolbarButton.position === ToolbarButtonPosition.RIGHT)
				.sort(
					(toolbarButton1: ToolbarButton, toolbarButton2: ToolbarButton) =>
						toolbarButton1.priority - toolbarButton2.priority
				);
		},
		toolbarButtonsLeft(): ToolbarButton[] {
			return this["toolbarButtons"]
				.filter((toolbarButton: ToolbarButton) => toolbarButton.position === ToolbarButtonPosition.LEFT)
				.sort(
					(toolbarButton1: ToolbarButton, toolbarButton2: ToolbarButton) =>
						toolbarButton1.priority - toolbarButton2.priority
				);
		}
	},
	methods: {
		moment() {
			return moment();
		},
		formatDate(date: Date) {
			let time  = (new Date(date)).toTimeString().split(" ");
			if(new Date(date).toString() === "Invalid Date")
				return "";
			else 
			return (new Date(date)).toDateString() + " " + time[0];
		},
		openDialog(item: any) {
			this.dialog = true;
			this.team = item;
		},
		openForApprove(item: any) {
			let toApprove = this.approveDescriptions.find((el : any) => el.Team_teamId === item.teamId);
			this.approveDialog = true;
			this.updated = toApprove;
			this.selectedTeam = item.teamId;
		},
		updateColor(item: any) {
			let found = this.approveDescriptions.find((element: any) => element.Team_teamId === item.teamId)
			if(found)
				return "red";
			return "green";
		},
		disabledIcon(item: any) {
			let found = this.approveDescriptions.find((element: any) => element.Team_teamId === item.teamId)
			if(found !== undefined)
				return false;
			return true;
		},
		_enumToData(enumData: any, name: string) {
			name = name.replace(/^\w/, c => c.toLowerCase()) + "s";
			for (let propName in enumData) {
				if (propName !== "NONE") ((this as any)[name] as Array<Object>).push(enumData[propName]);
			}
		},
		clearFilters(){
			this.oct12Filter = "";
			this.may20Filter = "";
			this.teamTypeFilter = "";
			this.businessTracksFilter = "";
			this.workshopFilter = "";
			this.locationFilter = "";
		},
		debug(item:any) {
		},
		openLink(item:any) {
			let webLink:string = item.webLink;
			if(!webLink.includes("http://")) {
				webLink = "http://" + webLink;
			}
			window.open(webLink, "_blank");
		},
		async goToTeam(item:any) {
			let teamId = item.teamId;
			const path = "/viewTeam/product/"
			if(this.$route.path !== path)
				this.$router.push(path + teamId);
			await this.$store.dispatch("teams/mentorTeam",teamId);
		},
		async changeData() {
			if(this.team.startupName != "") {
				// this.loading = true;
				// this.loadingPage = true;
				let productIndex = this.reviews.findIndex((el: any) => el.startupName === this.team.startupName);
				(this.reviews[productIndex] as any).lastMentorUpdate = (this.formatDate(new Date()) as unknown as Date);
				let response = await this.ui.api.post("/api/v1/admin/teams/review/update", 
				{
					reviews:this.reviews,
					type:this.type
				});
				if(response) {
					this.reviews = response.data;
					
					let productToUpdate = this.allTeams.findIndex((el: any) => el.startupName === (this.allTeams[productIndex] as any).startupName);
					if(productToUpdate !== undefined) {
						try {
							let product = await this.ui.api.get("/api/v1/product/" + this.allTeams[productToUpdate].Team_teamId);
							if(product.data) {
								product.data.lastMentorUpdate = (this.formatDate(new Date()) as unknown as Date) ;
								try {
									await this.ui.api.post("/api/v1/product/update", {
										product: product.data,
										upload: "",
										ext: ".pptx",
										teamId: this.allTeams[productToUpdate].Team_teamId
									});
								} catch (e) {
									console.error(e);
								}
								try {
									await this.ui.storeDispatch("teams/updateProduct", {
										product: product.data,
										teamId: this.allTeams[productToUpdate].Team_teamId
									});
								} catch (e) {
									console.error(e);
								}
							}
						} catch (e) {
							console.error(e);
						}
					// 	let Product = {
					// 		productId: this.allTeams[productToUpdate].Team_productId,
					// 		mentorId: this.allTeams[productToUpdate].Product_mentorId,
					// 		startupName: this.allTeams[productToUpdate].Product_startupName,
					// 		businessTrack: this.allTeams[productToUpdate].Product_businessTrack,
					// 		teamType: this.allTeams[productToUpdate].Product_teamType,
					// 		workshopDay: this.allTeams[productToUpdate].Product_workshopDay,
					// 		descriptionRO: this.allTeams[productToUpdate].Product_descriptionRO,
					// 		descriptionEN: this.allTeams[productToUpdate].Product_descriptionRO,
					// 		pendingDescriptionEN: this.allTeams[productToUpdate].Product_pendingDescriptionEN,
					// 		pendingDescriptionRO: this.allTeams[productToUpdate].Product_PendingDescriptionRO,
					// 		productDetails: this.allTeams[productToUpdate].Product_productDetails,
					// 		lastMentorUpdate: (this.formatDate(new Date()) as unknown as Date)
					// 	} as Product;
					// try {
					// 	await this.ui.application.storeDispatch("teams/updateProduct", {
					// 		product: Product,
					// 		teamId: this.allTeams[productToUpdate].Team_teamId
					// 	});
					// } catch (e) {
					// 	console.error(e);
					// }
					}
				}

				this.dialog = false;
				this.$forceUpdate();
				// this.loadingPage = false;
				// this.loading = false;
			}
		},
		editTeam(team: any) {
			this.team = team;
			this.dialog = true;
		},
		exitDialog() {
			(this.team as any) = {
				postpone:""
			}
			this.dialog = false;
			
		},
		exitApproveDialog() {
			(this.updated as any) = {
				postpone:""
			}
			this.approveDialog = false;
			
		},
		async approveDescription() {
			try {
				let response = await this.ui.api.post("/api/v1/product/approve/description", {
					product: {
						productId: this.updated.Product_productId,
						startupName: this.updated.Product_startupName,
						businessTrack: this.updated.Product_businessTrack,
						teamType: this.updated.Product_teamType,
						workshopDay: this.updated.Product_workshopDay,
						mentorId: this.updated.Product_mentorId,
						descriptionRO: this.updated.Product_pendingDescriptionRO,
						descriptionEN: this.updated.Product_pendingDescriptionEN,
						pendingDescriptionRO: "",
						pendingDescriptionEN: "",
						productDetails: this.updated.Product_productDetails,
						lastMentorUpdate: (this.formatDate(new Date()) as unknown as Date)
						// updatedAt: this.updated.Product_updatedAt
					}
				})
				if(response) {
					
					let res = await this.ui.api.get("/api/v1/product/" + this.selectedTeam);
						if(res) {
							let product = response.data;
							this.updated.Product_productId = product.productId;
							this.updated.Product_startupName = product.startupName;
							this.updated.Product_businessTrack = product.businessTrack;
							this.updated.Product_teamType = product.teamType;
							this.updated.Product_workshopDay = product.workshopDay;
							this.updated.Product_mentorId = product.mentorId;
							this.updated.Product_descriptionRO = product.descriptionRO;
							this.updated.Product_descriptionEN = product.descriptionEN;
							this.updated.Product_pendingDescriptionRO = product.pendingDescriptionRO;
							this.updated.Product_pendingDescriptionEN = product.pendingDescriptionEN;
							this.updated.Product_productDetails = product.productDetails;
							this.updated.Product_lastMentorUpdate = product.Product_lastMentorUpdate;
							// let found = this.filteredReviews.findIndex((el: any) => el.teamId === this.updated.Team_teamId);
							// this.filteredReviews[found] = this.updated;
							let found2 = this.approveDescriptions.findIndex((el: any) => el.teamId === this.updated.Team_teamId);
							this.approveDescriptions.splice(found2, 1);
							this.disabledIcon({});
							this.allDescriptions[product.productId] = product.descriptionEN;
							// this.description = product.descriptionEN;

							let productIndex = this.reviews.findIndex((el: any) => el.teamId === this.updated.Team_teamId);
							(this.reviews[productIndex] as any).lastMentorUpdate = (this.formatDate(new Date()) as unknown as Date);
						}
					this.$forceUpdate();
				}
			} catch (e) {
				console.error(e);
			}
			this.approveDialog = false;
		},
		// async selectTeam(team:Team) {
		// 	this.id = team.teamId;
		// 	await this.$store.dispatch("teams/mentorTeam", team.teamId);
		// 	this.changeRoute("/viewTeam/composition")
		// },
		// async editProduct(team:Team) {
		// 	this.id = team.teamId;
		// 	await this.$store.dispatch("teams/mentorTeam", team.teamId);
		// 	this.changeRoute("/viewTeam/product")
		// },
		// async teamActivity(team:Team) {
		// 	this.id = team.teamId;
		// 	await this.$store.dispatch("teams/mentorTeam", team.teamId);
		// 	this.changeRoute("/viewTeam/activities")
		// },
		// async productNewUpdates(team:Team) {
		// 	this.id = team.teamId;
		// 	await this.$store.dispatch("teams/mentorTeam", team.teamId);
		// 	this.changeRoute("/viewTeam/feed")
		// },
		// async openCanvas(team:Team) {
		// 	this.id = team.teamId;
		// 	await this.$store.dispatch("teams/mentorTeam", team.teamId);
		// 	this.changeRoute("/viewTeam/canvas")
		// },
		modifyTeams(newTeams:any[]) {
			let newArray=[];
			for(let team of newTeams) {
				team.Product_updatedAt = this.formatDate(team.Product_updatedAt);
				team.Product_lastMentorUpdate = this.formatDate(team.Product_lastMentorUpdate);
				team.Product_productDetails = JSON.parse(team.Product_productDetails);
				this.allTeams.push(team);
				if(team.Product_pendingDescriptionEN !== "" || team.Product_pendingDescriptionRO !=="") {
					this.existsUpdate = true;
					this.approveDescriptions.push(team);
				};
				this.allDescriptions[team.Team_teamId] = team.Product_descriptionEN;
				let newTeam = {
					teamId:team.Team_teamId,
					productId:team.Team_productId,
					year:team.Team_year,
					location:team.Team_location,
					teamName:team.Team_teamName,
					teamDetails:team.Team_teamDetails,
					businessTrack:team.Product_businessTrack,
					teamType:team.Product_teamType,
					pendingDescriptionRO: team.Product_pendingDescriptionRO,
					pendingDescriptionEN: team.Product_pendingDescriptionEN,
					updatedAt: team.Product_updatedAt,
					lastMentorUpdate: team.Product_lastMentorUpdate
				}
				newArray.push(newTeam);
			}
			let found = this.allTeams.findIndex((el: any) => el.Product_startupName === "");
			this.allTeams.splice(found, 1);
			this.allTeams = this.allTeams.sort(function(a, b) {
				var nameA = a.Product_startupName.toUpperCase();
				var nameB = b.Product_startupName.toUpperCase();
				if (nameA < nameB) {return -1;}
				if (nameA > nameB) {return 1;}
				return 0;
			});
			return newArray
		},
		pushToTabs(tab:any) {
			if(this.tabs.find((item:any) => {
				return item.link === tab.link
			}) === undefined) {
				this.tabs.push(tab);
			}
		},
		checkRoute() {
			if(this.$router.currentRoute.path === "/workspace")
				return true;
			else
				return false;
		},
		pushBack() {
			this.$router.go(-1);
		},
		// changeRoute(link:string) {
		// 	if((this.role==="Mentor" || this.role==="Admin" || this.role ==="SuperAdmin") && this.selectedMentoredTeam.teamId !== 0 && link.split("/")[1] === "viewTeam") {
		// 		if(this.$route.path !== link + "/" + this.selectedMentoredTeam.teamId)
		// 			this.$router.push(link + "/" + this.selectedMentoredTeam.teamId);
		// 	}
		// 	else {
		// 		if(this.$route.path !== link)
		// 			this.$router.push(link);
		// 	}
		// }
	}
});
</script>
<style lang="less">
</style>