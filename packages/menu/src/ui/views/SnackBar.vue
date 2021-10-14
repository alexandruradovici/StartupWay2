<template>
	<div class="text-center">
		<v-snackbar v-model="snackbar" :timeout="timeout" :left="left" :right="right" :top="top" :bottom="bottom">
			{{ options.text && options.text !== "" ? options.text : "Unkown error" }}
			<v-btn :color="options.type" text @click="closeSnackbar()">
				Close
			</v-btn>
		</v-snackbar>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { SnackBarHorizontal, SnackBarVertical, SnackBarOptions } from "../../common";

interface ISnackbar {
	timeout: number,
	left: boolean,
	right: boolean,
	top: boolean,
	bottom: boolean
}
export default Vue.extend({
	name: "SnackBar",
	watch: {
		snackbar: {
			immediate: true,
			handler () {
				console.log(this.snackbar);
				if (this.snackbar) {
					const timeout = (this.options.timeout && this.options.timeout !== -1 ? this.options.timeout : 3000);
					setTimeout(() => {
						console.log("emmited event");
						this.$emit("update-snackbar", false);
					}, timeout);
				}
			}
		},
		options: {
			immediate: true,
			deep: true,
			handler () {
				console.log("options changed");
				console.log(this.options);
				switch (this.options.horizontal) {
					case SnackBarHorizontal.LEFT:
						this.left = true;
						this.right = false;
					case SnackBarHorizontal.RIGHT:
						this.left = false;
						this.right = true;
					default:
						this.left = false;
						this.right = true;
				}
				switch (this.options.vertical) {
					case SnackBarVertical.TOP:
						this.top = true;
						this.bottom = false;
					case SnackBarVertical.BOTTOM:
						this.top = false;
						this.bottom = true;
					default:
						this.top = true;
						this.bottom = false;
				}
			}
		}
	},
	props: {
		options: {
			required: true,
			type: Object as () => SnackBarOptions
		},
		snackbar: {
			required: true,
			type: Boolean
		}
	},
	data (): ISnackbar {
		const timeout = -1;
		const left = false;
		const right = false;
		const top = false;
		const bottom = false;
		return {
			timeout,
			left,
			right,
			top,
			bottom
		};
	},
	methods: {
		closeSnackbar (): void {
			this.$emit("update-snackbar", false);
		}
	}
});
</script>
