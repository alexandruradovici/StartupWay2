<template>
	 <v-img v-if="isImage" 
		ref="imageRef" 
		:src="imageSource"
		:width="width"
		:height="height" 
		controls
	 >
	 </v-img>
	 <v-img v-else :src="noImageImage"> 

	 </v-img>
</template>

<script lang="ts">
import Vue from "vue";
import noImage from "../img/no_image.png";
import { UI } from '@startupway/main/lib/ui';
export default Vue.extend({
	name: "SimpleImage",
	props: {
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
		id: {
			required: false,
			type: Number
		},
		data: {
			required:false,
			type:String
		}
	},
	watch: {
		async type() {
			if(this.type === "user") {
				if(this.id !== 0) {
					try {
						let response = await this.ui.api.get("/api/v1/file/user/avatar/"+this.id);
						if(response.status !== 500) {
							this.imageSource = response.data.base64Encode;
							this.isImage = true;
						}
					} catch (e) {
						console.error(e);
						this.isImage = false;
					}
				}
			} else if(this.type === "product") {
				if(this.data !== "") {
					this.imageSource = this.data;
					this.isImage = true;
				} else {
						this.isImage = false;
				}
			}
		}
	},
	data() {
		return {
			ui: UI.getInstance(),
			imageSource:"",
			isImage:false,
			noImageImage:noImage
		};
	},
});
</script>
