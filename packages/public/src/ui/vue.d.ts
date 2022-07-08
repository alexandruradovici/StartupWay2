declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

declare module "vuetify/lib/framework" {
	import Vuetify from "vuetify";
	import 'vuetify/dist/vuetify.min.css';
	export default Vuetify;
}