<template>
	<v-app>
		<v-container background-color="#fcfcfc">
			<div class="justify-center">
				<v-row class="mb-6" justify="center" no-gutters>
					<v-row class="justify-center" align="center">
						<v-col class="d-flex align-start flex-column">
							<h1 v-if="role!=='Mentor' && role!=='User'" class="landing-message">Admin View</h1>
							<h1 v-else class="landing-message">Mentor View</h1>
						</v-col>
						<v-col class="d-flex align-end flex-column">
							<v-tooltip bottom>
								<template v-slot:activator="{on, attrs}">
									<v-btn v-on="on" v-bind="attrs" @click="changeRoute('/assessment')" fab medium right color="#197E81">
										<v-icon color="#fcfcfc">mdi-chart-box-outline</v-icon>
									</v-btn>
								</template>
								<span>Check Assessments</span>
							</v-tooltip>
						</v-col>
					</v-row>
				</v-row>
				<v-row class="mb-6" justify="center" >
					<v-card class="mx-auto" flat color="#fcfcfc">
						<v-data-table
							item-key="startupName"
							class="elevation-2"
							:headers="headers"
							:items="filteredReviews"
							:search="search"
							:single-expand="false"
							:itemsPerPage="-1"
							show-expand
							multi-sort
							:sort-by.sync="sortBy"
							:sort-desc.sync="sortDesc"
							:expanded.sync="expanded"
							:loading="filteredReviews.length <= 0"
							loading-text="Loading teams"
						>
							<template v-slot:top>
								<v-text-field
									v-model="search"
									append-icon="mdi-magnify"
									label="Search"
									single-line
									hide-details
								></v-text-field>
							</template>
							<template v-slot:header>
								<div>
									<v-divider class="mx-4" inset vertical></v-divider>
									<v-spacer></v-spacer>
									<v-dialog persistent v-model="approveDialog" v-if="updated" max-width="600px">
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
														v-model="updated.startupName"
													></v-text-field>
													<div>Pending English Description</div>
													<v-textarea
														outlined
														rounded
														color="primary"
														v-model="updated.pendingDescriptionEN"
														:rules="rulesDesc"
														no-resize counter="600"
													></v-textarea>
													<div>Pending Romanian Description</div>
													<v-textarea
														outlined
														rounded
														color="primary"
														v-model="updated.pendingDescriptionRO"
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
									<v-dialog persistent v-model="dialog" v-if="team" max-width="600px">
										<v-card>
											<v-form lazy-validation v-model="valid" v-if="team">
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
														v-if="user.role === 'Mentor'" 
														v-model="team.mentorNotes" 
														label="Mentor Notes" 
														optional
													></v-textarea>
													<v-textarea 
														rounded
														outlined
														color="primary"
														prepend-icon="mdi-note-text-outline"
														v-if="user.role === 'Admin'" 
														v-model="team.adminNotes" 
														label="Admin Notes" 
														optional
													></v-textarea>
													<v-select 
														color="primary"
														prepend-icon="mdi-clipboard-check-outline"
														:items="values"
														item-text="text"
														item-value="value"
														label="Assessment Finals" 
														v-model="team.assessment20May">
													</v-select>
													<v-select
														color="primary"
														prepend-icon="mdi-clipboard-check-outline"
														:items="values"
														item-text="text"
														item-value="value"
														label="Assessment SemiFinals" 
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
							<template v-slot:[`item.actions`]="{ item }">
								<v-icon small @click="openDialog(item)">
									mdi-pencil mdi-24px
								</v-icon>
							</template>
							<template v-slot:[`item.updated`]="{ item }">
								<v-icon small :color="updateColor(item)" :disabled="disabledIcon(item)" @click="openForApprove(item)">
									mdi-chat-processing mdi-24px
								</v-icon>
							</template>
							
							<template v-slot:[`item.assessment12Oct`]="{ item }">
								<v-simple-checkbox
								v-model="item.assessment12Oct"
								disabled
								></v-simple-checkbox>
							</template>
							<template v-slot:[`item.assessment20May`]="{ item }">
								<v-simple-checkbox
								v-model="item.assessment20May"
								disabled
								></v-simple-checkbox>
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
										<!-- {{item.webLink}} -->
										<v-btn rounded color="primary" :disabled="item.webLink.trim() === ''" @click="openLink(item)">Visit Website</v-btn>
										<!-- <v-btn @click="goToTeam(item)">Team Details</v-btn>  -->
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
					</v-card>
				</v-row>
			</div>
			<!-- <v-container v-else>
				<v-row class="justify-center">
					<v-col>
						<v-progress-circular
						:size="250"
						color="primary"
						indeterminate
						></v-progress-circular>
					</v-col>
				</v-row>
			</v-container> -->
		</v-container>
		<v-navigation-drawer  v-model="drawer" clipped app permanent right :mini-variant.sync="mini">
			<v-list>
				<v-list-item>
					<v-btn v-if="!mini" icon @click.stop="mini = !mini">
						<v-icon>mdi-chevron-right</v-icon>
					</v-btn>
					<v-list-item-icon>
						<v-icon>mdi-filter</v-icon>
					</v-list-item-icon>
					<v-list-item-title>
						Table Filters
					</v-list-item-title>
				</v-list-item>
			</v-list>

			<v-divider></v-divider>

			<v-list nav dense>
				<v-list-item link>
					<v-list-item-icon>
						<v-icon v-if="teamTypeFilter.trim() !== ''" color="#197E81">mdi-radar</v-icon>
						<v-icon v-else>mdi-radar</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-select v-model="teamTypeFilter" :items="teamTypes" label="Team Track">
							<template v-slot:prepend>
								<v-btn v-if="teamTypeFilter.trim() !== ''" icon @click="teamTypeFilter = ''"><v-icon>mdi-close</v-icon></v-btn>
							</template>
						</v-select>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-icon>
						<v-icon v-if="businessTracksFilter.trim() !== ''" color="#197E81">mdi-domain</v-icon>
						<v-icon v-else>mdi-domain</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-select v-model="businessTracksFilter" :items="businessTracks" label="Business Track">
							<template v-slot:prepend>
								<v-btn v-if="businessTracksFilter.trim() !== ''" icon @click="businessTracksFilter = ''"><v-icon>mdi-close</v-icon></v-btn>
							</template>
						</v-select>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-icon>
						<v-icon v-if="finalsFilter !== null" color="#197E81">mdi-flag-checkered</v-icon>
						<v-icon v-else>mdi-flag-checkered</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-select v-model="finalsFilter" :items="values" item-text="text" item-value="value" label="Assessment Finals">
						</v-select>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-icon>
						<v-icon v-if="semifinalsFilter !== null" color="#197E81">mdi-flag</v-icon>
						<v-icon v-else>mdi-flag</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-select v-model="semifinalsFilter" :items="values" item-text="text" item-value="value" label="Assessment SemiFinals">
						</v-select>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-icon>
						<v-icon v-if="locationFilter.trim() !== ''" color="#197E81">mdi-city</v-icon>
						<v-icon v-else>mdi-city</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-select v-model="locationFilter" :items="locations" label="Location">
							<template v-slot:prepend>
								<v-btn v-if="locationFilter.trim() !== ''" icon @click="locationFilter = ''"><v-icon>mdi-close</v-icon></v-btn>
							</template>
						</v-select>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-icon>
						<v-icon v-if="workshopFilter.trim() !== ''" color="#197E81">mdi-briefcase</v-icon>
						<v-icon v-else>mdi-briefcase</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-select v-model="workshopFilter" :items="workshopDays" label="Workshop">
							<template v-slot:prepend>
								<v-btn v-if="workshopFilter.trim() !== ''" icon @click="workshopFilter = ''"><v-icon>mdi-close</v-icon></v-btn>
							</template>
						</v-select>
					</v-list-item-content>
				</v-list-item>
				<v-list-item>
					<v-list-item-icon>
						<v-icon>mdi-filter-off</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-btn outlined rounded color="primary" @click="clearFilters()">Clear Filters</v-btn>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { mapGetters } from "vuex";
