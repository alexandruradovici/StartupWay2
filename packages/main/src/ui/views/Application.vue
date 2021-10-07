<template>
	<router-view></router-view>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	name: "Application",
	methods: {
		SnackBarListener(): void {
			console.log("WORK");
		},
	},
});
</script>

<style lang="less">
</style>
