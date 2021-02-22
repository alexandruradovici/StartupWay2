<template>
	<v-app>
		<v-card flat style="margin-left: auto; margin-right: auto; padding-top: 20px; background-color: #fcfcfc;" min-width="500">
			<v-container v-show="!loadingPage">
				<v-card-title class="justify-center" style="font-family: Georgia, serif; font-weight: bold;">Export Data</v-card-title>
				<v-divider></v-divider>
				<v-card-text class="justify-center">
					Multiple export options
				</v-card-text>
				
				<v-card-actions class="justify-center">
					<v-btn rounded color="primary" @click="exportUDC()">Extract csv with upload/description/canvas information</v-btn>
				</v-card-actions>
				
				<v-card-actions class="justify-center">
					<v-btn rounded color="primary" @click="exportTDD()">Extract csv with description, name, business track, team track</v-btn>
				</v-card-actions>
				<v-divider></v-divider>
				<v-row align="center">
					<v-select
						v-model="team"
						:items="teams"
						label="Select a team you wish to export"
						item-text="teams_teamName"
						item-value="teams_productId"
						hint="Please make sure to select a value"
						persistent-hint
					></v-select>
				</v-row>
				<v-row align="center">
					<v-btn :disabled="team ===''" rounded color="primary" @click="exportTeamZip('team')">Download team zip</v-btn>
				</v-row>
				<v-row>
					<v-col cols="6" align="center">
						<v-card-title class="justify-center" style="font-family: Georgia, serif; font-weight: bold;">All Teams</v-card-title>
						<v-row>
							<v-select
								v-model="teamDate"
								:items="dates"
								label="Select type of exports for teams"
								item-text="text"
								item-value="value"
								hint="Please make sure to select a value"
								persistent-hint
							></v-select>
							<v-btn :disabled="teamDate===''" rounded color="primary" @click="exportTeamZip('all')">Download all teams zip</v-btn>
						</v-row>
					</v-col>
					<v-col cols="6" align="center">
						<v-select
							v-model="date"
							:items="dates"
							label="Select type of exports for resource"
							item-text="text"
							item-value="value"
							hint="Please make sure to select a value"
							persistent-hint
						></v-select>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="6" align="center">
						<v-row>
						<v-card-title class="justify-center" style="font-family: Georgia, serif; font-weight: bold;">City Teams</v-card-title>
							<v-row>
								<v-col>
									<v-select
										v-model="city"
										:items="cities"
										label="Select the city you wish to export"
										item-text="text"
										item-value="value"
										hint="Please make sure to select a value"
										persistent-hint
									></v-select>
								</v-col>
								<v-col>
									<v-select
										v-model="cityDate"
										:items="dates"
										label="Select type of exports for city teams"
										item-text="text"
										item-value="value"
										hint="Please make sure to select a value"
										persistent-hint
									></v-select>
								</v-col>
							</v-row>
							<v-row>
								<v-btn :disabled="city==='' || cityDate === ''" rounded color="primary" @click="exportTeamZip('city')">Download city teams zip</v-btn>
							</v-row>
						</v-row>
					</v-col>
					<v-col cols="6" align="center">
						<v-row>
							<v-btn :disabled="date===''" rounded color="primary" @click="exportZip('pres')">Download pptx zip</v-btn>
						</v-row>
						<v-row>
							<v-btn :disabled="date===''" rounded color="primary" @click="exportZip('demoVid')">Download tehnic demo video zip</v-btn>
						</v-row>
						<v-row>
							<v-btn :disabled="date===''" rounded color="primary" @click="exportZip('presVid')">Download presentation video zip</v-btn>
						</v-row>
						<v-row>
							<v-btn :disabled="date===''" rounded color="primary" @click="exportZip('image')">Download images zip</v-btn>
						</v-row>
						<v-row>
							<v-btn :disabled="date===''" rounded color="primary" @click="exportZip('logo')">Download logo zip</v-btn>
						</v-row>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="6" align="center">
						<v-row>
							<v-card-title class="justify-center" style="font-family: Georgia, serif; font-weight: bold;">Preset Teams</v-card-title>
							<v-select
								v-model="preset"
								:items="presetTeams"
								label="Select the preset teams export"
								item-text="text"
								item-value="value"
								hint="Please make sure to select a value"
								persistent-hint
							></v-select>
							<v-btn :disabled="preset===''" rounded color="primary" @click="exportTeamZip('preset')">Download preset teams zip</v-btn>
						</v-row>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="6" align="center">
						<v-row>
							<v-select
								v-model="option"
								:items="options"
								label="Select the preset teams export"
								item-text="text"
								item-value="value"
								hint="Please make sure to select a value"
								persistent-hint
							></v-select>
							<v-btn :disabled="preset ==='' || option === ''" rounded color="primary" @click="exportTeamZip('preset',option)">Download preset teams resource</v-btn>
						</v-row>
					</v-col>
				</v-row>
			</v-container>
			<v-container v-show="loadingPage">
				<v-card flat outlined color="#fcfcfc" class="justify-center">
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
export default Vue.extend({
	name: "ExportView",
	async mounted() {
		
	},
	data() {
		return {
			ui: UI.getInstance(),
			preset:'',
			presetTeams:[] as {text:string,value:number[]}[],
			city:'',
			cities:[
				"Bucharest",
				"Cluj",
				"Iasi",
				"Sibiu",
				"Timisoara"
			],
			teamDate:'',
			cityDate:'',
			date:'',
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
							// const demoResponse = await this.ui.api.get<number[]>("/api/v1/teams/teams/demoDay");
							// if(demoResponse.data) {
							// 	this.presetTeams.push({
							// 		text:"DemoDay Teams",
							// 		value:demoResponse.data
							// 	})
							// }
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
		async exportTeamZip(type:string,option?:string):Promise<void> {
			try {
				this.loadingPage = true;
				let body = {};
				if(type === 'all')
					body = {
						type:type,
						date:this.teamDate,
						cityOrTeam:''
					};
				else if(type === 'team')
					body = {
						type:type,
						date:'none',
						cityOrTeam:this.team
					}
				else if(type === 'city')
					body = {
						type:type,
						date:this.cityDate,
						cityOrTeam:this.city
					}; 
				
				else if(type === 'preset')
					body = {
						type:type,
						date:'none',
						cityOrTeam:this.preset,
						option:option
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
							if(response.data) {
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
								if(!this.toStop)
									setTimeout(statusFunction,1000);
							}
						} catch (error) {
							if(error.response.status === 401 || error.response.status === 502) {
								if(!this.toStop)
									setTimeout(statusFunction,1000);
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
		async exportZip(type:string) {
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
		async exportUDC():Promise<void> {
			try {
				const response = await this.ui.api.post<string | null>("/api/v1/admin/download/udc/data");	
				if(response.data) {
					const hiddenElement = document.createElement('a');
					hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(response.data);
					hiddenElement.target = '_blank';
					hiddenElement.download = 'users.csv';
					hiddenElement.click();
				};
			} catch (e) {
				console.error(e);
			}
		},
		async exportTDD():Promise<void> {
			try {
				const response = await this.ui.api.post<string | null>("/api/v1/admin/download/team/data");	
				if(response.data) {
					const hiddenElement = document.createElement('a');
					hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(response.data);
					hiddenElement.target = '_blank';
					hiddenElement.download = 'team.csv';
					hiddenElement.click();
				};
			} catch (e) {
				console.error(e);
			}
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