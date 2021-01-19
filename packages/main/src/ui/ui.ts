import Vue, { VueConstructor } from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Vuex, { Module, StoreOptions, Store } from "vuex";

import Vuetify, { UserVuetifyPreset } from "vuetify";
import 'vuetify/dist/vuetify.min.css';

import axios, {AxiosInstance} from "axios";

import Application from "./views/Application.vue";
export interface RootState {
    version: string;
}

export class UI {
	public readonly api: AxiosInstance = axios.create();

	private static instance: UI;
	private router: VueRouter = new VueRouter ();
	private store: Store<RootState>;

	private vuetifyOptions: Partial<UserVuetifyPreset> = {
		theme: {
			themes: {
				light: {
					primary: '#197E81',
					secondary: '#3c5459',
					accent: '#F5C00C',
					error: '#971c19',
				},
				dark: {
					primary: '#165455',
					secondary: '#ffffff',
					accent: '#231F20',
					error: '#971c19',
				},
			},
		},
		icons: {
			iconfont: 'md',
		},
	};;

	public routes: RouteConfig[] = [];


    private start (vuePage?:VueConstructor<Vue>) {
		// start the ui instance

		console.log("Started App");

		Vue.use(Vuex);

		const storeData: StoreOptions<RootState> = {
			state: {
				version: "1.0.0"
			},
			modules: {},
			strict: process.env.NODE_ENV !== "production"
		};
		this.store = new Store(storeData);

		const vuetify = new Vuetify(this.vuetifyOptions);

		Vue.use(VueRouter);
		Vue.use(Vuetify, {
			font: 'mdi',
			iconfont: 'mdi'
		});
		new Vue ({
			el: '#app',
			vuetify,
			store:this.store,
			router: this.router,
			render (render) {
				return render(Application);
			}
		});
    }

	registerStore<T>(namespace: string, store: Module<T, RootState>) {
		if (this.store) {
			// TODO check if it is already registered
			this.store.registerModule(namespace, store);
		}
		else {
			this.error('Unable to register store module ' + namespace + ', store has not been already started');
		}
	}

	storeDispatch (action: string, obj: any): Promise<any>
	{
		return this.store.dispatch (action, obj);
	}

	registerRoutes (newRoutes: RouteConfig[]) {
		this.router.addRoutes (newRoutes);
	}

	registerView (view: VueConstructor<Vue>) {
		Vue.component ((view as any).options.name, view);
	}

	error (err: string) {
		console.error (err);
	}

	public static getInstance(): UI {
		if(!UI.instance) {
			UI.instance = new UI();
			UI.instance.start ();
		}
		return UI.instance;
	}

}
