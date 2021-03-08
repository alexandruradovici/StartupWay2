<template>
	<v-app>
		<v-container v-if="!loadingPage">
			<v-container>
				<v-card flat outlined color="#fcfcfc" class="justify-center">
					<v-card-text class="justify-center">
						<v-row align="center" justify="center">
							<strong color="accent">Note: You can update the business canvas once a day</strong>
						</v-row>
					</v-card-text>
				</v-card>
			</v-container>
			<v-card flat style="margin: auto; margin-top: 50px;"  max-width="1000" color="#fcfcfc">
				<v-divider></v-divider>
				<v-card-text>
					<v-row no-gutters>
						<v-col cols="12" sm="10" md="8" lg="4" xl="4">
							<div style="text-align:center; font-weight: bold; margin-top: 15px;">PROBLEM</div>
							<v-textarea
								required
								:rules="lengthRules"
								v-model="problem"
								:placeholder="canvas.fields['Problem']"
								rows="4"
								no-resize
								counter="250"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-lightbulb-on-outline"
								v-on:keyup="countdown('Problem', problem)"
							></v-textarea>
						</v-col>
						<v-col cols="12" sm="10" md="8" lg="4" xl="4">
							<div style="text-align:center; font-weight: bold; margin-top: 15px;">CUSTOMER SEGMENTS</div>
							<v-textarea
								required
								:rules="lengthRules"
								v-model="segment"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-account-switch"
								:placeholder="canvas.fields['Customer Segments']"
								rows="4"
								no-resize
								counter="250"
								v-on:keyup="countdown('Customer Segments', segment)"
							></v-textarea>
						</v-col>
						<v-col  cols="12" sm="10" md="8" lg="4" xl="4">
							<div style="text-align:center; font-weight: bold; margin-top: 15px;">EXISTING ALTERNATIVES</div>
							<v-textarea
								required
								:rules="lengthRules"
								v-model="alternatives"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-compare"
								:placeholder="canvas.fields['Existing Alternatives']"
								rows="4"
								no-resize
								counter="250"
								v-on:keyup="countdown('Existing Alternatives', alternatives)"
							></v-textarea>
						</v-col>
					</v-row>

					<v-row>
						<v-col cols="12" sm="10" md="8" lg="4" xl="4">
							<div style="text-align:center; font-weight: bold; margin-top: 15px;">EARLY ADAPTORS</div>
							<v-textarea
								required
								:rules="lengthRules"
								v-model="adaptors"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-account-child-outline"
								:placeholder="canvas.fields['Early Adaptors']"
								rows="4"
								no-resize
								counter="250"
								v-on:keyup="countdown('Early Adaptors', adaptors)"
							></v-textarea>
						</v-col>
						<v-col cols="12" sm="10" md="8" lg="4" xl="4">
							<div style="text-align:center; font-weight: bold; margin-top: 15px;">UNIQUE VALUE PROPOSITION</div>
							<v-textarea
								required
								:rules="lengthRules"
								v-model="proposition"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-briefcase"
								:placeholder="canvas.fields['Unique Value Proposition']"
								rows="4"
								no-resize
								counter="250"
								v-on:keyup="countdown('Unique Value Proposition', proposition)"
							></v-textarea>
						</v-col>
						<v-col cols="12" sm="10" md="8" lg="4" xl="4">
							<div style="text-align:center; font-weight: bold; margin-top: 15px;">HIGH-LEVEL CONCEPT</div>
							<v-textarea
								required
								:rules="lengthRules"
								v-model="concept"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-presentation-play"
								:placeholder="canvas.fields['High-Level Concept']"
								rows="4"
								no-resize
								counter="250"
								v-on:keyup="countdown('High-Level Concept', concept)"
							></v-textarea>
						</v-col>
					</v-row>

					<v-row>
						<v-col cols="12" sm="10" md="8" lg="4" xl="4">
							<div style="text-align:center; font-weight: bold; margin-top: 15px;">SOLUTION</div>
							<v-textarea
								required
								:rules="lengthRules"
								v-model="solution"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-flag"
								:placeholder="canvas.fields['Solution']"
								rows="4"
								no-resize
								counter="250"
								v-on:keyup="countdown('Solution', solution)"
							></v-textarea>
						</v-col>
						<v-col cols="12" sm="10" md="8" lg="4" xl="4">
							<div style="text-align:center; font-weight: bold; margin-top: 15px;">UNFAIR ADVANTAGE</div>
							<v-textarea
								required
								:rules="lengthRules"
								v-model="advantage"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-bell-plus-outline"
								:placeholder="canvas.fields['Unfair Advantage']"
								rows="4"
								no-resize
								counter="250"
								v-on:keyup="countdown('Unfair Advantage', advantage)"
							></v-textarea>
						</v-col>
						<v-col cols="12" sm="10" md="8" lg="4" xl="4">
							<div style="text-align:center; font-weight: bold; margin-top: 15px;">COST STRUCTURE</div>
							<v-textarea
								required
								:rules="lengthRules"
								v-model="cost"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-sack-percent"
								rows="4"
								:placeholder="canvas.fields['Cost Structure']"
								no-resize
								counter="250"
								v-on:keyup="countdown('Cost Structure', cost)"
							></v-textarea>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="10" md="8" lg="4" xl="4">
							<div style="text-align:center; font-weight: bold; margin-top: 15px;">CHANNELS</div>
							<v-textarea
								required
								:rules="lengthRules"
								v-model="channels"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-google-circles-extended"
								:placeholder="canvas.fields['Channels']"
								rows="4"
								no-resize
								counter="250"
								v-on:keyup="countdown('Channels', channels)"
							></v-textarea>
						</v-col>
						<v-col cols="12" sm="10" md="8" lg="4" xl="4">
							<div style="text-align:center; font-weight: bold; margin-top: 15px;">KEY METRICS</div>
							<v-textarea
								required
								:rules="lengthRules"
								v-model="metrics"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-key-link"
								:placeholder="canvas.fields['Key Metrics']"
								rows="4"
								no-resize
								counter="250"
								v-on:keyup="countdown('Key Metrics', metrics)"
							></v-textarea>
						</v-col>
						<v-col cols="12" sm="10" md="8" lg="4" xl="4">
							<div style="text-align:center; font-weight: bold; margin-top: 15px;">REVENUE STREAMS</div>
							<v-textarea
								required
								:rules="lengthRules"
								v-model="revenue"
								outlined
								rounded
								color="primary"
								prepend-icon="mdi-account-cash-outline"
								:placeholder="canvas.fields['Revenue Streams']"
								rows="4"
								no-resize
								counter="250"
								v-on:keyup="countdown('Revenue Streams', revenue)"
							></v-textarea>
						</v-col>
					</v-row>
						<div class="error-message" v-if="checkLength">
							Please review the following fields: {{types.join(", ")}}. The character limit is set to 250.
						</div>
				</v-card-text>
				<v-card-actions class="justify-center">
					<v-btn :disabled="checkLength" color="primary" rounded type="submit" @click="updateCanvas()">Submit Canvas</v-btn>
				</v-card-actions>
			</v-card>
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
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { UI } from "@startupway/main/lib/ui";
import { Team, Product} from "@startupway/teams/lib/ui";
import { BModelCanvas, CanvasField } from "../../common";
import { v4 as uiidv4 } from 'uuid';
export default Vue.extend({
	name: "BusinnessCanvasUser",
	async mounted() {
		try {
			this.loadingPage = true;
			await this.ui.storeDispatch("teams/loadProduct", this.teamId);
			let response = await this.ui.api.get<BModelCanvas[]>("/api/v1/canvas/" + this.teamId);
			if (response.data) {
				this.canvases = response.data;
			}
			this.loadingPage = false;
		} catch (e) {
			console.error(e);
		}
	},
	watch: {
		currentTeam: {
			immediate: true,
			async handler(newTeam: Team | null):Promise<void> {
				this.loadingPage = true;
				if(newTeam) {
				this.teamId = newTeam.teamId;
					if (this.teamId === "") {
						if(this.$route.path!=="/workspace")
							this.$router.push("/workspace");
					} else {
						try {
							await this.ui.storeDispatch("teams/loadProduct", this.teamId);
							let response = await this.ui.api.get<BModelCanvas[]>("/api/v1/canvas/" + this.teamId);
							if (response.data) {
								this.canvases = response.data;
							}
						} catch (e) {
							console.error(e);
						}
					}
				}
				this.loadingPage = false;
			}
		},
		product: {
			immediate: true,
			handler(newProduct: Product | null):void {
				if(newProduct)
					this.productId = newProduct.productId;
			}
		},
		canvases: {
			immediate: true,
			handler(newCanvases: BModelCanvas[]):void {
				this.loadingPage = true;
				if (newCanvases.length !== 0) {
					this.canvas = newCanvases[newCanvases.length - 1];
					this.problem = this.canvas.fields["Problem"];
					this.solution = this.canvas.fields["Solution"];
					this.proposition = this.canvas.fields["Unique Value Proposition"];
					this.advantage = this.canvas.fields["Unfair Advantage"];
					this.segment = this.canvas.fields["Customer Segments"];
					this.alternatives = this.canvas.fields["Existing Alternatives"];
					this.metrics = this.canvas.fields["Key Metrics"];
					this.concept = this.canvas.fields["High-Level Concept"];
					this.channels = this.canvas.fields["Channels"];
					this.adaptors = this.canvas.fields["Early Adaptors"];
					this.cost = this.canvas.fields["Cost Structure"];
					this.revenue = this.canvas.fields["Revenue Streams"];
				} else {
					this.canvas = {
						modelId: uiidv4(),
						productId: this.productId,
						date: new Date(),
						fields: {
							["Problem"]: "",
							["Solution"]: "",
							["Unique Value Proposition"]: "",
							["Unfair Advantage"]: "",
							["Customer Segments"]: "",
							["Existing Alternatives"]: "",
							["Key Metrics"]: "",
							["High-Level Concept"]: "",
							["Channels"]: "",
							["Early Adaptors"]: "",
							["Cost Structure"]: "",
							["Revenue Streams"]: ""
						}
					} as BModelCanvas;
				}
				this.loadingPage = false;
			}
		}
	},
	computed: {
		...mapGetters({
			currentTeam: "teams/currentTeam",
			product: "teams/product"
		})
	},
	data() {
		return {
			ui:UI.getInstance(),
			checkLength: false,
			types: [] as string[],
			lengthRules: [(v: string | null) => (v || '' ).length <= 250 || 'Description must be 250 characters or less'],
			loadingPage:false,
			edit: false as boolean,
			teamId: "",
			productId: "",
			canvas: {} as BModelCanvas,
			canvases: [] as BModelCanvas[],
			problem: "" as string,
			segment: "" as string,
			alternatives: "" as string,
			adaptors: "" as string,
			proposition: "" as string,
			concept: "" as string,
			solution: "" as string,
			advantage: "" as string,
			cost: "" as string,
			channels: "" as string,
			metrics: "" as string,
			revenue: "" as string
		};
	},
	methods: {
		countdown(type: string, model: string):void {
			if(model.length > 250) {
				this.checkLength = true;
				if(!this.types.find(el => el === type)) {
					this.types.push(type);
				}
			}
			else {
				if(this.types.find(el => el === type)) {
					this.types = this.types.filter(el => el !== type)
				}
				if(this.types.length === 0)
					this.checkLength = false;
			}
		},
		formatDate(date: Date):string {
			let time  = (new Date(date)).toTimeString().split(" ");
			return (new Date(date)).toDateString() + " " + time[0];
		},
		isToday(someDate: Date):boolean {
			const today = new Date();
			if(typeof someDate === "string") {
				someDate = new Date(someDate);
			}
			return someDate.getDate() == today.getDate() &&
				someDate.getMonth() == today.getMonth() &&
				someDate.getFullYear() == today.getFullYear();
		},
		async updateCanvas():Promise<void> {
			this.loadingPage = true;
			let fields:CanvasField = {
							["Problem"]: this.problem,
							["Solution"]: this.solution,
							["Unique Value Proposition"]: this.proposition,
							["Unfair Advantage"]: this.advantage,
							["Customer Segments"]: this.segment,
							["Existing Alternatives"]: this.alternatives,
							["Key Metrics"]: this.metrics,
							["High-Level Concept"]: this.concept,
							["Channels"]: this.channels,
							["Early Adaptors"]: this.adaptors,
							["Cost Structure"]: this.cost,
							["Revenue Streams"]: this.revenue
						} 
			let canvas = {
				modelId: uiidv4(),
				date: new Date(),
				productId: this.productId,
				fields: fields
			} as BModelCanvas;
			try {
				const response = await this.ui.api.post<BModelCanvas | null>("/api/v1/canvas/" + this.teamId, canvas);
				if (response.data) {
					let res = await this.ui.api.get<BModelCanvas[]>("/api/v1/canvas/" + this.teamId);
					if (res.data) {
						this.canvases = res.data;
					}
					this.problem = "";
					this.segment = "";
					this.alternatives = "";
					this.adaptors = "";
					this.proposition = "";
					this.concept = "";
					this.solution = "";
					this.advantage = "";
					this.cost = "";
					this.channels = "";
					this.metrics = "";
					this.revenue = "";
				}
			} catch (e) {
				console.error(e);
			}
			try {
				let product = await this.ui.api.get<Product | null>("/api/v1/teams/product/" + this.teamId);
				if(product.data) {
					product.data.updatedAt = (this.formatDate(new Date()) as unknown as Date) ;
					try {
						await this.ui.api.post<Product | null>("/api/v1/teams/product/update", {
							product: product.data,
							upload: "",
							ext: ".pptx",
							teamId: this.teamId
						});
					} catch (e) {
						console.error(e);
					}
				}
			} catch (e) {
				console.error(e);
			}
			this.loadingPage = false;
		}
	}
});
</script>