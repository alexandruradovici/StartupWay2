<template>
	<v-app>
		<v-card flat min-width="500">
			<v-card max-height="60" dark style="background-color:#ffb100">
				<v-card-title class="justify-center">Exports</v-card-title>
			</v-card>
			<v-container v-show="!loadingPage">
				<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); grid-gap:10px">
					<v-card>
						<v-card-title class="justify-center">
							Custom Exports
						</v-card-title>
						<v-card-text>
							<span>
								Contains:
							</span>
							<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(50px,1fr)); grid-gap:2px">
								<p>
									Location,
									Team Name,
									Team Track,
									Business Track,
									RO Description,
									Name of CEO,
									Email of CEO,
									Telephone of CEO
								</p>
							</div>
						</v-card-text>
						<v-card-actions class="justify-center">
							<v-btn rounded color="primary" @click="exportCEO()">
								<v-icon>mdi-download</v-icon> Download 
							</v-btn>
						</v-card-actions>
					</v-card>
					<v-card>
						<v-card-title class="justify-center">
							All teams | All resources
						</v-card-title>
						<v-card-text>
							<v-select
								v-model="teamDate"
								:items="dates"
								label="Select which teams to export"
								item-text="text"
								item-value="value"
								hint="Please make sure to select a value"
								persistent-hint
							></v-select>
						</v-card-text>
						<v-card-actions class="justify-center">
							<v-btn :disabled="teamDate===''" rounded color="primary" @click="exportTeamZip('all')">
								<v-icon>mdi-download</v-icon> Download
							</v-btn>
						</v-card-actions>
					</v-card>
					<v-card>
						<v-card-title class="justify-center">
							Specific City teams | All resources
						</v-card-title>
						<v-card-text>
							<v-row>
								<v-select
									v-model="city"
									:items="cities"
									label="Select the city you wish to export"
									item-text="text"
									item-value="value"
									hint="Please make sure to select a value"
									persistent-hint
								></v-select>
							</v-row>
							<v-row>
								<v-select
									v-model="cityDate"
									:items="dates"
									label="Select type of exports for city teams"
									item-text="text"
									item-value="value"
									hint="Please make sure to select a value"
									persistent-hint
								></v-select>
							</v-row>
						</v-card-text>
						<v-card-actions class="justify-center">
							<v-btn :disabled="city==='' || cityDate === ''" rounded color="primary" @click="exportTeamZip('city')">
								<v-icon>mdi-download</v-icon> Download
							</v-btn>
						</v-card-actions>
					</v-card>
					<v-card>
						<v-card-title class="justify-center">
							All teams | Certain resources
						</v-card-title>
						<v-card-text>
							<v-row>
								<v-select
									v-model="date"
									:items="dates"
									label="Select which type of teams to export"
									item-text="text"
									item-value="value"
									hint="Please make sure to select a value"
									persistent-hint
								></v-select>
							</v-row>
							<v-row>
								<v-select
									v-model="exportType"
									:items="exportTypes"
									label="Select the type of exports for resource"
									item-text="text"
									item-value="value"
									hint="Please make sure to select a value"
									persistent-hint
								></v-select>
							</v-row>
						</v-card-text>
						<v-card-actions class="justify-center">
							<v-btn :disabled="date === '' || exportType === ''" rounded color="primary" @click="exportCertainZip(exportType)"> <v-icon>mdi-download</v-icon> Download </v-btn>
						</v-card-actions>
					</v-card>
					<v-card>
						<v-card-title class="justify-center">
							EXPORT
						</v-card-title>
						<v-card-text>
							<div style="display:grid; grid-template-columns: 1fr; grid-gap:5px">
								<v-select
									v-model="cityExp"
									:items="cities"
									label="Select the city you wish to export"
									item-text="text"
									item-value="value"
									hint="Please make sure to select a value"
									persistent-hint
								></v-select>
								<v-select
									v-model="businessTrack"
									:items="businessTracks"
									label="Select the business track"
									item-text="text"
									item-value="value"
									hint="Please make sure to select a value"
									persistent-hint
								></v-select>
								<v-select
									v-model="workshopNo"
									:items="days"
									label="Select the workshopDay"
									item-text="text"
									item-value="value"
									hint="Please make sure to select a value"
									persistent-hint
								></v-select>
								<div style="display:grid; template-grid-columns: 1fr 1fr">
									<v-checkbox
									color="#ffb100"
									v-model="semiFinals"
									label="Is in Semifinals"
									></v-checkbox>
									
									<v-checkbox
									color="#ffb100"
									v-model="finals"
									label="Is in Finals?"
									></v-checkbox>
								</div>
							</div>
						</v-card-text>
						<v-card-actions class="justify-center">
							<v-btn :disabled="cityExp==='' || businessTrack === '' || workshopNo === ''" rounded color="primary" @click="exportTeamZip('city')">
								<v-icon>mdi-download</v-icon> Download
							</v-btn>
						</v-card-actions>
					</v-card>
				</div>
			</v-container>
			<v-container v-show="loadingPage">
				<v-card flat outlined  class="justify-center">
					<v-card-text class="justify-center">
						<v-row align="center" justify="center">
							<strong color="accent">Your download is being processed, this might take a few minutes.</strong>
						</v-row>
						<v-row align="center" justify="center">
							<strong color="accent">Please do not close or refresh the page!</strong>
						</v-row>
					</v-card-text>
				</v-card>
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
		</v-card>
		<SnackBar :options="snackOptions" :snackbar="snackbar" @update-prop="update"></SnackBar>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { User } from "@startupway/users/lib/ui"; 
