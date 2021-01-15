import Vue, { VueConstructor } from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Vuex, { Module, StoreOptions, Store } from "vuex";

import Vuetify from "vuetify";
import 'vuetify/dist/vuetify.min.css';

import axios, {AxiosInstance} from "axios";

import Application from "./views/Application.vue";
export interface UiRoute {

}

export interface RootState {
    version: string;
}

export class Ui {
	public readonly api: AxiosInstance = axios.create();
	public store: Store<RootState>;
	private static instance: Ui;
	private router: VueRouter = new VueRouter ();
	public vifyOpts: any = {
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

	//private vue:Vue ;
	

    async start (vuePage?:VueConstructor<Vue>) {
		// start the ui instance	
			
		console.log("Started App");
		
		Vue.use(Vuex);

		let storeData: StoreOptions<RootState> = {
			state: {
				version: "1.0.0"
			},
			modules: {},
			strict: process.env.NODE_ENV !== "production"
		};
		this.store = new Store(storeData);

		let vuetify = new Vuetify(this.vifyOpts);

		Vue.use(VueRouter);
		Vue.use(Vuetify, {
			font: 'mdi',
			iconfont: 'mdi'
		});
		new Vue ({
			el: '#app',
			vuetify,
			router: this.router,
			render: function (render) {
				return render(Application);
			}
		});
		console.log(this);
    }
	
	registerPlugin (plugin: any) /* TODO TYPE */ {
		Vue.use(plugin, {});
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
		// for(let route of newRoutes) {
		// 	if ((route as any).component !== undefined) {
		// 		this.registerView((route as any).component);
		// 	}
		// }
		this.router.addRoutes (newRoutes);
	}
	
	registerView (view: VueConstructor<Vue>) {
		console.log ((view as any).options.name);
		Vue.component ((view as any).options.name, view);
	}
	
	error (err: string) {
		console.error (err);
	}

	public static getInstance(): Ui {
		if(!Ui.instance) {
			Ui.instance = new Ui();
			Ui.instance.start ();
		}
		return Ui.instance;
	}

}

export function getUi (): Ui {
    return Ui.getInstance();
}
