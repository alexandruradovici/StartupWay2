<template>
	<v-app id="app">							
		<v-container pr-7 pl-7 v-if="!loadingPage">
			<div class="component-title">Product Summary</div>
			<v-card flat style="margin: auto; padding-top: 20px;" color="#fcfcfc">
				<v-form v-model="productValid" lazy-validation>
					<v-divider></v-divider>
					<div class="details">Startup name</div>
					<v-text-field 
						:rules="startupRules"
						outlined
						rounded 
						color="primary" 
						v-model="startupName"> 
					</v-text-field>

					<div class="details">Workshop Day</div>
					<v-select
						disabled
						v-model="workshop_day"
						:items="workshopDays"
						label="Workshop Day"
					></v-select>

					<div class="details">Business Track</div>
					<v-select
						disabled
						v-model="businessTrack"
						:items="businessTracks"
						label="Business Track"
					></v-select>

					<div class="details">Team Type</div>
					<v-select
						disabled
						v-model="teamType"
						:items="teamTypes"
						label="Team Type"
					></v-select>

					<div class="details">Workshop Number</div>
					<v-select 
						v-model="workshop_nr" 
						disabled 
						:items="workshops" 
						label="Workshop Number"
					></v-select>

					<div class="details">English Description</div>
					<v-textarea 
						outlined 
						color="primary" 
						v-model="product.descriptionEN" 
						auto-grow 
						disabled
					></v-textarea>
					
					<div class="details">Romanian Description</div>
					<v-textarea 
						outlined 
						color="primary" 
						v-model="product.descriptionRO" 
						auto-grow 
						style="margin-bottom: 20px;"
						disabled
					></v-textarea>
					
					<v-divider></v-divider>
					
					<v-container v-if="!loadingUpload">
						<v-row no-gutters style="margin-top: 20px; margin-bottom: 20px;">
							<v-col cols="12" sm="12" md="6" lg="4" xl="4">
								<v-card flat outlined class="justify-center" color="#fcfcfc">
									<div v-if="pres !== undefined">
										<v-card-title class="justify-center">Power Point Presentation</v-card-title>
										<v-divider></v-divider>
										<v-card-text class="justify-center">
											<v-row align="center" justify="center">
												<v-tooltip v-model="showDeletePresentation" bottom>
													<template v-slot:activator="{ on }">
														<v-btn icon v-on="on" @click="deleteObj(pres.uuid)">
															<v-icon color="primary">mdi-delete</v-icon>
														</v-btn>
													</template>
													<span>Delete Existing <br/> Presentation</span>
												</v-tooltip> 
												<v-tooltip v-model="showDownloadPresentation" bottom>
													<template v-slot:activator="{ on }">
														<v-btn icon v-on="on" @click="download(pres.uuid)">
															<v-icon color="primary">mdi-arrow-down</v-icon>
														</v-btn>
													</template>
													<span>Download <br/> Presentation</span>
												</v-tooltip> 
											</v-row>	
										</v-card-text>
									</div>
									<v-card-text>
										<v-file-input 
											type="file" 
											v-model="presFile" 
											outlined 
											auto-grow 
											counter 
											:rules="rulesPres"
											accept=".pptx, .ppt" 
											label="Upload Last Presentation"
											color="primary"
											prepend-icon="mdi-presentation-play"
										></v-file-input>
									</v-card-text>
									<v-card-actions class="justify-center">
										<v-btn text :disabled="!validPres" color="primary" @click="upload('pres')">Upload</v-btn>
									</v-card-actions>
								</v-card>
							</v-col>
							<v-col cols="12" sm="12" md="6" lg="4" xl="4">
								<v-card flat outlined color="#fcfcfc">
									<div v-if="demoVid !== undefined">
										<v-card-title class="justify-center">
											Tehnic Demo Video
										</v-card-title>
										<v-divider></v-divider>
										<v-card-text class="justify-center">
											<v-card outlined flat>
												<video
													:src="demoVid.data" 
													width="100%"
													controls
												></video>
												<v-card-actions>
												<v-spacer></v-spacer>
												<v-tooltip v-model="showDownloadDemo" bottom>
													<template v-slot:activator="{ on }">
														<v-btn icon v-on="on" @click="download(demoVid.uuid)">
															<v-icon color="primary">mdi-arrow-down</v-icon>
														</v-btn>
													</template>
													<span>Download <br/>Technical Demo</span>
												</v-tooltip> 
												<v-tooltip v-model="showDeleteDemo" bottom>
													<template v-slot:activator="{ on }">
														<v-btn icon v-on="on" @click="deleteObj(demoVid.uuid)">
															<v-icon color="primary">mdi-delete</v-icon>
														</v-btn>
													</template>
													<span>Delete <br/> Technical Demo</span>
												</v-tooltip> 
												</v-card-actions>
											</v-card>
										</v-card-text>
									</div>
									<v-card-text class="justify-center" color="#fcfcfc">
										<v-file-input 
											type="file" 
											v-model="demoVidFile" 
											outlined 
											auto-grow 
											counter 
											:rules="rulesDemoVid"
											accept=".mp4, .ogg, .webm" 
											label="Upload Demo Video"
											color="primary"
											prepend-icon="mdi-file-video-outline"
										></v-file-input>
									</v-card-text>
									<v-card-actions class="justify-center">
										<v-btn text :disabled="!validDemoVid" color="primary" @click="upload('demoVid')">Upload</v-btn>
									</v-card-actions>
								</v-card>
							</v-col>
							<v-col cols="12" sm="12" md="6" lg="4" xl="4">
								<v-card flat outlined color="#fcfcfc">
									<div v-if="presVid !== undefined">
										<v-card-title class="justify-center">Product Presentation Video</v-card-title>
										<v-divider></v-divider>
										<v-card-text class="justify-center">
											<v-card outlined flat >
												<video
													:src="presVid.data" 
													width="100%"
													controls
												></video>
												<v-card-actions>
												<v-spacer></v-spacer>
												<v-tooltip v-model="showDownloadVideo" bottom>
													<template v-slot:activator="{ on }">
														<v-btn icon v-on="on" @click="download(presVid.uuid)">
															<v-icon color="primary">mdi-arrow-down</v-icon>
														</v-btn>
													</template>
													<span>Download <br/>Presentation Video</span>
												</v-tooltip> 
												<v-tooltip v-model="showDeleteVideo" bottom>
													<template v-slot:activator="{ on }">
														<v-btn icon v-on="on" @click="deleteObj(presVid.uuid)">
															<v-icon color="primary">mdi-delete</v-icon>
														</v-btn>
													</template>
													<span>Delete <br/>Presentation Video</span>
												</v-tooltip> 
												</v-card-actions>
											</v-card>
										</v-card-text>
									</div>
									<v-card-text class="justify-center">
										<v-file-input 
											type="file" 
											v-model="presVidFile" 
											outlined 
											auto-grow 
											counter 
											:rules="rulesPresVid"
											accept=".mp4, .ogg, .webm" 
											label="Upload Presentation Video"
											color="primary"
											prepend-icon="mdi-video-account"
										></v-file-input>
									</v-card-text>
									<v-card-actions class="justify-center">
										<v-btn text :disabled="!validPresVid" color="primary" @click="upload('presVid')">Upload</v-btn>
									</v-card-actions>
								</v-card>
							</v-col>
						</v-row>

						<v-divider></v-divider>
						
						<v-row align="center" justify="center" no-gutters style="margin-top: 20px; margin-bottom: 20px;">
							<v-col cols="12" sm="12" md="8" lg="8" xl="8">
								<v-card flat outlined color="#fcfcfc" align="center" justify="center">
									<div v-if="logo !== undefined" >
										<v-card-title align="center" justify="center">Product Logo</v-card-title>
										<v-divider></v-divider>
										<v-card-text align="center" justify="center">
											<div style="max-width: 200px;">
												<v-card outlined flat >
													<v-hover v-slot:default="{ hover }" >
														<v-card flat color="#fcfcfc" @click="extendImage(logo.data)"  rounded :elevation="hover ? 16 : 0">
															<v-img :src="logo.data" max-width="200" max-height="200"  ></v-img>
														</v-card>
													</v-hover>

													<v-card-actions>
													<v-spacer></v-spacer>
													<v-tooltip v-model="showDownloadLogo" bottom>
														<template v-slot:activator="{ on }">
															<v-btn icon v-on="on" @click="download(logo.uuid)">
																<v-icon color="primary">mdi-arrow-down</v-icon>
															</v-btn>
														</template>
														<span>Download <br/> Logo</span>
													</v-tooltip> 
													<v-tooltip v-model="showDeleteLogo" bottom>
														<template v-slot:activator="{ on }">
															<v-btn icon v-on="on" @click="deleteObj(logo.uuid)">
																<v-icon color="primary">mdi-delete</v-icon>
															</v-btn>
														</template>
														<span>Delete <br/>Logo</span>
													</v-tooltip> 
													</v-card-actions>
												</v-card>
											</div>
										</v-card-text>
									</div>
									<v-card-text>
										<v-file-input 
											type="file" 
											v-model="logoFile" 
											outlined 
											auto-grow 
											counter 
											:rules="rulesLogo"
											accept="image/*" 
											label="Upload Logo"
											color="primary"
											prepend-icon="mdi-camera"
										></v-file-input>
									</v-card-text>
									<v-card-actions class="justify-center">
										<v-btn :disabled="!validLogo" text color="primary" @click="upload('logo')">Upload</v-btn>
									</v-card-actions>
								</v-card>
							</v-col>
							
						</v-row>
						
						<v-divider></v-divider>
						
						<v-row align="center" justify="center" no-gutters style="margin-top: 20px; margin-bottom: 20px;">
							<v-col cols="12" sm="12" md="8" lg="10" xl="10">
								<v-card outlined flat color="#fcfcfc">
									<div v-if="images.length > 0">
										<v-card-title class="justify-center">Product Images</v-card-title>
										<v-card-text>
											<v-row>
												<v-col v-for="image in images" :key="image.uuid">
													<div style="max-width: 200px;">
														<v-card outlined flat>
															<v-hover v-slot:default="{ hover }">
																<v-card style="max-width: 200px;"  flat color="#fcfcfc" @click="extendImage(image.data)" rounded :elevation="hover ? 16 : 0">
																	<v-img class="align-end" :src="image.data" max-width="200" max-height="200"></v-img>
																</v-card>
															</v-hover>

															<v-card-actions>
															<v-spacer></v-spacer> 
															<v-btn icon @click="download(image.uuid)">
																<v-icon color="primary">mdi-arrow-down</v-icon>
															</v-btn>
															<v-btn icon color="primary" @click="deleteObj(image.uuid)">
																<v-icon>mdi-delete</v-icon>
															</v-btn>
															</v-card-actions>
														</v-card>
													</div>
												</v-col>
											</v-row>
										</v-card-text>
									</div>
									<v-card-text>
										<v-file-input 
											type="file" 
											v-model="imgFiles" 
											outlined 
											auto-grow 
											counter
											:rules="rulesFiles"
											accept="image/*" 
											label="Upload Product Images"
											color="primary"
											prepend-icon="mdi-camera-burst"
										></v-file-input>
									</v-card-text>
									<v-card-actions class="justify-center">
										<v-btn :disabled="!validFiles" text color="primary" @click="upload('files')">Upload</v-btn>
									</v-card-actions>
								</v-card>
							</v-col>
						</v-row>
					</v-container>
					<v-container v-else>
						<v-card flat outlined color="#fcfcfc" class="justify-center">
							<v-card-text class="justify-center">
								<v-row align="center" justify="center">
									<strong color="accent">Your upload is being processed, this might take a few minutes.</strong>
								</v-row>
								<v-row align="center" justify="center">
									<strong color="accent">Please do not close or refresh the page!</strong>
								</v-row>
							</v-card-text>
						</v-card>
						<v-card flat outlined color="#fcfcfc" v-if=" Math.floor(partTotal) < 100">
							<v-progress-linear 
								v-model="partTotal"
								height="25"
								color="accent"
								>
								<strong>{{ Math.floor(partTotal) }}%</strong>
							</v-progress-linear>
						</v-card>
						<v-card class="justify-center" flat outlined color="#fcfcfc" v-else>
							<v-card-text class="justify-center">
								<v-row align="center" justify="center">
									<v-progress-circular
									:size="50"
									color="accent"
									indeterminate
									></v-progress-circular>
								</v-row>	
							</v-card-text>
						</v-card>
					</v-container>
					<v-divider style="margin-bottom: 30px;"></v-divider>
		

					<div class="details">Pending English Description</div>
					<v-textarea 
						v-model="pending_descr_ENG" 
						outlined 
						auto-grow 
						rows="4" 
						:rules="rulesDesc"
						no-resize counter="600"
					></v-textarea>

					<div class="details">Pending Romanian Description</div>
					<v-textarea 
						v-model="pending_descr_RO" 
						outlined 
						auto-grow 
						rows="4"
						:rules="rulesDesc"
						no-resize counter="600"
					></v-textarea>

					<v-row>
						<v-col cols="4">
							<div class="details">Website Link</div>
							<v-text-field
								v-model="link_website"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-web"
							></v-text-field>
						</v-col>
						<v-col cols="4">
							<div class="details">Linkedin</div>
							<v-text-field
								v-model="link_linkedin"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-linkedin"
							></v-text-field>									
						</v-col>
						<v-col cols="4">
							<div class="details">Facebook Link</div>	
							<v-text-field
								v-model="link_facebook"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-facebook"
							></v-text-field>
						</v-col>
					</v-row>
					<v-layout class="justify-center">
						<v-btn :disabled="!productValid" color="primary" @click="updateProduct()">Update Product</v-btn>
					</v-layout>
				</v-form>
			</v-card>
			<SnackBar :options="snackOptions" :snackbar="snackbar" @update-prop="update"></SnackBar>
			<v-dialog v-model="extendDialog" max-width="900">
				<v-card flat max-width="900">
					<v-img :src="extendedImage"></v-img>
					<v-card-actions class="justify-center">
						<v-btn text color="primary" @click="extendDialog=false">Exit</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-container>
		<v-container v-else>
			<v-row class="justify-center">
				<v-col>
					<v-progress-circular
					:size="250"
					color="primary"
					indeterminate
					></v-progress-circular>
				</v-col>
			</v-row>
		</v-container>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Team, Product, WorkshopDay, BusinessTrack, TeamType, ProductDetails } from "../../common";
