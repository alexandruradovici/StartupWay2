<template>
	<v-app>
		<v-container
			justify="center"
		>
			<v-row class="ma-3 mb-3" justify="center" no-gutters>
				<v-card color="primary" flat shaped outlined width="100%">
					<v-card flat shaped outlined width="100%" class="pa-2">
						<v-row class="justify-center pa-2 ma-2" align="center">
							<v-col class="d-flex align-start flex-column">
								<h1>Public Teams View</h1>
							</v-col>
						</v-row>
					</v-card>
				</v-card>
			</v-row>
			<v-row class="ma-3 mb-6" justify="center">
				<v-layout child-flex align-center justify-center height="100vh">
					<v-card shaped outlined color="primary" flat height="100%" width="100%" class="d-flex flex-column">
						<v-data-table
							item-key="startupName"
							class="elevation-2 pa-2"
							fill-height
							:headers="headers"
							:items="filteredProfiles"
							:search="search"
							:itemsPerPage="-1"
							multi-sort
							:sort-by.sync="sortBy"
							:sort-desc.sync="sortDesc"
							:loading="filteredProfiles.length <= 0"
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
							<template v-slot:[`item.actions`]="{ item }">
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-btn
											class="ml-4 mr-4"
											color="secondaryDark1"
											outlined
											fab
											v-bind="attrs"
											v-on="on"
											@click="viewProfile(item.teamId)"
										>
											<v-icon x-small>
												mdi-book-open mdi-24px
											</v-icon>
										</v-btn>
									</template>
									<span>View Profile</span>
								</v-tooltip>
							</template>
						</v-data-table>
					</v-card>
				</v-layout>
			</v-row>
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
						<v-icon v-if="teamTypeFilter.trim() !== ''" color="primary">mdi-radar</v-icon>
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
						<v-icon v-if="businessTracksFilter.trim() !== ''" color="primary">mdi-domain</v-icon>
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
						<v-icon v-if="locationFilter.trim() !== ''" color="primary">mdi-city</v-icon>
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
		<SnackBar :options="snackOptions"  @update-snackbar="updateSnack" :snackbar="snackbar"/>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { mapGetters } from "vuex";