import { Team } from "@startupway/teams/lib/ui"; 
import { SnackBarOptions, SnackBarTypes } from "@startupway/menu/lib/ui";
import { UI } from "@startupway/main/lib/ui";
import "../style/style.css";
export default Vue.extend({
	name: "ExportView",
	async mounted() {
	},
	data() {
		return {
			ui: UI.getInstance(),
			city:'',
			cityExp:'',
			cities:[
				"Bucharest",
				"Cluj",
				"Iasi",
				"Sibiu",
				"Timisoara"
			],
			workshopNo: '',
			days: [
				{
					value:'Mon',
					text:'Monday'
				},
				{
					value:'Tue',
					text:'Tuesday'
				},
				{
					value:'Wed',
					text:'Wednesday'
				},
				{
					value:'Thu',
					text:'Thursday'
				},
				{
					value:'Fri',
					text:'Friday'
				}
			],
			businessTrack: '',
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
			semiFinals: false,
			finals: false,
			teamDate:'',
			cityDate:'',
			date:'',
			exportType:'',
			exportTypes:[
				{
					text:'PowerPoint Presentation',
					value:'pres'
				},
				{
					text:'Presentation Video',
					value:'presVid'
				},
				{
					text:'Tehnic Demo Video',
					value:'demoVid'
				},
				{
					text:'Images',
					value:'image'
				},
				{
					text:'Logo Image',
					value:'logo'
				}
			],
			dates:[
				{
					text:'All Teams',
					value:'none'
				},
				{
					text:'Teams that passed 20th of May assessment',
					value:'may'
				},
				{
					text:'Teams that passed 12th of October assessment',
					value:'oct'
				}
			],
			team:'',
			teams:[] as Team[],
			loadingPage:false,
			//SnackBar popup
			snackOptions: {
				text:"",
				type:"info",
				timeout:2000
			} as SnackBarOptions,
			snackbar:false,
			responded: false,
			toStop:false,
			option:'',
			options:[
				{
					text:'PowerPoint Presentations',
					value:'pres'
				},
				{
					text:'Tehnic Demo Videos',
					value:'demoVid'
				},
				{
					text:'Presentation Videos',
					value:'presVid'
				},
				{
					text:'Logos',
					value:'logo'
				},
				{
					text:'Images',
					value:'images'
				},
			],
		};
	},
	watch: {
		user: {
			immediate:true,
			async handler (newUser:User):Promise<void> {
				if(newUser) {
					if(newUser.role !== "Admin" && newUser.role !== "SuperAdmin") {
						if(this.$route.path!=="/workspace")
							this.$router.push("/workspace");
					} else {
						try {
							const response = await this.ui.api.get<Team[]>("/api/v1/admin/teams"); 
							if(response) {
								this.teams = response.data;
								
							}
						} catch (e) {
							console.error(e);
						}
					}
				}
			}
		},
	},
	computed: {
		...mapGetters ({
			user:"users/user"
		}),
	},
	created() {
	},
	methods: {
		update(prop:boolean):void {
			this.snackbar = prop;
		},
		async exportCEO() {
			try {
				let response = await this.ui.api.get("/api/v1/admin/download/ceo/data");	
				if(response) {
					let hiddenElement = document.createElement('a');
					hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(response.data);
					hiddenElement.target = '_blank';
					hiddenElement.download = 'Export.csv';
					hiddenElement.click();
				};
			} catch (e) {
				console.error(e);
			}
		},
		async exportTeamZip(type:string,option?:string):Promise<void> {
			try {
				this.loadingPage = true;
				let body = {};
				if(type === 'all')
					body = {
						type:type,
						date:this.teamDate,
						city:null,
						team:null
					};
				else if(type === 'team')
					body = {
						type:type,
						date:'none',
						city:null,
						team:this.team
					}
				else if(type === 'city')
					body = {
						type:type,
						date:this.cityDate,
						city:this.city,
						team:null
					};
				
				const response = await this.ui.api.post<string | null>("/api/v1/uploadDownload/download/zip/",body);
				if(response.status === 200) {
					// let url = response.data.url;
					this.toStop = false;
					setTimeout(()=> {
						if(!this.toStop) {
							this.snackOptions.text = "Request timed out, please try again later, if the problem perssists please contact teams@tech-lounge.ro for more information";
							this.snackOptions.type = SnackBarTypes.INFO;
							this.snackOptions.timeout = 2000;
							this.snackbar = true;
							this.loadingPage = false;
							this.toStop = true;
						}
					},300000);
					const noUpload = () => {
						this.snackOptions.text = "There are no files uploaded for the selected option";
						this.snackOptions.type = SnackBarTypes.INFO;
						this.snackOptions.timeout = 2000;
						this.snackbar = true;
						this.loadingPage = false;
						this.toStop =true;
					}
					const statusFunction = async () => {
						try {
							const response = await this.ui.api.post<string | null>("/api/v1/uploadDownload/check/zip/status/",body);
							if(response.data !== null) {
								if(response.data === "ERROR") {
									this.snackOptions.text = "Server ERROR; Please contact teams@tech-lounge.ro for more information";
									this.snackOptions.type = SnackBarTypes.ERROR;
									this.snackOptions.timeout = 2000;
									this.snackbar = true;
									this.loadingPage = false;
									this.toStop = true;
									return;
								} else if(response.data === "NO_FILES_TO_UPLOAD") {
									noUpload();
									return;
								} else if(response.data !== "NOT_DONE" && response.data !== "") {
									this.openUrl(response.data);
									return;
								}
								if(!this.toStop) {
									setTimeout(statusFunction,1000);
								}
							}
						} catch (error) {
							if(error.response.status === 401 || error.response.status === 502) {
								if(!this.toStop)
									await setTimeout(statusFunction,1000);
							} else {
								console.error(error);
									this.snackOptions.text = "Server ERROR; Please contact teams@tech-lounge.ro for more information";
									this.snackOptions.type = SnackBarTypes.ERROR;
									this.snackOptions.timeout = 2000;
									this.snackbar = true;
									this.loadingPage = false;
									this.toStop = true;
							}
						}
					}
					statusFunction();
				} else {
					this.snackOptions.text = "Server ERROR; Please contact teams@tech-lounge.ro for more information";
					this.snackOptions.type = SnackBarTypes.ERROR;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				}
			} catch (e) {
				console.error(e);
			}
		},
		async exportCertainZip(type:string) {
			try {
				this.loadingPage = true;
				const response = await this.ui.api.get<string | null>("/api/v1/uploadDownload/download/zip/" + type + "/" + this.date);
				if(response.status === 200 && response.data) {
					const url = response.data;
					window.open(url, '_blank');
				} else if(response.status === 204) {
					this.snackOptions.text = "There are no files uploaded for any of the teams";
					this.snackOptions.type = SnackBarTypes.INFO;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				} else {
					this.snackOptions.text = "Server ERROR; Please contact teams@tech-lounge.ro for more information";
					this.snackOptions.type = SnackBarTypes.ERROR;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				}
			} catch (e) {
				console.error(e);
			}
			this.loadingPage = false;
		},
		async exportZip(city:string) {
			try {
				this.loadingPage = true;
				const options:{[key:string]:string|boolean} = {
					businessTrack:this.businessTrack,
					workshopNo:this.workshopNo,
					semiFinals:this.semiFinals,
					fianls:this.finals,
				}
				const response = await this.ui.api.post<string | null>("/api/v1/uploadDownload/download/zip/" + city, options);
				if(response.status === 200 && response.data) {
					const url = response.data;
					window.open(url, '_blank');
				} else if(response.status === 204) {
					this.snackOptions.text = "There are no files uploaded for any of the teams";
					this.snackOptions.type = SnackBarTypes.INFO;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				} else {
					this.snackOptions.text = "Server ERROR; Please contact teams@tech-lounge.ro for more information";
					this.snackOptions.type = SnackBarTypes.ERROR;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				}
			} catch (e) {
				console.error(e);
			}
			this.loadingPage = false;
		},
		openUrl(url:string):void {
			try {
				window.open(url, '_blank');
				this.loadingPage = false;
				this.toStop = true;
			} catch (e) {
				console.error(e);
			}
		}
	}
});
</script>

<style lang="less">
.contained .v-col .v-card {
	min-height: 10%;
	background-color: red;
	height: clamp(10%,248px,50%);
}
.export-grid {
	display: grid;
	grid-template-columns: 5fr 5fr 5fr;
}
</style>