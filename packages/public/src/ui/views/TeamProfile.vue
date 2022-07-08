<template>
	<v-app>
		<v-container>
			<v-card color="primary" flat shaped outlined width="100%" class="ma-5">
				<v-card flat shaped outlined width="100%" class="pa-4">
					<div class="details">Startup name</div>
					<v-text-field
						disabled
						outlined
						rounded 
						color="primary" 
						v-model="startupName"> 
					</v-text-field>
					<div class="details">Business Track</div>
					<v-text-field
						disabled
						v-model="businessTrack"
						label="Business Track"
					></v-text-field>
					<div class="details">Team Type</div>
					<v-text-field
						disabled
						v-model="teamType"
						label="Team Type"
					></v-text-field>
					<div class="details">English Description</div>
					<v-textarea 
						outlined 
						color="primary" 
						v-model="descr_ENG" 
						auto-grow 
						disabled
					></v-textarea>
					
					<div class="details">Romanian Description</div>
					<v-textarea 
						outlined 
						color="primary" 
						v-model="descr_RO" 
						auto-grow 
						style="margin-bottom: 20px;"
						disabled
					></v-textarea>
					<v-divider></v-divider>
					<v-container>
						<v-row no-gutters style="margin-top: 20px; margin-bottom: 20px;">
							<v-col cols="12" sm="12" md="12" lg="12" xl="12">
								<v-card flat outlined class="justify-center" >
									<div v-if="pres !== undefined">
										<v-card-title class="justify-center">Power Point Presentation</v-card-title>
										<v-divider></v-divider>
										<v-card-text class="justify-center">
											<v-row align="center" justify="center">
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
								</v-card>
							</v-col>
						</v-row>
						<v-divider></v-divider>
						<v-row v-if="logo !== undefined" align="center" justify="center" no-gutters style="margin-top: 20px; margin-bottom: 20px;">
							<v-col cols="12" sm="12" md="8" lg="8" xl="8">
								<v-card flat outlined  align="center" justify="center">
									<v-card-title align="center" justify="center">Product Logo</v-card-title>
									<v-divider></v-divider>
									<v-card-text align="center" justify="center">
										<div style="max-width: 200px;">
											<v-card outlined flat >
												<v-hover v-slot:default="{ hover }" >
													<v-card flat  @click="extendImage(logo.data)"  rounded :elevation="hover ? 16 : 0">
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
												</v-card-actions>
											</v-card>
										</div>
									</v-card-text>
								</v-card>
							</v-col>
						</v-row>
					</v-container>
					<v-row>
						<v-col cols="3">
							<div class="details"><v-btn text @click="openLink(link_website)">Website Link</v-btn></div>
							<v-text-field
								disabled
								v-model="link_website"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-web"
							></v-text-field>
						</v-col>
						<v-col cols="3">
							<div class="details"><v-btn text @click="openLink(link_linkedin)">Linkedin Link</v-btn></div>
							<v-text-field
								disabled
								v-model="link_linkedin"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-linkedin"
							></v-text-field>									
						</v-col>
						<v-col cols="3">
							<div class="details"><v-btn text @click="openLink(link_facebook)">Facebook Link</v-btn></div>	
							<v-text-field
								disabled
								v-model="link_facebook"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-facebook"
							></v-text-field>
						</v-col>
						<v-col cols="3">
							<div class="details"><v-btn text @click="openLink(link_instagram)">Instagram Link</v-btn></div>
							<v-text-field
								disabled
								v-model="link_instagram"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-instagram"
							></v-text-field>									
						</v-col>
					</v-row>
				</v-card>
			</v-card>
			<v-dialog v-model="extendDialog" max-width="900">
				<v-card flat max-width="900">
					<v-img :src="extendedImage"></v-img>
					<v-card-actions class="justify-center">
						<v-btn text color="primary" @click="extendDialog=false">Exit</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-container>
	</v-app>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import Vue from "vue";