import { UI } from "@startupway/main/lib/ui";
import { Team, Product, TeamType, BusinessTrack } from "@startupway/teams/lib/ui";
import { Profile } from "../../common";
import { SnackBarOptions, SnackBarTypes, SnackBarHorizontal, SnackBarVertical } from "@startupway/menu/lib/ui";
interface IPublicDashboard {
	ui: UI,
	changed: boolean,
	allTeams: (Team & Product)[],
	startupRules: ((value: string) => string | boolean)[],
	rulesDesc: ((value: string) => string | boolean)[],
	drawer: boolean,
	mini: boolean,
	menuName:{
		title:"",
	},
	router: boolean,
	show: boolean,
	id: string,
	values: {text: string, value: boolean | null}[],
	teamTypes: string[],
	businessTracks: string[],
	locations: string[],
	profiles: Profile[],
	type: string,
	headers: 
		{
			text: string,
			align?: string,
			sortable?: boolean,
			value: string
		}[],
	snackOptions: SnackBarOptions,
	snackbar: boolean,
}
export default Vue.extend({
	name: "PublicDashboard",
	components: {},
	async mounted():Promise<void> {
		let _varToString = (varObj: Object): string => Object.keys(varObj)[0];
		let name = _varToString({ BusinessTrack });
		this._enumToData(BusinessTrack, name);
		name = _varToString({ TeamType });
		this._enumToData(TeamType, name);
		if (this.$route.query.type) {
			this.teamTypeFilter = this.$route.query.type as string;
		}
		if (this.$route.query.city) {
			this.locationFilter = this.$route.query.city as string;
		}
		if (this.$route.query.track) {
			this.businessTracksFilter = this.$route.query.track as string;
		}
		try {
			let response = await this.ui.api.get<Profile[]>("/api/v1/public/profile");
			this.profiles = response.data;
			console.log(this.profiles);
		} catch (e) {
			console.error(e);
		}
	},
	data (): IPublicDashboard {
		return {
			ui:UI.getInstance(),
			changed:false,
			allTeams: [] as (Team & Product)[],
			startupRules: [
				(value: string) => {
					if (value && value.length > 0) 
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
			menuName:{
				title:"",
			},
			router:false,
			show:true,
			id:"",
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
			locations:[
				"Bucharest",
				"Cluj",
				"Iasi",
				"Sibiu",
				"Timisoara"
			],
			profiles: [] as Profile[],
			type: "",
			headers: [
				{
					text: "Location",
					align: "left",
					sortable: true,
					value: "location"
				},
				{ text: "Startup Name", value: "startupName" },
				{ text: "Team Track", value: "teamTrack" },
				{ text: "Business Track", value: "businessTrack" },
				{ text: "Web Page Link", value: "webLink"},
				{ text: "Actions", value: "actions", sortable: false }
			],
			snackbar: false,
			snackOptions: {
				text:"",
				type: SnackBarTypes.INFO,
				timeout:2000,
				horizontal: SnackBarHorizontal.RIGHT,
				vertical: SnackBarVertical.BOTTOM
			}
		};
	},
	filters: {
		moment(date: Date):string {
			return moment(date).format("MMMM Do YYYY, h:mm:ss a");
		}
	},
	watch: {
		async $route (to, from):Promise<void> {
    	}
	},
	computed: {
		...mapGetters({
		}),
		sortBy: {
			get():string | string[] {
				return this.$store.state.public.sortBy;
			},
			set(value:string | string[]):void {
				this.ui.storeDispatch('public/updateSortBy',value, {root:true});
			}
		},
		sortDesc: {
			get():string | string[] {
				return this.$store.state.public.sortDesc;
			},
			set(value:string | string[]):void {
				this.ui.storeDispatch('public/updateSortDesc',value, {root:true});
			}
		},
		search:{
			get():string {
				return this.$store.state.public.search;
			},
			set(value:string):void {
				this.ui.storeDispatch('public/updateSearch',value, {root:true});
			}
		},
		businessTracksFilter:{
			get():string {
				return this.$store.state.public.businessTracksFilter;
			},
			set(value:string):void {
				this.ui.storeDispatch('public/updateBusinessTracksFilter',value, {root:true});
				// this.$router.replace(`/public/${this.locationFilter}/${this.businessTracksFilter}/${this.teamTypeFilter}`);
				let query: {
					type?: string,
					track?: string,
					city?: string
				} = {
				};
				if (value !== "") {
					query.track = value;
				}
				if (this.teamTypeFilter !== "") {
					query.type = this.teamTypeFilter;
				}
				if (this.locationFilter !== "") {
					query.city = this.locationFilter;
				}
				this.$router.replace({ path: "/public", query});
			}
		},
		teamTypeFilter:{
			get():string {
				return this.$store.state.public.teamTypeFilter;
			},
			set(value:string):void {
				this.ui.storeDispatch('public/updateTeamTypeFilter', value, {root:true});
				let query: {
					type?: string,
					track?: string,
					city?: string
				} = {
				};
				if (this.businessTracksFilter !== "") {
					query.track = this.businessTracksFilter;
				}
				if (value !== "") {
					query.type = value;
				}
				if (this.locationFilter !== "") {
					query.city = this.locationFilter;
				}
				this.$router.replace({ path: "/public", query});
				// this.$router.replace(`/public/${this.locationFilter}/${this.businessTracksFilter}/${this.teamTypeFilter}`);
			}
		},
		locationFilter:{
			get():string {
				return this.$store.state.public.locationFilter;
			},
			set(value:string):void {
				this.ui.storeDispatch('public/updateLocationFilter',value, {root:true});
				// this.$router.replace(`/public/${this.locationFilter}/${this.businessTracksFilter}/${this.teamTypeFilter}`);
				let query: {
					type?: string,
					track?: string,
					city?: string
				} = {
				};
				if (this.businessTracksFilter !== "") {
					query.track = this.businessTracksFilter;
				}
				if (this.teamTypeFilter !== "") {
					query.type = this.teamTypeFilter;
				}
				if (value !== "") {
					query.city = value;
				}
				this.$router.replace({ path: "/public", query});
			}
		},
		filteredProfiles():Profile[] {
			let filteredRev:Profile[] = [];
			if (this.profiles.length > 0) {
				filteredRev = this.profiles.filter((profile:Profile) => {
						return  profile.teamTrack.includes(this.teamTypeFilter) &&
							profile.businessTrack.includes(this.businessTracksFilter) &&
							profile.location.includes(this.locationFilter);
					});
			}
			return filteredRev;
		}
	},
	methods: {
		updateSnack (prop:boolean): void {
			this.snackbar = prop;
		},
		moment() {
			return moment();
		},
		formatDate(date: Date):string {
			let time  = (new Date(date)).toTimeString().split(" ");
			if (new Date(date).toString() === "Invalid Date")
				return "";
			else 
			return (new Date(date)).toDateString() + " " + time[0];
		},
		_enumToData(enumData: any, name: string):void {
			// as any to transform from enum to property in data;
			name = name.replace(/^\w/, c => c.toLowerCase()) + "s";
			for (let propName in enumData) {
				if (propName !== "NONE") ((this as any)[name] as Array<Object>).push(enumData[propName]);
			}
		},
		clearFilters():void {
			this.teamTypeFilter = "";
			this.businessTracksFilter = "";
			this.locationFilter = "";
		},
		openLink(item:Profile):void {
			let webLink:string = item.webLink;
			if (!webLink.includes("http://")) {
				webLink = "http://" + webLink;
			}
			window.open(webLink, "_blank");
		},
		async getLogo (event: {item: Profile, open: boolean} ): Promise<void> {
			try {
				if (!event.item.logo) {
					const profileIndex = this.profiles.indexOf(event.item);
					const filteredIndex = this.filteredProfiles.indexOf(event.item);
					if (profileIndex !== -1) {
						const resImage = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>(`/api/v1/uploadDownload/get/file/product/logo/${event.item.productId}`);
						if (resImage.data && resImage.data.length !== 0) {
							event.item.logo = resImage.data[0].data;
						}
						this.profiles[profileIndex] = event.item;
						this.filteredProfiles[filteredIndex] = event.item;
						this.$forceUpdate();
					}
				}
			} catch (error) {
				const e:Error = error;
				console.error(e.message);
			}
		},
		async viewProfile(teamId: string) {
			this.$router.push(`/public/team/${teamId}`);
		},
	}
});
</script>
<style lang="less">
</style>