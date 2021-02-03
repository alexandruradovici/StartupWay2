<template>
	<v-app>
		<v-container class="content" width="1000">
		<div class="component-title">Feed</div>
		<v-card flat style="margin: auto; margin-top: 20px;"  max-width="1000" color="#fcfcfc">
			<v-divider></v-divider>
			<div align="center" style="margin-top: 20px; margin-bottom: 20px;">Please select the type of update you would like to publish.</div>
			<v-container pr-7 pl-7 fluid>
				<v-select v-model="value" :items="items" item-text="name" item-value="value" label="Update"> </v-select>
				<div v-if="value === FeedTypes.INVESTMENT">
					<v-textarea v-model="text" name="Investments" label="Investments" counter="400"></v-textarea>
					<v-text-field v-model="amount" name="Details" label="Amount" counter="10"></v-text-field>
				</div>
				<div v-else-if="value === FeedTypes.AWARD || value === FeedTypes.UPDATE">
					<v-textarea v-model="text" :name="value" :label="value" counter="600"></v-textarea>
				</div>
				<div v-else-if="value === FeedTypes.COLLABORATORS">
					<v-textarea v-model="text" :name="value" :label="value" counter="400"></v-textarea>
				</div>
				<v-card-actions class="justify-center" v-model="value">
					<v-btn color="primary" @click="addFeed()">Submit</v-btn>
				</v-card-actions>
			</v-container>

			<v-container pr-7 pl-7 fluid>
				<v-card v-for="(item, index) in productUpdates" :key="index" class="mb-4">
					<v-card-title style="font-weight: bold;">
						<v-icon large left color="#22542b" v-if="item.feedType===FeedTypes.INVESTMENT">mdi-account-cash</v-icon>
						<v-icon large left color="#e0ac1b" v-if="item.feedType===FeedTypes.AWARD">mdi-trophy</v-icon>
						<v-icon large left color="#9e2219" v-if="item.feedType===FeedTypes.UPDATE">mdi-update</v-icon>
						<v-icon large left color="#202b4f" v-if="item.feedType===FeedTypes.COLLABORATORS">mdi-account-tie</v-icon>
						
						{{ item.feedType }}
						<br/>
					</v-card-title>
					<v-card-subtitle v-if="item && item.date" style="font-size: 15px; font-weight: bold;">
						{{ formatDate(item.date) }}
					</v-card-subtitle>
					<v-card-text>
						<span>{{ item.text["text"] }}</span>
						<v-spacer></v-spacer>
						<span v-if="item.feedType === FeedTypes.INVESTMENT"> Amount:{{ item.text["amount"] }} </span>
					</v-card-text>
				</v-card>
				<v-dialog v-model="editDialog" max-width="450">
			<v-card flat width="450">
				<v-card-title class="justify-center" style="font-family: Georgia, serif; font-weight: bold;">
					Edit {{edited.feedType}} 
				</v-card-title>
				<v-card-subtitle class="justify-center" style="font-weight: bold;">
					{{formatDate(edited.date)}}
				</v-card-subtitle>
				<v-divider></v-divider>
				<v-card-text>
					<div v-if="edited.feedType === FeedTypes.INVESTMENT">
						<v-textarea v-model="text" name="Investments" label="Investments" counter="400"></v-textarea>
						<v-text-field v-model="amount" name="Details" label="Amount" counter="10"></v-text-field>
					</div>
					<div v-else-if="edited.feedType === FeedTypes.AWARD || edited.feedType === FeedTypes.UPDATE">
						<v-textarea v-model="text" :name="edited.feedType" :label="edited.feedType" counter="600"></v-textarea>
					</div>
					<div v-else-if="edited.feedType === FeedTypes.COLLABORATORS">
						<v-textarea v-model="text" :name="edited.feedType" :label="edited.feedType" counter="400"></v-textarea>
					</div>
				</v-card-text>
				<v-card-actions class="justify-center">
					<v-btn icon fab @click="enableEdit(item)">
						<v-icon>mdi-pencil-circle-outline</v-icon>
					</v-btn>
					<v-btn icon fab @click="edited=item, removeDialog=true">
						<v-icon>mdi-close-circle</v-icon>
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="removeDialog" persistent max-width="290">
			<v-card>
				<v-card-title class="justify-center" style="font-family: Georgia, serif;">Remove Feed</v-card-title>
				<v-card-text>Are you sure you want to remove this update form your team's feed list?</v-card-text>
				<v-card-actions class="justify-center">
					<v-btn color="#32a852" text @click="accept(edited)">Yes</v-btn>
					<v-btn color="#a83232" text @click="deny()">No</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		
			</v-container>
		</v-card>
		</v-container>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Feed, FeedText, FeedTypes } from "../../common";
