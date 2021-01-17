<template>
	<v-menu left bottom offset-y>
		
		<template v-slot:activator="{ on: menu }">
			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn  text v-on="{ ...tooltip, ...menu }">
						<v-list-item-avatar>
							<v-img v-if="options.img !== undefined && options.img !== ''" :src="options.img"></v-img>
							<v-icon v-else-if="options.menuIcon">{{options.menuIcon}}</v-icon>
							<v-icon v-else>mdi-error-outline</v-icon>
						</v-list-item-avatar>
						{{options.menuName}}
					</v-btn>
				</template>
				<span v-if="options.menuTooltip">{{options.menuTooltip}}</span>
				<span v-else >ERROR</span>
			</v-tooltip>
		</template>
		<v-list v-if="options">
			<v-list-item v-for="(item,index) in options.items" :key="index" @click="click (item)">
				<v-list-item-avatar>
					<v-img v-if="item.img !== undefined && item.img !== ''" small avatar :src="item.img"></v-img>
					<v-icon v-else>{{item.icon}}</v-icon>
				</v-list-item-avatar>
				<v-list-item-title>{{item.title}}</v-list-item-title>
			</v-list-item>
		</v-list>
		<v-list v-else>
			<v-list-item>
					<v-list-item-icon>
						<v-icon>mdi-error-outline</v-icon>
					</v-list-item-icon>

					<v-list-item-title> {{item.title}}</v-list-item-title>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script lang="ts">
import Vue from "vue";
import { SimpleMenuOptions, SimpleMenuItem } from "../../common/common"

export default Vue.extend({
	name: "SimpleMenu",
	watch: {
		options: {
			immediate:true,
			handler(newOptions:SimpleMenuOptions) {
				if(newOptions.menuTooltip === "View Your Teams") {
					if(newOptions.items.length > 0)
						this.$emit ('click', newOptions.items[0].id);
				}
			}
		}
	},
	props: {
		options: {
			required: true,
			type: Object as () => SimpleMenuOptions
		}
	},
	data() {
		return {
			id:Number,
		};
	},
	methods: {
		click (menuItem: SimpleMenuItem) {
			if (menuItem.link)
			{
				if(this.$route.path !== menuItem.link)
					this.$router.push (menuItem.link);
			}
			else
			{
				this.$emit ('click', menuItem.id);
			}
		},
	}
});
</script>
