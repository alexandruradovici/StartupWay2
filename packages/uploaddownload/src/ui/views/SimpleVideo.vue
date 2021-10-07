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
			type: String
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
		extension():void {
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
		async productId():Promise<void> {
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
		async getVideo(productId:string,type:string):Promise<void> {
			try {
				let response = await this.ui.api.get<{data:string,type:string,ext:string,uuid:string}[] | null>("/api/v1/uploadDownload/get/file/product/"+ this.type +"/"+ this.productId)
				if (response.data) {
					let video = response.data[0];
					if (video !== undefined) {
						this.videoSource = video.data;
						this.extension = video.ext;
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
