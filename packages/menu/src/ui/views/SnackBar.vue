<template>
	<div class="text-center">
    <v-snackbar
      v-model="snackbar"
	  :timeout="timeout"
	  right
	  top
    >
      {{ options.text }}
      <v-btn
        :color="options.type"
        text
        @click="closeSnackbar()"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { SnackBarOptions } from "../../common"
export default Vue.extend({
	name: "SnackBar",
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
	data() {
		return {
			timeout:-1,
			snackbarValid:false,
		};
	},
	watch: {
		snackbar():void {
			setTimeout(()=>{
				let prop = this.snackbar;
				prop = false;
				this.snackbarValid = false;
				this.$emit("update-prop",prop);
			}, 9000);
		}
	},
	methods: {
		closeSnackbar():void {
			let prop = this.snackbar;
			prop = false;
			this.snackbarValid = false;
			this.$emit("update-prop",prop);
		}
	}
});
</script>
