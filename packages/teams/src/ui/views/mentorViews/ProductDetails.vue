<template>
	<div>
		<v-container v-if="!loadingPage" class="content" fluid pl-7 pr-7>
			<v-divider></v-divider>
			<v-card flat style="margin: auto;" max-width="1000" color="#fcfcfc">
				<v-form v-model="productValid" lazy-validation>
					<div class="details">Startup name</div>
					<v-text-field 
						:rules="startupRules"
						outlined 
						rounded 
						color="primary" 
						v-model="product.startupName"
					></v-text-field>

					<div class="details">Workshop Day</div>
					<v-select
						v-model="product.workshopDay"
						:items="workshopDays"
						label="Workshop Day"
					></v-select>

					<div class="details">Business Track</div>
					<v-select
						v-model="product.businessTrack"
						:items="businessTracks"
						label="Business Track"
					></v-select>

					<div class="details">Team Type</div>
					<v-select
						v-model="product.teamType"
						:items="teamTypes"
						label="Team Type"
					></v-select>

					<div v-if="product.productDetails !== 0">
						<h3 class="text-md-center">Current Official Description</h3>

						<div class="details">English Description</div>
						<v-textarea 
							outlined 
							color="primary" 
							v-model="product.descriptionEN" 
							auto-grow 
							:rules="rulesDesc"
							no-resize counter="600"
						></v-textarea>
						
						<div class="details">Romanian Description</div>
						<v-textarea
							outlined 
							color="primary" 
							v-model="product.descriptionRO" 
							auto-grow 
							style="margin-bottom: 20px;"
							:rules="rulesDesc"
							no-resize counter="600"
						></v-textarea>
						
						<v-divider></v-divider>
					</div>

					<div v-if="product.pendingDescriptionEN !== '' || product.pendingDescriptionRO !== ''">
						<h3 class="text-md-center">Description Pending for Appropval</h3>

						<div v-if="product.productDetails !== 0">
							<div v-if="product.pendingDescriptionEN !== ''"> Pending English Description
								<v-textarea 
									v-model="product.pendingDescriptionEN" 
									outlined 
									color="primary"
									:rules="rulesDesc"
									no-resize counter="600"
								></v-textarea>
							</div>

							<div v-if="product.pendingDescriptionRO !== ''"> Pending Romanian Description
								<v-textarea 
									v-model="product.pendingDescriptionRO" 
									outlined 
									color="primary"
									:rules="rulesDesc"
									no-resize counter="600"
								></v-textarea>
							</div>
						</div>
					</div>

					

					<div v-if="product.productDetails !== {} && product.productDetails !== undefined" style="margin-top: 20px;">
						<v-divider></v-divider>
						<v-row>
							<v-col cols="4">
								<div class="details">Website Link</div>
								<v-text-field
									v-model="product.productDetails['website']"
									outlined
									rounded
									color="primary"
								></v-text-field>
							</v-col>
							<v-col cols="4">
								<div class="details">Linkedin</div>
								<v-text-field
									v-model="product.productDetails['linkedin']"
									outlined
									rounded
									color="primary"
								></v-text-field>									
							</v-col>
							<v-col cols="4">
								<div class="details">Facebook Link</div>	
								<v-text-field
									v-model="product.productDetails['facebook']"
									outlined
									rounded
									color="primary"
								></v-text-field>
							</v-col>
						</v-row>
					</div>

					<v-divider></v-divider>
					<v-row no-gutters style="margin-top: 20px; margin-bottom: 20px;" v-if="pres !== undefined">
						<v-col cols="12" sm="12" md="12" lg="12" xl="12" align="center">
							<v-btn v-if="pres !== undefined" text @click="download(pres.uuid)" color="primary" justify="center" style="margin-top: 20px; margin-bottom: 20px;">
								<v-icon left color="primary">mdi-attachment mdi-rotate-90</v-icon>
								Download PowerPoint Presentation
							</v-btn>
						</v-col>
						
					</v-row>
					<v-row no-gutters align="center" justify="center" style="margin-top: 20px; margin-bottom: 20px;">
						<v-col cols="12" sm="12" md="6" lg="6" xl="6">
							<div v-if="demoVid !== undefined">
								<v-card flat outlined>
									<v-card-title class="justify-center">Tehnic Demo Video</v-card-title>
									<v-divider></v-divider>
									<v-card-text>
										<video
											:src="demoVid.data" 
											width="100%"
											controls
										></video>
									</v-card-text>
									
									<v-card-actions class="justify-center">
										<v-btn text @click="download(demoVid.uuid)" color="primary" justify="center" style="margin-top: 20px; margin-bottom: 20px;">
											<v-icon left color="primary">mdi-file-video-outline</v-icon>
											Download Demo Video
										</v-btn>
									</v-card-actions>
								</v-card>
							</div>
						</v-col>
						<v-col cols="12" sm="12" md="6" lg="6" xl="6">
							<div v-if="presVid !== undefined">
								<v-card flat outlined>	
									<v-card-title class="justify-center">Product Presentation Video</v-card-title>
									<v-divider></v-divider>
									<v-card-text>
										<video
											:src="presVid.data" 
											width="100%"
											controls
										></video>
									</v-card-text>
									<v-card-actions class="justify-center">
										<v-btn text @click="download(presVid.uuid)" color="primary" justify="center" style="margin-top: 20px; margin-bottom: 20px;">
											<v-icon left color="primary">mdi-video-account</v-icon>
											Download Presentation Video
										</v-btn>
									</v-card-actions>
								</v-card>
							</div>
						</v-col>
					</v-row>
					<v-row align="center" justify="center" no-gutters style="margin-top: 20px; margin-bottom: 30px;">
						<v-col cols="12" sm="12" md="6" lg="6" xl="6">
							<div v-if="logo !== undefined" align="center" justify="center">
								<div style="max-width: 200px;" align="center" justify="center">
									<v-card outlined flat align="center" justify="center">
										<v-hover v-slot:default="{ hover }" >
											<v-card flat color="#fcfcfc" @click="extendImage(logo.data)"  rounded :elevation="hover ? 16 : 0">
												<v-img :src="logo.data" max-width="200" max-height="200"></v-img>
											</v-card>
										</v-hover>

										<v-card-actions class="justify-center">
											<v-btn text @click="download(logo.uuid)" color="primary" justify="center" style="margin-top: 20px; margin-bottom: 20px;">
												<v-icon left color="primary">mdi-camera</v-icon>
												Download Logo
											</v-btn>
										</v-card-actions>
									</v-card>
								</div>
							</div>
						</v-col>
					</v-row>
					<v-row align="center" justify="center" no-gutters style="margin-top: 20px; margin-bottom: 20px;">
						<v-col cols="12" sm="12" md="8" lg="10" xl="10">
							<!-- <div v-if="images.length > 0"> -->
								<v-card flat outlined v-if="images.length > 0" color="#fcfcfc">
									<v-card-title class="justify-center">Product Images</v-card-title>
									<v-divider></v-divider>
									<v-card-text>
										<v-row>
											<v-col v-for="image in images" :key="image.uuid">
												<div style="max-width: 200px;">
													<v-card outlined flat>
														<v-hover v-slot:default="{ hover }">
															<v-card style="max-width: 200px;"  flat color="#fcfcfc" @click="extendImage(image.data)" rounded :elevation="hover ? 16 : 0">
																<v-img :src="image.data" max-width="200" max-height="200"></v-img>
															</v-card>
														</v-hover>

														<v-card-actions>
														<v-spacer></v-spacer> 
														<v-btn icon @click="download(image.uuid)" color="primary" >
															<v-icon color="primary">mdi-arrow-down</v-icon>
														</v-btn>
														</v-card-actions>
													</v-card>
												</div>
											</v-col>
										</v-row>
									</v-card-text>
								</v-card>
							<!-- </div> -->
						</v-col>
					</v-row>

					<v-card-actions class="justify-center">
						<v-btn v-if="product.pendingDescriptionRO !== '' || product.pendingDescriptionEN !== ''" color="primary" @click="approveDescription()">Approve Description</v-btn>
						<v-btn :disabled="!productValid" color="primary" @click="updateProduct(product)">Update Product</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
			<v-dialog v-model="extendDialog" max-width="450">
				<v-card flat max-width="450">
					<v-img :src="extendedImage"></v-img>
					<v-card-actions class="justify-center">
						<v-btn text color="primary" @click="extendDialog=false">Exit</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
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
import { Team, Product, BusinessTrack, TeamType, WorkshopDay, UserTeams } from "../../../common";
import { User } from "@startupway/users/lib/ui";
import { UI } from '@startupway/main/lib/ui';
export default Vue.extend({
	name: "ProductDetails",
	mounted() {
		const _varToString = (varObj: Object): string => Object.keys(varObj)[0];
		let name = _varToString({ BusinessTrack });
		this._enumToData(BusinessTrack, name);
		name = _varToString({ TeamType });
		this._enumToData(TeamType, name);
		name = _varToString({ WorkshopDay });
		this._enumToData(WorkshopDay, name);
	},
	watch: {
		$route:{
			immediate:true,
			async handler(newRoute):Promise<void> {
				this.loadingPage = true;
				this.teamId = this.$route.params.teamId;
				try {
					if (await this.getUsers(this.teamId))
						await this.getAllUsers();
					const found = await this.ui.api.get<Team | null>("/api/v1/teams/team/" + this.teamId);
					if (found.data) {
						this.team = found.data.teamName;
					}
					let response = await this.ui.api.get<Product | null>("/api/v1/teams/product/"+this.teamId);
					if (response.data) {
						this.product = response.data;
					}
					if (this.product !== undefined) {
						let resImage = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/image/"+ this.product.productId);
						if (resImage.data) {
							this.images = resImage.data;
						}
						resImage = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/logo/"+ this.product.productId);
						if (resImage.data) {
							this.logo = resImage.data[0];
						}
						resImage = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/demoVid/"+ this.product.productId);
						if (resImage.data) {
							this.demoVid = resImage.data[0];
						}
						resImage = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/presVid/"+ this.product.productId);
						if (resImage.data) {
							this.presVid = resImage.data[0];
						}
						resImage = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/pres/"+ this.product.productId);
						if (resImage.data) {
							this.pres = resImage.data[0];
						}
					}
				} catch (e) {
					console.error(e);
				}
				this.loadingPage = false;
			}
		},
		user: {
			immediate: true,
			async handler(newUser: User):Promise<void>  {
				if (newUser) {
					if (newUser.role === "Admin" || newUser.role === "SuperAdmin") {
						try {
							this.location = newUser.userDetails["location"];
							const response = await this.ui.api.get<Team[]>("/api/v1/admin/teams/");
							if (response) {
								this.teams = response.data;
							}
						} catch (e) {
							console.error(e);
						}
					} else if (newUser.role === "Mentor") {
						try {
							this.location = newUser.userDetails["location"];
							const response = await this.ui.api.get<(Team & Product)[]>("/api/v1/teams/mentor/teams/" + newUser.userId);
							if (response) {
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
		...mapGetters({
			user: "users/user",
		})
	},
	data() {
		return {
			ui: UI.getInstance(),
			productValid:true,
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
			extendedImage: "",
			extendDialog: false,
			teams: [] as (Team[] | (Team & Product)[]),
			location: "" as string,
			users:[] as User[],
			allUsers:[] as User[],
			teamId:"",
			team:"",
			product:{} as Product,
			teamTracks:[],
			businessTracks:[],
			teamTypes:[],
			workshopDays:[],
			loadingPage:false,
			images:[] as {data:string,type:string,ext:string,uuid:string}[],
			logo:{} as {data:string,type:string,ext:string,uuid:string},
			presVid:{} as {data:string,type:string,ext:string,uuid:string},
			demoVid:{} as {data:string,type:string,ext:string,uuid:string},
			pres:{} as {data:string,type:string,ext:string,uuid:string},
		};
	},
	methods: {
		extendImage(image: string):void {
			this.extendedImage = image;
			this.extendDialog = true;
		},
		moment() {
			return moment();
		},
		// as any to tranform from enum to data property
		_enumToData(enumData: any, name: string):void {
			name = name.replace(/^\w/, c => c.toLowerCase()) + "s";
			for (const propName in enumData) {
				if (name === "workshopDays" && this.location === "Bucharest") {
					if (propName === "MONDAY" || propName === "WEDNESDAY" || propName === "THURSDAY") ((this as any)[name] as Array<Object>).push(enumData[propName]);
				} else
				if (propName !== "NONE") ((this as any)[name] as Array<Object>).push(enumData[propName]);
			}
		},
		hasUser(user:(User&UserTeams)):boolean{
			for(const aux of this.users) {
				if (aux.userId === user.userId) {
					return true;
				}
			}
			return false;
		},
		async getUsers(teamId: string):Promise<boolean>  {
			try {
				const response = await this.ui.api.get<(User & UserTeams)[]>("/api/v1/teams/team/users/" + teamId);
				if (response.data) {
					this.users = this.modifyUsers(response.data);
					return true;
				}
			} catch (e) {
				console.error(e);
				return false;
			}
			return false;
		},
		async getAllUsers():Promise<boolean> {
			try {
				const response = await this.ui.api.get<User[]>("/api/v1/users/users");
				if (response.data) {
					this.allUsers = this.modifyUsers(response.data);
					this.allUsers = this.allUsers.filter((user:(User&UserTeams)) => { return !this.hasUser(user)});
					return true;
				}
			} catch (e) {
				console.error(e);
				return false;
			}
			return false;
		},
		modifyUsers(users: (User[] | (User&UserTeams)[])): (User[] | (User&UserTeams)[]) {
			for(const user of users) {
				if (user.userDetails["faculty"] !== undefined) {
					(user as User & {faculty:string, group:string}).faculty = user.userDetails["faculty"]; 
				} else {
					(user as User & {faculty:string, group:string}).faculty = "";
				}
				if (user.userDetails["group"] !== undefined) {
					(user as User & {faculty:string, group:string}).group = user.userDetails["group"];
				} else {
					(user as User & {faculty:string, group:string}).group = "";
				}
			}
			return users;
		},
		async updateProduct(product:Product):Promise<void> {
			this.loadingPage = true;
			if (product.startupName !== "") {
				try {
					await this.ui.api.post<Product | null>("/api/v1/teams/product/update", {
						product: product,
						upload: "",
						ext: ".pptx",
						teamId: this.teamId
					});
				} catch (e) {
					console.error(e);
				}
			}
				this.loadingPage = false;
		},
		async approveDescription():Promise<void> {
			this.loadingPage = true;
			try {
				const response = await this.ui.api.post<Product | null>("/api/v1/teams/product/approve/description",this.product)
				if (response.data) {
					const res = await this.ui.api.get<Product | null>("/api/v1/teams/product/"+this.teamId);
						if (res.data) {
							this.product = res.data;
						}
					this.$forceUpdate();
				}
			} catch (e) {
				console.error(e);
			}
			this.loadingPage = false;
		},
		async editProduct():Promise<void> {
			this.loadingPage = true;
			try {
				const response = await this.ui.api.post<Product | null>("/api/v1/teams/product", {
					product:this.product
				})
				if (response.data) {
					this.$forceUpdate();
				}
			} catch (e) {
				console.error(e);
			}
			this.loadingPage = false;
		},
		async download(uuid:string):Promise<void> {
			this.loadingPage = true;
			try {
				const response = await this.ui.api.get<string | null>("/api/v1/uploadDownload/download/file/"+uuid);
				if (response.data) {
					const url = response.data;
					window.open(url, '_blank');
				} else {

				}
			} catch (e) {
				console.error(e);
			}
			this.loadingPage = false;
		},
	}
});
</script>,.v,