import { UI } from '@startupway/main/lib/ui';
import { Profile } from "../../common/";
export default Vue.extend({
	name: "TeamProfile",
	data() {
		return {
			ui: UI.getInstance(),
			startupName: "" as string,
			businessTrack: "" as string, //enum
			teamType: "" as string, //enum
			descr_ENG: "" as string, //600char
			descr_RO: "" as string, //600char
			last_presentation: "" as string,
			link_website: "" as string,
			link_linkedin: "" as string,
			link_instagram: "" as string,
			link_facebook: "" as string,
			location: "" as string,
			logo:{} as {data:string,type:string,ext:string,uuid:string},
			pres:{} as {data:string,type:string,ext:string,uuid:string},
			extendedImage: "",
			extendDialog: false,
			showDownloadLogo: false,
			showDownloadPresentation: false,
		};
	},
	async mounted() {
		try {
			const teamId = this.$route.params.teamId;
			const profileResponse = await this.ui.api.get<Profile>(`/api/v1/public/profile/${teamId}`);
			if (profileResponse) {
				const details = JSON.parse(profileResponse.data.productDetails.productDetails);
				this.startupName = profileResponse.data.startupName;
				this.businessTrack = profileResponse.data.businessTrack;
				this.location = profileResponse.data.location;
				this.teamType = profileResponse.data.teamTrack;
				this.descr_ENG = profileResponse.data.descriptionEN; 
				this.descr_RO = profileResponse.data.descriptionRO; 
				this.last_presentation = details["presentation"];
				this.link_website = details["website"];
				this.link_linkedin = details["linkedin"];
				this.link_facebook = details["facebook"];
				this.link_instagram = details["instagram"];
			}
			let response = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/public/get/file/product/logo/"+ profileResponse.data.productId);
			if (response.data) {
				this.logo = response.data[0];
			}
			response = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/public/get/file/product/pres/"+ profileResponse.data.productId);
			if (response.data) {
				this.pres = response.data[0];
			}
		} catch (error) {
			console.error(error);
		}
	},
	watch: {
	},
	computed: {
		...mapGetters({
			user: "users/user"
		})
	},
	methods: {
		async download(uuid:string):Promise<void> {
			try {
				const response = await this.ui.api.get<string | null>("/api/v1/public/download/file/"+uuid);
				if (response.data) {
					const url = response.data;
					window.open(url, '_blank');
				} else {
					console.error("No Download");
				}
			} catch (e) {
				console.error(e);
			}
		},
		extendImage(image: string):void {
			this.extendedImage = image;
			this.extendDialog = true;
		},
		openLink(link:string):void {
			let webLink = "";
			if (!link.includes("http://")) {
				webLink = "http://" + link;
			}
			window.open(webLink, "_blank");
		},
	}
});
</script>

<style lang="less">.v-data-table-header {
    background-color: #c7ebe1;
    font-size: 15px;
}
.v-data-table__wrapper {
    /* width: 1000px; */
    margin-top: 100px;
    margin: auto;
}
.v-list-item__title {
    font-size: 16px;
    font-weight: 900;
    
}
.component-title {
    text-align: center;
    font-weight: 800;
    font-size: 22px;
    
    margin-top: 70px;
}
.active-element {
    color: #197E81;
    
    font-size: 20px;
    letter-spacing: 0.6px;
    word-spacing: 2px;
    font-weight: bolder;
    text-decoration: none;
    font-style: normal;
    font-variant: normal;
    text-transform: uppercase;
}
#user-title {
    
    font-size: 20px;
    letter-spacing: 0.6px;
    word-spacing: 2px;
    font-weight: bold;   
}
.content {
    margin: 0;
    position: absolute;
}
.user-name {
    
    font-size: 20px;
    font-weight: 700;
}
.user-details {
    
    font-size: 15px;
    font-weight: 550;
}
.details {
    color: black;
    
    font-size: 17px;   
}
.landing-message {
    font-size:35px;
    font-weight: 600;
    
    text-align: center;
    margin-top: 50px;
}
.image-area {
    /* position: relative; */
    max-width: 250px;
}
.delete-image {
    position: absolute;
    /* top: -100%; */
    left: 80%;
    /* transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%); */
    
}
.nav {
    position: fixed;
}
@media only screen and (max-width: 768px) {
    /* For mobile phones: */
    .nav {
      position: relative;
    }
}
</style>