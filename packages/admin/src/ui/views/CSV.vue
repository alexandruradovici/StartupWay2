<template>
	<v-app>
		<v-card flat style="margin-left: auto; margin-right: auto; padding-top: 20px; background-color: #fcfcfc;" min-width="500">
			<v-card-title class="justify-center" style="font-family: Georgia, serif; font-weight: bold;">Import CSV</v-card-title>
			<v-divider></v-divider>
			<v-card-text class="justify-center">
				<v-file-input type="file" v-model="file" accept=".csv" label="CSV input"></v-file-input>
			</v-card-text>
			<v-card-actions class="justify-center">
				<v-btn rounded color="primary" @click="submitFile()" :disabled="encoded">Submit</v-btn>
			</v-card-actions>
		</v-card>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { User } from "@startupway/users/lib/ui"; 
import { UI } from "@startupway/main/lib/ui";
export default Vue.extend({
	name: "CSV",
	async mounted() {
		
	},
	data() {
		return {
			ui: UI.getInstance(),
			file:(undefined  as unknown) as File,
			encoded:false,
			base64Encode:"" as string,
		};
	},
	watch: {
		user: {
			immediate:true,
			async handler (newUser:User):Promise<void> {
				if(newUser) {
					const role = JSON.parse(this.user.role);
					if(!role["Admin"] && !role["SuperAdmin"]) {
						if(this.$route.path!=="/workspace")
							this.$router.push("/workspace");
					}
				}
			}
		},
		base64Encode: {
			immediate:true,
			handler (base64Encode):void {
				if(base64Encode !== '' && base64Encode !== undefined) {
					this.encoded = false;
				} else {
					this.encoded = true;
				}
			}
		},
		file: {
			immediate:false,
			handler(newFile):void {
				if(newFile !== undefined) {
					this.toBase64(newFile);
				} else {
					this.base64Encode = '';
				}			
			}
		}
	},
	computed: {
		...mapGetters ({
			user:"users/user"
		}),
	},
	methods: {
		async submitFile():Promise<void> {
			try {
				await this.ui.api.post<unknown>("/api/v1/admin/uploadCSV", {encode: this.base64Encode});		
			} catch (e) {
				console.error(e);
			}
		},
		toBase64(file:File):boolean {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				const result = (reader.result as any).toString().split(",");
				(this.base64Encode as any) = result[1];
			};
			reader.onerror = (err) => {
				console.error(err);
			};
			return true;
		}
	}
});
</script>