import { UI } from "@startupway/main/lib/ui";
import { User } from "@startupway/users/lib/ui";
import { Team, Product, TeamType, WorkshopDay, BusinessTrack, Tab } from "@startupway/teams/lib/ui";
import { ModifiedTeam, Review } from "../../common";
export default Vue.extend({
	name: "Dashboard",
	components: {},
	async mounted():Promise<void> {
		let _varToString = (varObj: Object): string => Object.keys(varObj)[0];
		let name = _varToString({ BusinessTrack });
		this._enumToData(BusinessTrack, name);
		name = _varToString({ TeamType });
		this._enumToData(TeamType, name);
		name = _varToString({ WorkshopDay });
		this._enumToData(WorkshopDay, name);
		// try {
		// 	await this.ui.storeDispatch("teams/loadProduct", this.teamId);
		// } catch (e) {
		// 	console.error(e);
		// }
	},
	data() {
		return {
			ui:UI.getInstance(),
			changed:false,
			allTeams: [] as (Team & Product)[],
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
        	drawer: true,
			mini: true,
			valid:true,
			validDesc:true,
			teamId: "",
			role:"" as string,
			menuName:{
				title:"",
			},
			router:false,
			show:true,
			currentRoute:"" as string,
			mentoredTeams:[] as (ModifiedTeam)[],
			selectedMentoredTeam: {} as Team,
			id:"",
			tabs: [] as Tab[],
			editElement: true,
			dialog: false,
			team: null as (Team & Product) | null,
			values:[
				{text:"Yes", value:true},
				{text:"No", value:false},
				{text:"NONE", value:null},
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
			reviews: [] as Review[],
			type: "",
			loadingPage:false,
			loading:false,
			expanded: [],
			singleSelect: false,
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
				{ text: "Assessment Finals", value:"assessment20May"},
				{ text: "Assessment SemiFinals", value:"assessment12Oct"},
				{ text: "Actions", value: "actions", sortable: false },
				{ text: "Updated Description", value: "updated", sortable: false },
				{ text: "Last Team Update", value: "updatedAt", sortable: false},
				{ text: "Last Mentor Update", value: "lastMentorUpdate", sortable: false}
			],
			tableOptions:{},
			existsUpdate: false,
			approveDescriptions: [] as (Team & Product)[],
			updated: null as (Team & Product) | null,
			approveDialog: false,
			selectedTeam: "",
			allDescriptions: {} as {[key:string]:string}
		};
	},
	filters: {
		moment(date: Date):string {
			return moment(date).format("MMMM Do YYYY, h:mm:ss a");
		}
	},
	watch: {
		mentoredTeam: {
			immediate:true,
			async handler(newTeam:string):Promise<void> {
				if(this.mentoredTeams.length > 0){
					const resp = this.mentoredTeams.find( team => {
						return team.teamId == newTeam;
					});
					if(resp) {
						this.selectedMentoredTeam = resp;
					}
					this.id = newTeam;
				}
			}
		},
		selectedMentoredTeam: {
			immediate:true,
			async handler(newTeam:Team & Product):Promise<void> {
				if(newTeam) {
					try {
						let response = await this.ui.api.get<Product | null>("/api/v1/teams/product/" + newTeam.teamId);
						let product:Product | null = response.data;
						if(product) {
							newTeam.businessTrack = product.businessTrack;
							newTeam.teamType = product.teamType;
						}
					} catch (error) {
						console.error(error);
					}
				}
			}
		},
		async $route (to, from):Promise<void> {
			if(to.path == "/workspace") {
				this.router=false;
			} else if(to.path == "/login") {
				this.tabs=[];
			}
			this.currentRoute=to.name;
			if (this.role === "Mentor") {
				let response = await this.ui.api.get<(Team & Product)[]>("/api/v1/teams/mentor/teamsAndProduct/" + this.user.userId);
				if (response) {
					this.mentoredTeams = this.modifyTeams(response.data);
					
				}
			} else if (this.role === "Admin" || this.role === "SuperAdmin") {
				let response = await this.ui.api.get<(Team & Product)[]>("/api/v1/admin/teams/" + this.user.userDetails["location"]);
				if (response) {
					this.mentoredTeams = this.modifyTeams(response.data);
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
				if(newUser) {
					if(newUser.role === "Mentor") {
						this.type="mentor";
					} else if(newUser.role === "Admin") {
						this.type="admin";
					} else if(newUser.role === "SuperAdmin") {
						this.type="superAdmin";
					} else {
						this.loading = false;
						this.loadingPage = false;
					}
					if(newUser.role === "Mentor" || newUser.role === "Admin" || newUser.role === "SuperAdmin" ) {
						if(this.tabs.length > 0) {
							this.tabs = [];
						}
						if (newUser.role === "Admin" || newUser.role === "SuperAdmin") {
							this.role = newUser.role;
							let response = await this.ui.api.get<(Team & Product)[]>("/api/v1/admin/teams/"+newUser.userDetails["location"]);
							if (response) {
								this.mentoredTeams = this.modifyTeams(response.data);
								for(let team in this.mentoredTeams) {
									this.mentoredTeams[team].teamId;
									this.mentoredTeams[team].description = response.data[team].descriptionEN;
									this.mentoredTeams[team].mentor = this.mentoredTeams[team].teamDetails.mentor;
								}
							}
							
						} else if(newUser.role === "Mentor") {
							this.role = newUser.role;
							let response = await this.ui.api.get<(Team & Product)[]>("/api/v1/teams/mentor/teamsAndProduct/" + newUser.userId);
							if (response) {
								
								this.mentoredTeams = this.modifyTeams(response.data);
								for(let team in this.mentoredTeams) {
									this.mentoredTeams[team].teamId;
									this.mentoredTeams[team].description = response.data[team].descriptionEN;
								}
							}
						}
					}
					try {
						let id = newUser.userId;
						let location = newUser.userDetails.location;
						let response = await this.ui.api.post<Review[]>("/api/v1/admin/teams/review", {
							type:this.type,
							id:id,
							location:location
						});
						this.reviews = response.data;

					} catch (e) {
						console.error(e);
					}
					this.loading = false;
					this.loadingPage = false;
					
				}
			}
		},
		mentoredTeams: {
			immediate: true,
			async handler (newTeams: (Team & Product)[]):Promise<void> {
				if (this.role==="Mentor") {
					for(let team of newTeams) {
						let response = await this.ui.api.get<Product>("/api/v1/teams/product/" + team.teamId);
						let product:Product = response.data;
						team.businessTrack = product.businessTrack;
						team.teamType = product.teamType;
					}
				}
			}
		}
	},
	computed: {
		...mapGetters({
			_token: "users/token",
			user: "users/user",
			currentTeam: "teams/currentTeam",
			mentoredTeam: "teams/mentoredTeam",
			_teams: "teams/teams",
			feed: "feed/feed"
		}),
		sortBy: {
			get():string | string[] {
				return this.$store.state.admin.sortBy;
			},
			set(value:string | string[]):void {
				this.ui.storeDispatch('admin/updateSortBy',value, {root:true});
			}
		},
		sortDesc: {
			get():string | string[] {
				return this.$store.state.admin.sortDesc;
			},
			set(value:string | string[]):void {
				this.ui.storeDispatch('admin/updateSortDesc',value, {root:true});
			}
		},
		search:{
			get():string {
				return this.$store.state.admin.search;
			},
			set(value:string):void {
				this.ui.storeDispatch('admin/updateSearch',value, {root:true});
			}
		},
		semifinalsFilter:{
			get():boolean | null {
				return this.$store.state.admin.semifinalsFilter;
			},
			set(value:boolean | null):void {
				this.ui.storeDispatch('admin/updateSemifinalsFilter',value, {root:true});
			}
		},
		finalsFilter:{
			get():boolean | null {
				return this.$store.state.admin.finalsFilter;
			},
			set(value:boolean | null):void {
				this.ui.storeDispatch('admin/updateFinalsFilter',value, {root:true});
			}
		},
		businessTracksFilter:{
			get():string {
				return this.$store.state.admin.businessTracksFilter;
			},
			set(value:string):void {
				this.ui.storeDispatch('admin/updateBusinessTracksFilter',value, {root:true});
			}
		},
		teamTypeFilter:{
			get():string {
				return this.$store.state.admin.teamTypeFilter;
			},
			set(value:string):void {
				this.ui.storeDispatch('admin/updateTeamTypeFilter',value, {root:true});
			}
		},
		locationFilter:{
			get():string {
				return this.$store.state.admin.locationFilter;
			},
			set(value:string):void {
				this.ui.storeDispatch('admin/updateLocationFilter',value, {root:true});
			}
		},
		workshopFilter:{
			get():string {
				return this.$store.state.admin.workshopFilter;
			},
			set(value:string):void {
				this.ui.storeDispatch('admin/updateWorkshopFilter',value, {root:true});
			}
		},
		teams (): Team[] {
			return this._teams as Team[];
		},
		filteredReviews():Review[] {
			let filteredRev:Review[] = [];
			if(this.reviews.length > 0) {
				filteredRev = this.reviews.filter((review:Review) => {
					if(this.finalsFilter !== null) {
						if(this.semifinalsFilter !== null) {
							return review.teamTrack.includes(this.teamTypeFilter) &&
								review.businessTrack.includes(this.businessTracksFilter) &&
								review.location.includes(this.locationFilter) &&
								review.workshopNr.includes(this.workshopFilter) &&
								review.assessment20May === this.finalsFilter &&
								review.assessment12Oct === this.semifinalsFilter;
						}
						return review.teamTrack.includes(this.teamTypeFilter) &&
							review.businessTrack.includes(this.businessTracksFilter) &&
							review.location.includes(this.locationFilter) &&
							review.workshopNr.includes(this.workshopFilter) &&
							review.assessment20May === this.finalsFilter;
					} else {
						if(this.semifinalsFilter !== null) {
							return review.teamTrack.includes(this.teamTypeFilter) &&
								review.businessTrack.includes(this.businessTracksFilter) &&
								review.location.includes(this.locationFilter) &&
								review.workshopNr.includes(this.workshopFilter) &&
								review.assessment12Oct === this.semifinalsFilter;
						}
						return  review.teamTrack.includes(this.teamTypeFilter) &&
							review.businessTrack.includes(this.businessTracksFilter) &&
							review.location.includes(this.locationFilter) &&
							review.workshopNr.includes(this.workshopFilter);
					}
					});
			}
			return filteredRev;
		}
	},
	methods: {
		moment() {
			return moment();
		},
		formatDate(date: Date):string {
			let time  = (new Date(date)).toTimeString().split(" ");
			if(new Date(date).toString() === "Invalid Date")
				return "";
			else 
			return (new Date(date)).toDateString() + " " + time[0];
		},
		openDialog(item: (Team & Product)):void {
			this.dialog = true;
			this.team = item;
		},
		openForApprove(item: (Team & Product)):void {
			let toApprove = this.approveDescriptions.find((el : (Team & Product)) => el.teamId === item.teamId);
			if(toApprove) {
				this.approveDialog = true;
				this.updated = toApprove;
				this.selectedTeam = item.teamId;
			}
		},
		updateColor(item: (Team & Product)):string {
			let found = this.approveDescriptions.find((element: (Team & Product)) => element.teamId === item.teamId)
			if(found)
				return "red";
			return "green";
		},
		disabledIcon(item: (Team & Product) | null):boolean {
			if(item) {
				let found = this.approveDescriptions.find((element: (Team & Product)) => element.teamId === item.teamId)
				if(found !== undefined)
					return false;
				return true;
			}
			return false;
		},
		_enumToData(enumData: any, name: string):void {
			// as any to transform from enum to property in data;
			name = name.replace(/^\w/, c => c.toLowerCase()) + "s";
			for (let propName in enumData) {
				if (propName !== "NONE") ((this as any)[name] as Array<Object>).push(enumData[propName]);
			}
		},
		clearFilters():void {
			this.semifinalsFilter = null;
			this.finalsFilter = null;
			this.teamTypeFilter = "";
			this.businessTracksFilter = "";
			this.workshopFilter = "";
			this.locationFilter = "";
		},
		openLink(item:Review):void {
			let webLink:string = item.webLink;
			if(!webLink.includes("http://")) {
				webLink = "http://" + webLink;
			}
			window.open(webLink, "_blank");
		},
		async goToTeam(item:Review) {
			let teamId = item.teamId;
			await this.$store.dispatch("teams/mentorTeam",teamId);
			const path = "/viewTeam/product/"
			if(this.$route.path !== path)
				this.$router.push(path + teamId);
		},
		async changeData() {
			if(this.team !== null && this.team.startupName != "") {
				this.loading = true;
				this.loadingPage = true;
				
				// as any because error it's null 
				let productIndex = this.reviews.findIndex((el: Review) => el.startupName === (this.team as (Team&Product)).startupName);
				this.reviews[productIndex].updatedAt = (this.formatDate(new Date()) as unknown as Date).toString();
				let response = await this.ui.api.post<Review[]>("/api/v1/admin/teams/review/update", 
				{
					reviews:this.reviews,
					type:this.type
				});
				if(response) {
					this.reviews = response.data;
					
					let productToUpdate = this.allTeams.findIndex((el: Team & Product) => el.startupName === (this.allTeams[productIndex] as Team & Product).startupName);
					if(productToUpdate !== undefined) {
						try {
							let product = await this.ui.api.get<Product | null>("/api/v1/teams/product/" + this.allTeams[productToUpdate].teamId);
							if(product.data) {
								product.data.lastMentorUpdate = (this.formatDate(new Date()) as unknown as Date) ;
								product.data.updatedAt = (this.formatDate(new Date()) as unknown as Date) ;
								try {
									await this.ui.api.post<Product | null>("/api/v1/teams/product/update", {
										product: product.data,
										upload: "",
										ext: ".pptx",
										teamId: this.allTeams[productToUpdate].teamId
									});
								} catch (e) {
									console.error(e);
								}
								try {
									await this.ui.storeDispatch("teams/updateProduct", {
										product: product.data,
										teamId: this.allTeams[productToUpdate].teamId
									});
								} catch (e) {
									console.error(e);
								}
							}
						} catch (e) {
							console.error(e);
						}
						let prd = {
							productId: this.allTeams[productToUpdate].productId,
							mentorId: this.allTeams[productToUpdate].mentorId,
							startupName: this.allTeams[productToUpdate].startupName,
							businessTrack: this.allTeams[productToUpdate].businessTrack,
							teamType: this.allTeams[productToUpdate].teamType,
							workshopDay: this.allTeams[productToUpdate].workshopDay,
							descriptionRO: this.allTeams[productToUpdate].descriptionRO,
							descriptionEN: this.allTeams[productToUpdate].descriptionRO,
							pendingDescriptionEN: this.allTeams[productToUpdate].pendingDescriptionEN,
							pendingDescriptionRO: this.allTeams[productToUpdate].pendingDescriptionRO,
							productDetails: this.allTeams[productToUpdate].productDetails,
							lastMentorUpdate: (this.formatDate(new Date()) as unknown as Date),
							updatedAt: this.allTeams[productToUpdate].updatedAt
						} as Product;
					try {
						await this.ui.storeDispatch("teams/updateProduct", {
							product: prd,
							teamId: this.allTeams[productToUpdate].teamId
						});
					} catch (e) {
						console.error(e);
					}
					}
				}

				this.dialog = false;
				this.$forceUpdate();
				this.loadingPage = false;
				this.loading = false;
			}
		},
		editTeam(team: Team & Product) {
			this.team = team;
			this.dialog = true;
		},
		exitDialog() {
			(this.team as ((Team & Product) | {postpone:string})) = {
				postpone:""
			}
			this.dialog = false;
			
		},
		exitApproveDialog() {
			(this.updated as ((Team & Product) | {postpone:string})) = {
				postpone:""
			}
			this.approveDialog = false;
			
		},
		async approveDescription() {
			try {
				if(this.updated) {
					let pendingUpdateRO = this.updated.descriptionRO;
					let pendingUpdateEN = this.updated.descriptionEN;
					if(this.updated.pendingDescriptionRO !== '') {
						pendingUpdateRO = this.updated.pendingDescriptionRO;
					}
					if(this.updated.pendingDescriptionEN !== '') {
						pendingUpdateEN = this.updated.pendingDescriptionEN;
					}

					let response = await this.ui.api.post<Product | null>("/api/v1/teams/product/approve/description",{
							productId: this.updated.productId,
							startupName: this.updated.startupName,
							businessTrack: this.updated.businessTrack,
							teamType: this.updated.teamType,
							workshopDay: this.updated.workshopDay,
							mentorId: this.updated.mentorId,
							descriptionRO: pendingUpdateRO,
							descriptionEN: pendingUpdateEN,
							pendingDescriptionRO: "",
							pendingDescriptionEN: "",
							productDetails: this.updated.productDetails,
							lastMentorUpdate: (this.formatDate(new Date()) as unknown as Date),
							updatedAt: this.updated.updatedAt
						})
					if(response.data) {
						
						let res = await this.ui.api.get<Product | null>("/api/v1/teams/product/" + this.selectedTeam);
							if(res) {
								let product = response.data;
								if(this.updated) {
									this.updated.productId = product.productId;
									this.updated.startupName = product.startupName;
									this.updated.businessTrack = product.businessTrack;
									this.updated.teamType = product.teamType;
									this.updated.workshopDay = product.workshopDay;
									this.updated.mentorId = product.mentorId;
									this.updated.descriptionRO = product.descriptionRO;
									this.updated.descriptionEN = product.descriptionEN;
									this.updated.pendingDescriptionRO = product.pendingDescriptionRO;
									this.updated.pendingDescriptionEN = product.pendingDescriptionEN;
									this.updated.productDetails = product.productDetails;
									this.updated.lastMentorUpdate = product.lastMentorUpdate;
									this.updated.updatedAt = product.updatedAt;
									// let found = this.filteredReviews.findIndex((el: any) => el.teamId === this.updated.teamId);
									// this.filteredReviews[found] = this.updated;

									// as any because error that it's null
									let found2 = this.approveDescriptions.findIndex((el: Team & Product) => el.teamId === (this.updated as any).teamId);
									this.approveDescriptions.splice(found2, 1);
									this.disabledIcon(null);
									this.allDescriptions[product.productId] = product.descriptionEN;
									// this.description = product.descriptionEN;

									// as any because error that it's null
									let productIndex = this.reviews.findIndex((el: Review) => el.teamId === (this.updated as any).teamId);
									(this.reviews[productIndex] as Review).lastMentorUpdate = (this.formatDate(new Date()) as unknown as Date).toString();
								}
							}
						this.$forceUpdate();
					}
					}
			} catch (e) {
				console.error(e);
			}
			this.approveDialog = false;
		},
		async selectTeam(team:Team):Promise<void> {
			this.id = team.teamId;
			await this.$store.dispatch("teams/mentorTeam", team.teamId);
			this.changeRoute("/viewTeam/composition")
		},
		async editProduct(team:Team):Promise<void> {
			this.id = team.teamId;
			await this.$store.dispatch("teams/mentorTeam", team.teamId);
			this.changeRoute("/viewTeam/product")
		},
		async teamActivity(team:Team):Promise<void> {
			this.id = team.teamId;
			await this.$store.dispatch("teams/mentorTeam", team.teamId);
			this.changeRoute("/viewTeam/activities")
		},
		async productNewUpdates(team:Team):Promise<void> {
			this.id = team.teamId;
			await this.$store.dispatch("teams/mentorTeam", team.teamId);
			this.changeRoute("/viewTeam/feed")
		},
		async openCanvas(team:Team):Promise<void> {
			this.id = team.teamId;
			await this.$store.dispatch("teams/mentorTeam", team.teamId);
			this.changeRoute("/viewTeam/canvas")
		},
		modifyTeams(newTeams:(Team & Product)[]):(ModifiedTeam)[] {
			let newArray:ModifiedTeam[]=[];
			for(let team of newTeams) {
				team.updatedAt = new Date(this.formatDate(team.updatedAt));
				team.lastMentorUpdate = new Date(this.formatDate(team.lastMentorUpdate));
				this.allTeams.push(team);
				if(team.pendingDescriptionEN !== "" || team.pendingDescriptionRO !=="") {
					this.existsUpdate = true;
					this.approveDescriptions.push(team);
				};
				this.allDescriptions[team.teamId] = team.descriptionEN;
				let newTeam:ModifiedTeam = {
					teamId:team.teamId,
					productId:team.productId,
					year:team.year,
					location:team.location,
					teamName:team.teamName,
					teamDetails:team.teamDetails,
					businessTrack:team.businessTrack,
					teamType:team.teamType,
					pendingDescriptionRO: team.pendingDescriptionRO,
					pendingDescriptionEN: team.pendingDescriptionEN,
					updatedAt: team.updatedAt,
					lastMentorUpdate: team.lastMentorUpdate,
					mentor:"",
					description:""
				}
				newArray.push(newTeam);
			}
			let found = this.allTeams.findIndex((el: Team & Product) => el.startupName === "");
			this.allTeams.splice(found, 1);
			this.allTeams = this.allTeams.sort(function(a, b) {
				var nameA = a.startupName.toUpperCase();
				var nameB = b.startupName.toUpperCase();
				if (nameA < nameB) {return -1;}
				if (nameA > nameB) {return 1;}
				return 0;
			});
			return newArray
		},
		pushToTabs(tab:Tab):void {
			if(this.tabs.find((item:Tab) => {
				return item.link === tab.link
			}) === undefined) {
				this.tabs.push(tab);
			}
		},
		checkRoute():boolean {
			if(this.$router.currentRoute.path === "/workspace")
				return true;
			else
				return false;
		},
		pushBack():void {
			this.$router.go(-1);
		},
		changeRoute(link:string):void {
			if((this.role==="Mentor" || this.role==="Admin" || this.role ==="SuperAdmin") && this.selectedMentoredTeam.teamId !== "" && link.split("/")[1] === "viewTeam") {
				if(this.$route.path !== link + "/" + this.id)
					this.$router.push(link + "/" + this.id);
			}
			else {
				if(this.$route.path !== link)
					this.$router.push(link);
			}
		}
	}
});
</script>
<style lang="less">
</style>