import { SnackBarOptions, SnackBarTypes } from "@startupway/menu/lib/ui";
import { v4 as uiidv4} from "uuid";
import { UI } from '@startupway/main/lib/ui';
export default Vue.extend({
	name: "ProductSummary",
	async mounted() {
		const _varToString = (varObj: Object): string => Object.keys(varObj)[0];
		let name = _varToString({ BusinessTrack });
		this._enumToData(BusinessTrack, name);
		name = _varToString({ TeamType });
		this._enumToData(TeamType, name);
		name = _varToString({ WorkshopDay });
		this._enumToData(WorkshopDay, name);
		try {
			await this.ui.storeDispatch("teams/loadProduct", this.teamId);
		} catch (e) {
			console.error(e);
		}
	},
	watch: {
		currentTeam: {
			immediate: true,
			async handler(newTeam: Team):Promise<void> {
				this.teamId = newTeam.teamId;
				if (this.teamId === "") {
					if(this.$route.path!=="/workspace")
						this.$router.push("/workspace");
				} else {
					try {
						await this.ui.storeDispatch("teams/loadProduct", this.teamId);
					} catch (e) {
						console.error(e);
					}
				}
			}
		},
		product: {
			immediate: false,
			async handler(newProduct: Product):Promise<void> {
				if(newProduct.productId !== undefined && newProduct.productId !== "") {
					this.productId = newProduct.productId;
					if(newProduct.pendingDescriptionRO === "")
						this.pending_descr_RO = newProduct.descriptionRO;
					else
						this.pending_descr_RO = newProduct.pendingDescriptionRO
					if(newProduct.pendingDescriptionEN === "")
						this.pending_descr_ENG = newProduct.descriptionEN;
					else
						this.pending_descr_ENG = newProduct.pendingDescriptionEN;
	
					this.startupName = newProduct.startupName;
					this.businessTrack = newProduct.businessTrack; 
					this.teamType = newProduct.teamType; 
					this.workshop_day = newProduct.workshopDay;
					this.descr_ENG = newProduct.descriptionEN; 
					this.descr_RO = newProduct.descriptionRO; 
					this.last_presentation = newProduct.productDetails["presentation"];
					this.link_website = newProduct.productDetails["website"];
					this.link_linkedin = newProduct.productDetails["linkedin"];
					this.link_facebook = newProduct.productDetails["facebook"];
					this.assessment12Oct = newProduct.productDetails["assessment12Oct"];
					this.assessment20May = newProduct.productDetails["assessment20May"];

					let response = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/image/"+ newProduct.productId);

					if(response.data) {
						this.images = response.data;
					}
					response = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/logo/"+ newProduct.productId);
					if(response.data) {
						this.logo = response.data[0];
					}
					response = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/demoVid/"+ newProduct.productId);
					if(response.data) {
						this.demoVid = response.data[0];
					}
					response = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/presVid/"+ newProduct.productId);
					if(response.data) {
						this.presVid = response.data[0];
					}
					response = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/pres/"+ newProduct.productId);
					if(response.data) {
						this.pres = response.data[0];
					}
				}
			}
		},
		//FILE upload
		presFile: {
			immediate:false,
			handler(newFile):void {
				if(newFile!== undefined){
					if(newFile.size < 314572800) {
						this.validPres = true;
					} else this.validPres = false;
				} else {
					this.validPres = false;
				}			
			}
		},
		presVidFile: {
			immediate:false,
			handler(newFile):void {
				if(newFile!== undefined){
					if(newFile.size < 314572800) {
						this.validPresVid = true;
					} else 
					this.validPresVid = false;
				} else {
					this.validPresVid = false;
				}			
			}
		},
		demoVidFile: {
			immediate:false,
			handler(newFile):void {
				if(newFile!== undefined){
					if(newFile.size < 314572800) {
						this.validDemoVid = true;
					} else 
					this.validDemoVid = false;
				} else {
					this.validDemoVid = false;
				}			
			}
		},
		logoFile: {
			immediate:false,
			handler(newFile):void {
				if(newFile!== undefined){
					if(newFile.size < 314572800) {
						this.validLogo = true;
					} else 
						this.validLogo = false;
				} else {
					this.validLogo = false;
				}			
			}
		},
		imgFiles: {
			immediate:false,
			handler(newFiles):void {
				if(newFiles !== undefined) {
				//if(newFiles.length > 0 && newFiles.length < 10){
					//for(const file of newFiles) {
						if(newFiles.size < 314572800) {
							this.validFiles = true;
						} else {
							this.validFiles = false;
						}
					//}
				} else {
					this.validFiles = false;
				}			
			}
		}
	},
	computed: {
		...mapGetters({
			currentTeam: "teams/currentTeam",
			product: "teams/product"
		}),
	},
	data() {
		return {
			ui: UI.getInstance(),
			//Page Loadings and Dialogs
			productValid:true,
			loadingUpload:false,
			loadingPage:false,
			extendedImage: "",
			extendDialog: false,
			//Enums
			teamTypes: [],
			businessTracks: [],
			workshopDays: [],
			workshops: [],
			teamId: "",
			productId: "",
			//Product settings
			startupRules: [
				(value: string) => {
					if(value && value.length > 0) 
						return true;
					else
						return "Team needs a name";
				},
        	],
			startupName: "" as string,
			businessTrack: "" as string, //enum
			teamType: "" as string, //enum
			workshopDay: WorkshopDay,
			workshop_day: "" as string,
			workshop_nr: "" as string,
			descr_ENG: "" as string, //600char
			descr_RO: "" as string, //600char
			last_presentation: "" as string,
			link_website: "" as string,
			link_linkedin: "" as string,
			link_facebook: "" as string,
			assessment12Oct: "" as string,
			assessment20May: "" as string,
			pending_descr_RO: "" as string,
			pending_descr_ENG: "" as string,
			//File upload
			rulesPres: [
				(value:File) => !value || value.size < 314572800 || 'File size should be less than 300mb!',
			],
			rulesDemoVid: [
				(value:File) => !value || value.size < 314572800 || 'File size should be less than 300mb!',
			],
			rulesPresVid: [
				(value:File) => !value || value.size < 314572800 || 'File size should be less than 300mb!',
			],
			// rulesFiles: [
			// 	(array:File[]) => !array || array.length < 10 || 'No more than 10 files at once',
			// ],
			rulesFiles: [
				(value:File) => !value || value.size < 314572800 || 'File size should be less than 300mb!',
			],
			rulesLogo: [
				(value:File) => !value || value.size < 314572800 || 'File size should be less than 300mb!',
			],
			rulesDesc: [
				(value:string) => !value || value.length <= 600 || 'Description must have at most 600 characters',
			],
			validPres:false,
			validDemoVid:false,
			validPresVid:false,
			validLogo:false,
			validFiles:false,
			presFile:undefined as File | undefined,
			demoVidFile:undefined as File | undefined,
			presVidFile:undefined as File | undefined,
			logoFile:undefined as File | undefined,
			imgFiles:undefined as File | undefined,
			uuidTemp:"",
			partTotal:"" as number | string,
			parts:0,
			increment:0,
			//File Display
			images:[] as {data:string,type:string,ext:string,uuid:string}[],
			logo:{} as {data:string,type:string,ext:string,uuid:string},
			presVid:{} as {data:string,type:string,ext:string,uuid:string},
			demoVid:{} as {data:string,type:string,ext:string,uuid:string},
			pres:{} as {data:string,type:string,ext:string,uuid:string},
			showDeletePresentation: false,
			showDownloadPresentation: false, 
			showDeleteVideo: false,
			showDownloadVideo: false, 
			showDeleteDemo: false,
			showDownloadDemo: false, 
			showDeleteLogo: false,
			showDownloadLogo: false, 
			//SnackBar popup
			snackOptions: {
				text:"",
				type:"info",
				timeout:2000
			} as SnackBarOptions,
			snackbar:false,
		};
	},
	methods: {
		// as any to transform enum to data property
		_enumToData(enumData: any, name: string):void {
			name = name.replace(/^\w/, c => c.toLowerCase()) + "s";
			for (const propName in enumData) {
				if (propName !== "NONE") ((this as any)[name] as Array<Object>).push(enumData[propName]);
			}
		},
		extendImage(image: string):void {
			this.extendedImage = image;
			this.extendDialog = true;
		},
		async refreshLoads():Promise<void>{
			let response = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/image/"+ this.productId);
			if(response.data) {
				this.images = response.data;
			}
			response = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/logo/"+ this.productId);
			if(response.data) {
				this.logo = response.data[0];
			}
			response = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/demoVid/"+ this.productId);
			if(response.data) {
				this.demoVid = response.data[0];
			}
			response = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/presVid/"+ this.productId);
			if(response.data) {
				this.presVid = response.data[0];
			}
			response = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/pres/"+ this.productId);
			if(response.data) {
				this.pres = response.data[0];
			}
		},
		formatDate(date: Date):string {
			const time  = (new Date(date)).toTimeString().split(" ");
			if(new Date(date).toString() === "Invalid Date")
				return "";
			else
				return (new Date(date)).toDateString() + " " + time[0];
		},
		async updateProduct():Promise<void> {
			this.loadingPage = true;
			const productDetails: ProductDetails = {
				website: this.link_website,
				linkedin: this.link_linkedin,
				facebook: this.link_facebook,
				assessment12Oct:this.assessment12Oct,
				assessment20May:this.assessment20May
			};
			if(this.pending_descr_RO === this.product.descriptionRO)
				this.pending_descr_RO = "";
			if(this.pending_descr_ENG === this.product.descriptionEN)
				this.pending_descr_ENG = "";
				const product:Product = {
					productId: this.productId,
					mentorId: this.product.mentorId,
					startupName: this.startupName,
					businessTrack: (this.businessTrack as any),
					teamType: this.teamType as any,
					workshopDay: this.workshop_day as any,
					descriptionRO: this.descr_RO,
					descriptionEN: this.descr_ENG,
					pendingDescriptionEN: this.pending_descr_ENG,
					pendingDescriptionRO: this.pending_descr_RO,
					productDetails: productDetails,
					updatedAt: new Date(this.formatDate(new Date())),
					lastMentorUpdate: new Date()
				};
			try {
				await this.ui.storeDispatch("teams/updateProduct", {
					product: product,
					teamId: this.teamId
				});
			} catch (e) {
				console.error(e);
			}
			this.loadingPage = false;
		},
		async upload(type:string):Promise<void> {
			try {
				if(type === "logo" && this.logoFile)
					await this.parseFile(this.logoFile,"logo",0);
				else if(type === "presVid" && this.presVidFile) 
					await this.parseFile(this.presVidFile,"presVid",0);
				else if(type === "demoVid" && this.demoVidFile) 
					await this.parseFile(this.demoVidFile,"demoVid",0);
				else if(type === "pres" && this.presFile) 
					await this.parseFile(this.presFile,"pres",0);
				else if(type === "files" && this.imgFiles) {
					await this.parseFile(this.imgFiles,"image",0);
					// for(const file of this.imgFiles) {
					// 	const ret = await this.parseFile(file,"image",0);
					// 	if(ret) {
					// 		continue;
					// 	} else {
					// 		this.snackOptions.text = "Could not upload the file: " + file.name + ", please try make sure the image has a resolution of at least 1920x1080 pixels. If the error persists, please contact technical support: teams@tech-lounge.ro";
					// 		this.snackOptions.type = SnackBarTypes.ERROR;
					// 		this.snackOptions.timeout = 2000;
					// 		this.snackbar = true;
					// 		this.partTotal = "";
					// 		this.parts = 0;
					// 		this.increment = 0;
					// 		break;
					// 	}
					// }
					// this.loadingUpload = false;
				}
			} catch (error) {
				console.error (error);
			}
		},
		update(prop:boolean):void {
			this.snackbar = prop;
		},
		async deleteObj(uuid:string):Promise<void> {
			try {
				const response = await this.ui.api.post<boolean>("/api/v1/uploadDownload/delete/file", {uuid:uuid});
				if(response.data) {
					this.snackOptions.text = "Delete Successful";
					this.snackOptions.type = SnackBarTypes.SUCCESS;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
					this.loadingPage = false;
					await this.ui.storeDispatch("teams/loadProduct", this.teamId);
				}
			} catch (e) {
				console.error(e);
				this.snackOptions.text = "Server Error. If the error persists, please contact technical support: teams@tech-lounge.ro.";
				this.snackOptions.type = SnackBarTypes.ERROR;
				this.snackOptions.timeout = 2000;
				this.snackbar = true;
				this.loadingPage = false;
			}
		},
		async download(uuid:string):Promise<void> {
			try {
				const response = await this.ui.api.get<string | null>("/api/v1/uploadDownload/download/file/"+uuid);
				if(response.data) {
					const url = response.data;
					window.open(url, '_blank');
				} else {
					console.error("No Download");
				}
			} catch (e) {
				console.error(e);
			}
		},

		async parseFile(file:File,type:string, offset:number):Promise<void> {
			try {
				this.loadingUpload = true;
				const fileSize   = file.size;
				const chunkSize  = 1000000  ; // bytes
				if(this.partTotal === "") {
					this.partTotal = 0;
					this.parts = fileSize/chunkSize;
					this.increment = (100 * chunkSize)/fileSize;
				}
				const reader = new FileReader();
				let blob:Blob | null = null;
				if(this.uuidTemp === "") {
					this.uuidTemp = uiidv4() + "." + file.name.split('.').pop();
				}
				if(offset < fileSize)
					blob = file.slice(offset, chunkSize + offset);
				if(blob) {
					reader.readAsDataURL(blob);
					reader.onload = async () => {
						if(reader.result) {
							const result:string[] = reader.result.toString().split(",");
							this.ui.api.post<boolean>("/api/v1/uploadDownload/upload/file/chunk", {
								finish:false,
								fileName: this.uuidTemp,
								base64Encode:result[1],
								productId:this.product.productId,
								fileType:type,
								ext:file.name.split('.').pop(),
								nr:(chunkSize + offset)/chunkSize
							// as any -> not used
							}).then( async (resp:any) => {
								(this.partTotal as number) +=this.increment;
								await this.parseFile(file,type,chunkSize+offset)
							});
						}
					};
					reader.onerror = (err) => {
						console.error(err);
						this.snackOptions.text = "Could not upload the file, please try again later. If the error persists, please contact technical support: teams@tech-lounge.ro";
						this.snackOptions.type = SnackBarTypes.INFO;
						this.snackOptions.timeout = 2000;
						this.snackbar = true;
						this.loadingUpload = false;
						this.partTotal = "";
						this.parts = 0;
						this.increment = 0;
					};
				} else {
					const response = await this.ui.api.post<boolean>("/api/v1/uploadDownload/upload/file/chunk", {
						finish:true,
						fileName: this.uuidTemp,
						base64Encode:"",
						productId:this.product.productId,
						fileType:type,
						ext:file.name.split('.').pop()
					})
					if(response.data) {
						this.snackOptions.text = "Upload Successful";
						this.snackOptions.type = SnackBarTypes.SUCCESS;
						this.snackOptions.timeout = 2000;
						if(type === "presVid") {
							this.presVidFile = undefined;
						} else if(type === "demoVid") {
							this.demoVidFile = undefined;
						} else if(type === "pres") {
							this.presFile = undefined;
						} else if(type === "logo") {
							this.logoFile = undefined;
						}
						this.snackbar = true;
						this.loadingUpload = false;
						this.uuidTemp = "";
						this.partTotal = "";
						this.parts = 0;
						this.increment = 0;
						await this.refreshLoads();
					} else {
						this.snackOptions.text = "Could not upload the file, please try again later. If the error persists, please contact technical support: teams@tech-lounge.ro";
						this.snackOptions.type = SnackBarTypes.INFO;
						this.snackOptions.timeout = 2000;
						this.snackbar = true;
						this.loadingUpload = false;
						this.uuidTemp = "";
						this.partTotal = "";
						this.parts = 0;
						this.increment = 0;
					}
				}
			} catch (e) {
				console.error(e);
				if( e.response.status === 406) {
					this.snackOptions.text = "Could not upload the file. Please upload only files in full HD format. If the error persists, please contact technical support: teams@tech-lounge.ro.";
					this.snackOptions.type = SnackBarTypes.ERROR;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
					this.loadingUpload = false;
					this.uuidTemp = "";
					this.partTotal = "";
					this.parts = 0;
					this.increment = 0;
				} 
				else {
					this.snackOptions.text = "Server Error. If the error persists, please contact technical support: teams@tech-lounge.ro.";
					this.snackOptions.type = SnackBarTypes.ERROR;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
					this.loadingUpload = false;
					this.uuidTemp = "";
					this.partTotal = "";
					this.parts = 0;
					this.increment = 0;
				}
			}
			
				
		},
	}
});
</script>
