<template>
	<v-app>
		<router-view></router-view>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	name: "Application",
	methods: {
		functionOne(): void {
			console.log("WORK");
		},
	},
});
</script>

<style lang="less">
</style>
