<template>
	<div>
		<v-container v-if="!loadingPage" class="content" width="1000">
			<v-container>
				<v-card flat outlined  class="justify-center">
					<v-card-text class="justify-center">
						<v-row align="center" justify="center">
							<strong color="accent">Note: You can update the newsfeed 4 times a day</strong>
						</v-row>
					</v-card-text>
				</v-card>
			</v-container>
			<v-card color="primary" flat shaped outlined width="100%" class="ma-5">
				<v-card flat shaped outlined width="100%" class="pa-4">
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
							<v-card flat width="450" v-if="edited">
								<v-card-title class="justify-center" style=" font-weight: bold;">
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
								<v-card-title class="justify-center" style="">Remove Feed</v-card-title>
								<v-card-text>Are you sure you want to remove this update form your team's feed list?</v-card-text>
								<v-card-actions class="justify-center">
									<v-btn color="#32a852" text @click="accept(edited)">Yes</v-btn>
									<v-btn color="#a83232" text @click="deny()">No</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-container>
				</v-card>
			</v-card>
			<SnackBar :options="snackOptions"  @update-snackbar="updateSnack" :snackbar="snackbar"/>
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
import { Feed, FeedText, FeedTypes } from "../../common";
import { UI } from "@startupway/main/lib/ui";
import { Team, Product } from "@startupway/teams/lib/ui";
import { mapGetters } from "vuex";
import moment from "moment";
import { v4 as uiidv4 } from 'uuid';
import { SnackBarOptions, SnackBarTypes, SnackBarHorizontal, SnackBarVertical } from "@startupway/menu/lib/ui";
interface IProductFeedUser {
	ui:UI,
	productUpdates: Feed[],
	items: {name: string, value:string}[],
	teamId: string,
	value: string,
	text: string,
	amount: string,
	newFeedUpdate: string,
	FeedTypes: typeof FeedTypes,
	editDialog: boolean,
	loadingPage: boolean,
	edited: Feed | null,
	removeDialog: boolean,
	snackbar: boolean,
	snackOptions: SnackBarOptions
}
export default Vue.extend({
	name: "ProductFeedUser",
	async mounted() {
		this.loadingPage = true;
		try {
			await this.ui.storeDispatch("feed/loadFeed", this.teamId);
		} catch (e) {
			console.error(e);
		}
		this.loadingPage = false;
	},
	filters: {
		moment(date: Date) {
			return moment(date).format("MMMM Do YYYY, h:mm:ss a");
		}
	},
	watch: {
		currentTeam: {
			immediate: true,
			async handler(newTeam: Team | null) {
				this.loadingPage = true;
				if (newTeam) {
					this.teamId = newTeam.teamId;
					if (this.teamId === "" || this.teamId === undefined) {
						if (this.$route.path!=="/workspace")
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
				this.loadingPage = false;
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
	data(): IProductFeedUser {
		return {
			ui:UI.getInstance(),
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
			teamId: "",
			value: "",
			text: "",
			amount: "",
			newFeedUpdate: "",
			FeedTypes: FeedTypes,
			editDialog: false,
			loadingPage: false,
			edited: null as Feed | null,
			removeDialog: false,
			snackbar: false,
			snackOptions: {
				text:"",
				type: SnackBarTypes.INFO,
				timeout:2000,
				horizontal: SnackBarHorizontal.RIGHT,
				vertical: SnackBarVertical.BOTTOM
			}
		};
	},
	methods: {
		updateSnack (prop:boolean): void {
			this.snackbar = prop;
		},
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
					this.snackOptions.text = "Feed deleted successfully";
					this.snackOptions.type = SnackBarTypes.SUCCESS;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				}
			} catch (e) {
				console.error(e);
				this.snackOptions.text = "Server Error while Deleting the feed. If the error persists, please contact technical support: teams@tech-lounge.ro.",
				this.snackOptions.type = SnackBarTypes.ERROR;
				this.snackOptions.timeout = 2000;
				this.snackbar = true;
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
					this.snackOptions.text = "Feed deleted successfully";
					this.snackOptions.type = SnackBarTypes.SUCCESS;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				}
			} catch (e) {
				console.error(e);
				this.snackOptions.text = "Server Error while Updating the feed. If the error persists, please contact technical support: teams@tech-lounge.ro.",
				this.snackOptions.type = SnackBarTypes.ERROR;
				this.snackOptions.timeout = 2000;
				this.snackbar = true;
			}

			this.editDialog=false;
			this.edited = null;
			this.value = "";
			this.text = "";
			this.amount = "";
		},
		enableEdit(feed: Feed):void {
			this.editDialog=true;
			this.edited = feed;
		},
		denyActivity():void {
			this.edited = null;
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
				feedId: uiidv4(),
				teamId: this.teamId,
				feedType: this.value,
				text: details,
				date: new Date()
			} as Feed;
			try {
				let response = await this.ui.storeDispatch("feed/addFeed", feed);
				if (response) {
					await this.ui.storeDispatch("feed/loadFeed", this.teamId);
					this.snackOptions.text = "Feed deleted successfully";
					this.snackOptions.type = SnackBarTypes.SUCCESS;
					this.snackOptions.timeout = 2000;
					this.snackbar = true;
				}
			} catch (e) {
				console.error(e);
				this.snackOptions.text = "Server Error while Adding a new feed. If the error persists, please contact technical support: teams@tech-lounge.ro.",
				this.snackOptions.type = SnackBarTypes.ERROR;
				this.snackOptions.timeout = 2000;
				this.snackbar = true;
			}
			try {
				let product = await this.ui.api.get<Product | null>("/api/v1/teams/product/" + this.teamId);
				if (product.data) {
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
		}
	}
});
</script>