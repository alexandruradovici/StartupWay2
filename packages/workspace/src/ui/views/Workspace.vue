<template>
	<v-app id="app">
		<v-navigation-drawer v-if="role" clipped app permanent expand-on-hover>
			<v-list>
				<v-list-item>
					<v-list-item-content>
					<v-list-item-title class="title">
						{{userMenu.title}}
					</v-list-item-title>
					<v-list-item-subtitle>{{userMenu.subtitle}}</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-list>

			<v-divider></v-divider>

			<v-list nav dense>
				<template v-for="tab in tabs">
					<v-list-item link :key="tab.key" :to="tab.link">
						<v-list-item-icon>
						<v-icon>{{tab.icon}}</v-icon>
						</v-list-item-icon>
						<v-list-item-title>{{tab.title}}</v-list-item-title>
					</v-list-item>
				</template>
			</v-list>
		</v-navigation-drawer>
		<v-app-bar app clipped-left dark flat color="primary">
			<v-toolbar-title link contain>
				<a href="/#/workspace"
					><v-img left contain :src="logoImage" max-height="45" max-width="250"></v-img
				></a>
			</v-toolbar-title>
			<component
				v-for="(toolbarButton, index) in toolbarButtonsLeft"
				:key="'toolbarButtonsLeft' + index"
				:is="toolbarButton.view"
			>
			</component>
			<v-spacer></v-spacer>
			<component
				v-for="(toolbarButton, index) in toolbarButtonsRight"
				:key="'toolbarButtonsRight' + index"
				:is="toolbarButton.view"
			>
			</component>
		</v-app-bar>
		<v-main background-color="#fcfcfc">
			<v-container>
				<router-view ></router-view>
			</v-container>
		</v-main>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import logo from "../img/startupway-white-668px.png";
import { mapGetters } from "vuex";
import { UI } from "@startupway/main/lib/ui";
import { ToolbarButton, ToolbarButtonPosition } from "../../common/";
export default Vue.extend({
	name: "Workspace",
	components: {},
	async mounted() {
		await this.ui.storeDispatch("users/load", {});
		if(this.user) {
			if(this.user.role === "Mentor") {
				this.role=false;
				this.type="mentor";
			} else if(this.user.role === "Admin") {
				this.role=false;
				this.type="admin";
			} else if(this.user.role === "SuperAdmin") {
				this.role=false;
				this.type="superAdmin";
			} else {
				this.role=true;
			}
			if(this.user.role === "Mentor" || this.user.role === "Admin" || this.user.role === "SuperAdmin") {
				if(this.tabs.length > 0) {
					this.tabs = [];
				}
				this.$router.push("/dashboard")
			} else if(this.user) {
				this.tabs = [];
				await this.ui.storeDispatch("teams/loadTeams",this.user.userId);
				this.pushToTabs({
					key:this.tabs.length,
					title:"Dashboard",
					icon:"mdi-view-dashboard",
					link:"/frontPage"
				});
				this.pushToTabs({
					key:this.tabs.length,
					title:"View Team",
					icon:"mdi-account-supervisor",
					link:"/team"
				});
				this.pushToTabs({
					key:this.tabs.length,
					title:"Weekly Updates",
					icon:"mdi-calendar-edit",
					link:"/team/updates"
				});
				this.pushToTabs({
					key:this.tabs.length,
					title:"Business Canvas",
					icon:"mdi-clipboard-text-multiple",
					link:"/product/canvas"
				});
				this.pushToTabs({
					key:this.tabs.length,
					title:"Summary",
					icon:"mdi-chart-bar",
					link:"/product/summary"
				});
				this.pushToTabs({
					key:this.tabs.length,
					title:"Feed",
					icon:"mdi-cog-clockwise",
					link:"/product/feed"
				});
				
				this.userMenu.title = "User Menu";
				this.$router.push("/frontPage");
			}
			this.loading = false;
			this.loadingPage = false;
		}
	},
	data() {
		return {
			ui:UI.getInstance(),
			role:false,
			userMenu:{
				title:"",
				subtitle:""
			},
			router:false,
			show:true,
			id:0 as number,
			tabs: [] as {key:number,title:string,icon:string,link:string}[],
			type: "",
			loadingPage:false,
			loading:false,
			selectedTeam: 0,
			logoImage:logo
		};
	},
	watch: {
		_token: {
			immediate:true,
			handler (newToken:string):void {
				if(newToken === null){
					if(this.$route.path !== "/login")
						this.$router.push("/login");
				}
			}
		},
		$route:{
			immediate:true,
			async handler(newRoute):Promise<void> {
				if(newRoute.path === "/workspace") {
					if(this.user.role === "Mentor") {
						this.role=false;
						this.type="mentor";
					} else if(this.user.role === "Admin") {
						this.role=false;
						this.type="admin";
					} else if(this.user.role === "SuperAdmin") {
						this.role=false;
						this.type="superAdmin";
					} else {
						this.role=true;
					}
				}
			}
		},
	},
	computed: {
		...mapGetters({
			toolbarButtons: "workspace/toolbarButtons",
			_token: "users/token",
			user: "users/user",
			currentTeam: "teams/currentTeam",
		}),
		toolbarButtonsRight(): ToolbarButton[] {
			return this["toolbarButtons"]
				.filter((toolbarButton: ToolbarButton) => toolbarButton.position === ToolbarButtonPosition.RIGHT)
				.sort(
					(toolbarButton1: ToolbarButton, toolbarButton2: ToolbarButton) =>
						toolbarButton1.priority - toolbarButton2.priority
				);
		},
		toolbarButtonsLeft(): ToolbarButton[] {
			return this["toolbarButtons"]
				.filter((toolbarButton: ToolbarButton) => toolbarButton.position === ToolbarButtonPosition.LEFT)
				.sort(
					(toolbarButton1: ToolbarButton, toolbarButton2: ToolbarButton) =>
						toolbarButton1.priority - toolbarButton2.priority
				);
		}
	},
	methods: {
		moment() {
			return moment();
		},
		pushToTabs(tab:{key:number,title:string,icon:string,link:string}):void {
			if(this.tabs.find((item:{key:number,title:string,icon:string,link:string}) => {
				return item.link === tab.link
			}) === undefined) {
				this.tabs.push(tab);
			}
		},
		checkRoute():boolean {
			if(this.$router.currentRoute.path === "/workspace")
				return true;
			else
				return false;
		},
		pushBack():void {
			this.$router.go(-1);
		},
	}
});
</script>
<style lang="less">
</style>