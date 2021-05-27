<template>
	<v-app>
		<v-container>
			<div class="justify-center">
				<v-row class="mb-6" justify="center" no-gutters>
					<v-col>
						<v-row class="justify-center" align="center">
							<h1 class="landing-message">Assessment View</h1>
						</v-row>
						<v-row>
							<v-divider></v-divider>
						</v-row>
					</v-col>
				</v-row>
				<v-row class="mb-6" justify="center" >
					<v-card class="mx-auto" flat>
						<v-data-table
							item-key="startupName"
							:headers="headers"
							:items="filteredTeams"
							:search="searchAssessment"
							multi-sort
							:itemsPerPage="-1"
							:sort-by.sync="sortByAssessment"
							:sort-desc.sync="sortDescAssessment"
							:loading="filteredTeams.length <= 0"
							loading-text="Loading teams"
						>
							<template v-slot:top>
								<v-text-field
									v-model="searchAssessment"
									append-icon="mdi-magnify"
									label="Search"
									single-line
									hide-details
								></v-text-field>
							</template>
							<template v-slot:[`item.assesSemiFinals`]="{ item }">
								<v-simple-checkbox
								color="#197E81"
								v-model="item.assesSemiFinals"
								@input="updateProduct(item)"
								></v-simple-checkbox>
							</template>
							<template v-slot:[`item.assesFinals`]="{ item }">
								<v-simple-checkbox
								color="#197E81"
								v-model="item.assesFinals"
								@input="updateProduct(item)"
								></v-simple-checkbox>
							</template>
						</v-data-table>
						<v-divider style="margin-top: 30px; margin-bottom: 30px;"></v-divider>
					</v-card>
				</v-row>
			</div>
		</v-container>
		<v-navigation-drawer v-model="drawer" clipped app permanent right :mini-variant.sync="mini">
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
						<v-icon v-if="teamTypeFilterAssessment.trim() !== ''" color="#197E81">mdi-radar</v-icon>
						<v-icon v-else>mdi-radar</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-select v-model="teamTypeFilterAssessment" :items="teamTypes" label="Team Track">
							<template v-slot:prepend>
								<v-btn v-if="teamTypeFilterAssessment.trim() !== ''" icon @click="teamTypeFilterAssessment = ''"><v-icon>mdi-close</v-icon></v-btn>
							</template>
						</v-select>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-icon>
						<v-icon v-if="businessTracksFilterAssessment.trim() !== ''" color="#197E81">mdi-domain</v-icon>
						<v-icon v-else>mdi-domain</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-select v-model="businessTracksFilterAssessment" :items="businessTracks" label="Business Track">
							<template v-slot:prepend>
								<v-btn v-if="businessTracksFilterAssessment.trim() !== ''" icon @click="businessTracksFilterAssessment = ''"><v-icon>mdi-close</v-icon></v-btn>
							</template>
						</v-select>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-icon>
						<v-icon v-if="finalsFilterAssessment !== null" color="#197E81">mdi-flag-checkered</v-icon>
						<v-icon v-else>mdi-flag-checkered</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-select v-model="finalsFilterAssessment" :items="values" item-text="text" item-value="value" label="Assessment Finals">
						</v-select>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-icon>
						<v-icon v-if="semifinalsFilterAssessment !== null" color="#197E81">mdi-flag</v-icon>
						<v-icon v-else>mdi-flag</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-select v-model="semifinalsFilterAssessment" :items="values" item-text="text" item-value="value" label="Assessment SemiFinals">
						</v-select>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-icon>
						<v-icon v-if="locationFilterAssessment.trim() !== ''" color="#197E81">mdi-city</v-icon>
						<v-icon v-else>mdi-city</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-select v-model="locationFilterAssessment" :items="locations" label="Location">
							<template v-slot:prepend>
								<v-btn v-if="locationFilterAssessment.trim() !== ''" icon @click="locationFilterAssessment = ''"><v-icon>mdi-close</v-icon></v-btn>
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
import { Team, Product, TeamType, WorkshopDay, BusinessTrack } from "@startupway/teams/lib/ui";
import { ModifiedTeam, Review } from "../../common";
export default Vue.extend({
	name: "Assessment",
	components: {},
	async mounted():Promise<void> {
		let _varToString = (varObj: Object): string => Object.keys(varObj)[0];
		let name = _varToString({ BusinessTrack });
		this._enumToData(BusinessTrack, name);
		name = _varToString({ TeamType });
		this._enumToData(TeamType, name);
		name = _varToString({ WorkshopDay });
		this._enumToData(WorkshopDay, name);
	},
	data() {
		return {
			ui:UI.getInstance(),
			teamId: "",
			role:"" as string,
        	drawer: true,
			mini: true,
			router:false,
			show:true,
			currentContent:true,
			mentoredTeams:[] as (ModifiedTeam)[],
			selectedMentoredTeam: {} as Team,
			id:"",
			editElement: true,
			dialog: false,
			team: null as (Team & Product) | null,
			reviews: [] as Review[],
			type: "",
			loadingPage:false,
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
			loading:false,
			headers: [
				{
					text: "Location",
					align: "left",
					sortable: true,
					value: "location"
				},
				{ text: "Startup Name", value: "startupName" },
				{ text: "Team Track", value: "teamType" },
				{ text: "Business Track", value: "businessTrack" },
				{ text: "Assessment SemiFinals", value:"assesSemiFinals"},
				{ text: "Assessment Finals", value:"assesFinals"},
				// { text: "Actions", value: "actions", sortable: false }
			],
			teams: [] as (Team & Product & {assesFinals:boolean,assesSemiFinals:boolean})[],
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
			if (this.role === "Mentor") {
				let response = await this.ui.api.get<(Team & Product & {assesFinals:boolean,assesSemiFinals:boolean})[]>("/api/v1/teams/mentor/teamsAndProduct/" + this.user.userId);
				if (response) {
					this.teams = this.modifyTeams(response.data);
				}
			} else if (this.role === "Admin" || this.role === "SuperAdmin") {
				let response = await this.ui.api.get<(Team & Product & {assesFinals:boolean,assesSemiFinals:boolean})[]>("/api/v1/admin/teams/" + this.user.userDetails["location"]);
				if (response) {
					this.teams = this.modifyTeams(response.data);
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
					this.loading = true;
					this.loadingPage = true;
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
						if (newUser.role === "Admin" || newUser.role === "SuperAdmin") {
							this.role = newUser.role;
							let response = await this.ui.api.get<(Team & Product & {assesFinals:boolean,assesSemiFinals:boolean})[]>("/api/v1/admin/teams/"+newUser.userDetails["location"]);
							if (response) {
								this.teams = this.modifyTeams(response.data);
							}
							
						} else if(newUser.role === "Mentor") {
							this.role = newUser.role;
							let response = await this.ui.api.get<(Team & Product & {assesFinals:boolean,assesSemiFinals:boolean})[]>("/api/v1/teams/mentor/teamsAndProduct/" + newUser.userId);
							if (response) {
								this.teams = this.modifyTeams(response.data);
							}
						}
					}
					this.loading = false;
					this.loadingPage = false;
					
				}
			}
		},
		teams: {
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
			},
		}
	},
	computed: {
		...mapGetters({
			_token: "users/token",
			user: "users/user",
		}),
		sortByAssessment:{
			get():string | string[] {
				return this.$store.state.admin.sortByAssessment;
			},
			set(value:string | string[]):void {
				this.ui.storeDispatch('admin/updateAssessmentSortBy',value, {root:true});
			}
		},
		sortDescAssessment:{
			get():string | string[] {
				return this.$store.state.admin.sortDescAssessment;
			},
			set(value:string | string[]):void {
				this.ui.storeDispatch('admin/updateAssessmentSortDesc',value, {root:true});
			}
		},
		searchAssessment:{
			get():string {
				return this.$store.state.admin.searchAssessment;
			},
			set(value:string):void {
				this.ui.storeDispatch('admin/updateAssessmentSearch',value, {root:true});
			}
		},
		semifinalsFilterAssessment:{
			get():boolean | null {
				return this.$store.state.admin.semifinalsFilterAssessment;
			},
			set(value:boolean | null):void {
				this.ui.storeDispatch('admin/updateAssessmentSemifinalsFilter',value, {root:true});
			}
		},
		finalsFilterAssessment:{
			get():boolean | null {
				return this.$store.state.admin.finalsFilterAssessment;
			},
			set(value:boolean | null):void {
				this.ui.storeDispatch('admin/updateAssessmentFinalsFilter',value, {root:true});
			}
		},
		businessTracksFilterAssessment:{
			get():string {
				return this.$store.state.admin.businessTracksFilterAssessment;
			},
			set(value:string):void {
				this.ui.storeDispatch('admin/updateAssessmentBusinessTracksFilter',value, {root:true});
			}
		},
		teamTypeFilterAssessment:{
			get():string {
				return this.$store.state.admin.teamTypeFilterAssessment;
			},
			set(value:string):void {
				this.ui.storeDispatch('admin/updateAssessmentTeamTypeFilter',value, {root:true});
			}
		},
		locationFilterAssessment:{
			get():string {
				return this.$store.state.admin.locationFilterAssessment;
			},
			set(value:string):void {
				this.ui.storeDispatch('admin/updateAssessmentLocationFilter',value, {root:true});
			}
		},
		filteredTeams():(Team & Product & {assesFinals:boolean,assesSemiFinals:boolean})[] {
			let filteredTeam:(Team & Product & {assesFinals:boolean,assesSemiFinals:boolean})[] = [];
			if(this.teams.length > 0) {
				filteredTeam = this.teams.filter((team:Team & Product & {assesFinals:boolean,assesSemiFinals:boolean}) => {
					if(this.finalsFilterAssessment !== null) {
						if(this.semifinalsFilterAssessment !== null) {
							return team.teamType.includes(this.teamTypeFilterAssessment) &&
								team.businessTrack.includes(this.businessTracksFilterAssessment) &&
								team.location.includes(this.locationFilterAssessment) &&
								team.assesFinals === this.finalsFilterAssessment &&
								team.assesSemiFinals === this.semifinalsFilterAssessment;;
						}
						return team.teamType.includes(this.teamTypeFilterAssessment) &&
							team.businessTrack.includes(this.businessTracksFilterAssessment) &&
							team.location.includes(this.locationFilterAssessment) &&
							team.assesFinals === this.finalsFilterAssessment;
					} else {
						if(this.semifinalsFilterAssessment !== null) {
							return team.teamType.includes(this.teamTypeFilterAssessment) &&
								team.businessTrack.includes(this.businessTracksFilterAssessment) &&
								team.location.includes(this.locationFilterAssessment) &&
								team.assesSemiFinals === this.semifinalsFilterAssessment;
						}
						return team.teamType.includes(this.teamTypeFilterAssessment) &&
							team.businessTrack.includes(this.businessTracksFilterAssessment) &&
							team.location.includes(this.locationFilterAssessment);
					}
					
				});
			}
			return filteredTeam;
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
		_enumToData(enumData: any, name: string):void {
			// as any to transform from enum to property in data;
			name = name.replace(/^\w/, c => c.toLowerCase()) + "s";
			for (let propName in enumData) {
				if (propName !== "NONE") ((this as any)[name] as Array<Object>).push(enumData[propName]);
			}
		},
		clearFilters():void {
			this.semifinalsFilterAssessment = null;
			this.finalsFilterAssessment = null;
			this.teamTypeFilterAssessment = "";
			this.businessTracksFilterAssessment = "";
			this.locationFilterAssessment = "";
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
		modifyTeams(newTeams:(Team & Product & {assesFinals:boolean,assesSemiFinals:boolean})[]):(Team & Product & {assesFinals:boolean,assesSemiFinals:boolean})[] {
			let newArray:(Team & Product & {assesFinals:boolean,assesSemiFinals:boolean})[]=[];
			for(let team of newTeams) {
				team.assesSemiFinals = team.productDetails["assessmentFinals"];
				team.assesFinals = team.productDetails["assessmentSemifinals"];
				newArray.push(team);
			}
			newArray = newArray.sort(function(a, b) {
				var nameA = a.startupName.toUpperCase();
				var nameB = b.startupName.toUpperCase();
				if (nameA < nameB) {return -1;}
				if (nameA > nameB) {return 1;}
				return 0;
			});
			return newArray
		},
		checkRoute():boolean {
			if(this.$router.currentRoute.path === "/workspace")
				return true;
			else
				return false;
		},
		async updateProduct(item:(Team & Product & {assesFinals:boolean,assesSemiFinals:boolean})):Promise<void> {
			try {
				const response = await this.ui.api.get<Product | null>("/api/v1/teams/product/" + item.teamId);
				const product = response.data;
				if(product) {
					product.productDetails.assessmentSemifinals = item.assesFinals;
					product.productDetails.assessmentFinals = item.assesSemiFinals;
					const resp:Product | null = await this.ui.api.post("/api/v1/teams/product/update", {teamId:item.teamId, product:product});
					if(!resp){
						console.log("ERROR");
					}
				} else {
					console.log("ERROR");
				}
			} catch (error) {
				console.error(error);
			}
		}
	}
});
</script>
<style lang="less">
</style>