import { UI } from "@startupway/main/lib/ui";
import { mapGetters } from "vuex";
import moment from "moment";
export default Vue.extend({
	name: "ProductFeed",
	async mounted() {
		try {
			await this.ui.storeDispatch("feed/loadFeed", this.teamId);
		} catch (e) {
			console.error(e);
		}
	},
	filters: {
		moment(date: Date) {
			return moment(date).format("MMMM Do YYYY, h:mm:ss a");
		}
	},
	watch: {
		currentTeam: {
			immediate: true,
			// Same as canvas
			async handler(newTeam: any) {
				this.teamId = newTeam.teamId;
				if (this.teamId === 0) {
					if(this.$route.path!=="/workspace")
						this.$router.push("/workspace");
					this.productUpdates = [];
				} else {
					try {
						await this.ui.storeDispatch("feed/loadFeed", this.teamId);
					} catch (e) {
						console.error(e);
					}
				}
			}
		},
		feed: {
			immediate: true,
			handler(newFeed: Feed[]) {
				this.productUpdates = newFeed;
			}
		}
	},
	computed: {
		...mapGetters({
			currentTeam: "teams/currentTeam",
			feed: "feed/feed"
		})
	},
	data() {
		return {
			ui:{} as UI,
			productUpdates: [] as Feed[],
			items: [
				{
					name: "Investments",
					value: FeedTypes.INVESTMENT
				},
				{
					name: "Awards",
					value: FeedTypes.AWARD
				},
				{
					name: "Current Status",
					value: FeedTypes.UPDATE
				},
				{
					name: "Collaborations",
					value: FeedTypes.COLLABORATORS
				}
			],
			teamId: 0 as number,
			value: "" as string,
			text: "" as string,
			amount: "" as string,
			newFeedUpdate: 0 as number,
			FeedTypes: FeedTypes,
			editDialog: false,
			edited: {} as any,
			removeDialog: false
		};
	},
	methods: {
		accept(feed: Feed):void {
			this.deleteFeed(feed);
			this.removeDialog = false;
		},
		deny():void {
			this.removeDialog = false;
		},
		async deleteFeed(feed: Feed):Promise<void> {
			try {
				let response = await this.ui.storeDispatch("feed/deleteFeed", feed);
				if (response) {
					await this.ui.storeDispatch("feed/loadFeed", feed.teamId);
				}
			} catch (e) {
				console.error(e);
			}
			this.$forceUpdate();
			
		},
		async updateFeed(feed: Feed):Promise<void> {
			let details = {} as FeedText;
			if (this.amount !== "" && feed.feedType === FeedTypes.INVESTMENT) {
				details["amount"] = this.amount;
			}
			details["text"] = this.text;
			try {
				let response = await this.ui.api.post<Feed | null>("/api/v1/feed/update", {
					newFeed: {
						feedId: feed.feedId,
						feedType: feed.feedType,
						teamId: feed.teamId,
						text: details,
						date: feed.date,
					} as Feed
				});	
				if (response.data) {
					await this.ui.storeDispatch("feed/loadFeed", feed.teamId);
				}
			} catch (e) {
				console.error(e);
			}

				this.editDialog=false;
				this.edited = null;
			
			this.text = "";
			this.amount = "";
		},
		enableEdit(feed: Feed):void {
			this.editDialog=true;
			this.edited = feed;
		},
		denyActivity():void {
			this.edited = {};
			this.editDialog = false;
		},
		moment() {
			return moment();
		},
		formatDate(date: Date):string {
			let time  = (new Date(date)).toTimeString().split(" ");
			return (new Date(date)).toDateString() + " " + time[0];
		},
		async addFeed():Promise<void> {
			let details = {} as FeedText;
			if (this.amount !== "" && this.value === "Investment") {
				details["amount"] = this.amount;
			}
			details["text"] = this.text;
			let feed = {
				teamId: this.teamId,
				feedType: this.value,
				text: details,
				date: new Date()
			} as Feed;
			try {
				let response = await this.ui.storeDispatch("feed/addFeed", feed);
				if (response) {
					await this.ui.storeDispatch("feed/loadFeed", this.teamId);
				}
			} catch (e) {
				console.error(e);
			}
			try {
				// same as canvas
				let product = await this.ui.api.get<any | null>("/api/v1/teams/product/" + this.teamId);
				if(product.data) {
					product.data.updatedAt = (this.formatDate(new Date()) as unknown as Date) ;
					try {
						// same as canvas
						await this.ui.api.post<any | null>("/api/v1/teams/product/update", {
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
		}
	}
});
</script>