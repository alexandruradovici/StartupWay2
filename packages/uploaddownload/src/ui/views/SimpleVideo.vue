<template>
	 <video v-if="isVideo" 
		ref="videoRef" 
		:src="videoSource" 
		:type="videoType"
		:width="width"
		:height="height"
		controls
	 >
	 </video>
	 <v-img v-else :src="noVideoImage"> 

	 </v-img>
</template>

<script lang="ts">
import Vue from "vue";
import noVideo from "../img/no_video.png";
import { UI } from '@startupway/main/lib/ui';
export default Vue.extend({
	name: "SimpleVideo",
	props: {
		productId: {
			required: true,
			type: Number
		},
		type: {
			required: true,
			type: String
		},
		width: {
			required: true,
			type:String,
		},
		height: {
			required: true,
			type:String,
		},
	},
	watch: {
		extension() {
			switch (this.extension) {
				case "mp4":
					this.videoType = "video/mp4";
					break;
				case "ogg":
					this.videoType = "video/ogg";
					break;
				case "webm":
					this.videoType = "video/webm";
					break;
				default:
					this.videoType = "video/mp4";
					break;
			}
		},
		async productId() {
			await this.getVideo(this.productId, this.type);
		}
	},
	data() {
		return {
			ui: UI.getInstance(),
			videoSource:"",
			extension:"",
			videoType:"",
			uuid:"",
			typeV:"",
			isVideo:false,
			noVideoImage:noVideo
		};
	},
	methods: {
		async getVideo(productId:number,type:string) {
			try {
				let response = await this.ui.api.get("/api/v1/uploadDownload/get/file/product/"+ this.type +"/"+ this.productId)
				if(response.status !== 500) {
					let video = response.data.results[0];
					if(video !== undefined) {
						this.videoSource = video.data;
						this.extension = video.extension;
						this.uuid = video.uuid;
						this.typeV = video.type;
						this.isVideo = true;
					}
				} else {
					this.isVideo = false;
				}
			} catch (e) {
				console.error(e);
			}
		}
		
	}
});
</script>
