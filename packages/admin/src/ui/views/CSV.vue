<template>
	<v-app>
		<v-card flat min-width="500">
			<v-card max-height="60" dark style="background-color:#ffb100">
				<v-card-title class="justify-center">Imports</v-card-title>
			</v-card>
			<v-container>
				<v-row>
					<v-col>
						<v-card min-width="500">
							<v-card-title  class="justify-center">
								Import Teams CSV
							</v-card-title>
							<v-card-text class="justify-center">
								<v-file-input id="fileImport" type="file" v-model="fileImport" accept=".csv" label="Import CSV input"></v-file-input>
							</v-card-text>
							<v-card-actions class="justify-center">
								<v-btn rounded color="primary" @click="submitFileImport()" :disabled="encodedImport">
									<v-icon>mdi-upload</v-icon>	Submit
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<v-card min-width="500">
							<v-card-title class="justify-center">
								Import Teams Description CSV
							</v-card-title>
							<v-card-text class="justify-center">
								<v-file-input id="fileUpdate" type="file" v-model="fileUpdate" accept=".csv" label="Update CSV input"></v-file-input>
							</v-card-text>
							<v-card-actions class="justify-center">
								<v-btn rounded color="primary" @click="submitFileUpdate()" :disabled="encodedUpdate">
									<v-icon>mdi-upload</v-icon>	Submit
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
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
			fileImport:(undefined  as unknown) as File,
			fileUpdate:(undefined  as unknown) as File,
			encodedImport:false,
			encodedUpdate:false,
			base64EncodeImport:"" as string,
			base64EncodeUpdate:"" as string,
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
					}
				}
			}
		},
		base64EncodeImport: {
			immediate:true,
			handler (newBase64EncodeImport):void {
				if(newBase64EncodeImport !== '' && newBase64EncodeImport !== undefined) {
					this.encodedImport = false;
				} else {
					this.encodedImport = true;
				}
			}
		},
		base64EncodeUpdate: {
			immediate:true,
			handler (newBase64EncodeUpdate):void {
				if(newBase64EncodeUpdate !== '' && newBase64EncodeUpdate !== undefined) {
					this.encodedUpdate = false;
				} else {
					this.encodedUpdate = true;
				}
			}
		},
		fileImport: {
			immediate:false,
			handler(newFile):void {
				if(newFile !== undefined) {
					this.toBase64Import(newFile);
				} else {
					this.base64EncodeImport = '';
				}		
			}
		},
		fileUpdate: {
			immediate:false,
			handler(newFile):void {
				if(newFile !== undefined) {
					this.toBase64Update(newFile);
				} else {
					this.base64EncodeUpdate = '';
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
		async submitFileImport():Promise<void> {
			try {
				await this.ui.api.post<unknown>("/api/v1/admin/uploadCSV", {encode: this.base64EncodeImport});		
			} catch (e) {
				console.error(e);
			}
		},
		async submitFileUpdate():Promise<void> {
			try {
				await this.ui.api.post<unknown>("/api/v1/admin/updateDescriptionCSV", {encode: this.base64EncodeUpdate});		
			} catch (e) {
				console.error(e);
			}
		},
		toBase64Import(file:File):boolean {
			const reader = new FileReader();
			if(file) {
				reader.readAsDataURL(file);
				reader.onload = () => {
					const result:string | ArrayBuffer | null  = reader.result;
					if(result) {
						const aux = result.toString().split(",");
						this.base64EncodeImport = aux[1];
					}
				};
				reader.onerror = (err) => {
					console.error(err);
				};
			}
			return true;
		},
		toBase64Update(file:File):boolean {
			const reader = new FileReader();
			if(file) {
				reader.readAsDataURL(file);
				reader.onload = () => {
					const result:string | ArrayBuffer | null  = reader.result;
					if(result) {
						const aux = result.toString().split(",");
						this.base64EncodeUpdate = aux[1];
					}
				};
				reader.onerror = (err) => {
					console.error(err);
				};
			}
			return true;
		}
	}
});
</script>

<style lang="less">
// @import "../style/vendor.less";
</style>