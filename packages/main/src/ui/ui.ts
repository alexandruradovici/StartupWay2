import Vue, { VueConstructor, VNode } from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Vuex, { Module, StoreOptions, Store } from "vuex";
import Vuetify, { UserVuetifyPreset } from "vuetify";
import 'vuetify/dist/vuetify.min.css';
import axios, {AxiosInstance} from "axios";
// import '@mdi/font/css/materialdesignicons.css';
import Application from "./views/Application.vue";
export interface RootState {
    version: string;
}

enum LogType {
	INFO,
	WARRNING,
	ERROR,

}
export class UI {
	public readonly api: AxiosInstance = axios.create();

	private static instance: UI;
	private router: VueRouter = new VueRouter ();
	private store: Store<RootState>;
	/**
	 * #01939A	#167C81	#017177	#20B5BB	#39B6BB
		Secondary Color A:
		#FFAB00	#D59B23	#C48400	#FFB92A	#FFC44C
		Secondary Color B:
		#FF0700	#D52823	#C40500	#FF302A	#FF504C
	 */
	private vuetifyOptions: Partial<UserVuetifyPreset> = {
		theme: {
			themes: {
				// light: {
				// 	primary: '#197E81',
				// 	secondary: '#3c5459',
				// 	accent: '#F5C00C',
				// 	error: '#971c19',
				// },
				// dark: {
				// 	primary: '#165455',
				// 	secondary: '#ffffff',
				// 	accent: '#231F20',
				// 	error: '#971c19',
				// },
				light: {
					primary: "#01939A",
					primaryDark1: "#167C81",
					primaryDark2: "#017177",
					primaryLight1: "#20B5BB",
					primaryLight2: "#39B6BB",
					secondary: "#FFAB00",
					secondaryDark1: "#D59B23",
					secondaryDark2: "#C48400",
					secondaryLight1: "#FFB92A",
					secondaryLight2: "#FFC44C",
					accent: "#FF0700",
					accentDark1: "#D52823",
					accentDark2: "#C40500",
					accentLight1: "#FF302A",
					accentLight2: "#FF504C",
					error: "#971c19",
				},
				// dark: {
				// 	primary: "#165455",
				// 	secondary: "#ffffff",
				// 	accent: "#231F20",
				// 	error: "#971c19",
				// },
			},
		}
	};;

	public routes: RouteConfig[] = [];


    private start ():void {
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
		const v = new Vue ({
			el: '#app',
			vuetify,
			store:this.store,
			router: this.router,
			render (render):VNode {
				return render(Application);
			}
		});
		if (v !== undefined) {
			// start the ui instance
			console.log("Started App");
		}
    }

	registerStore<T>(namespace: string, store: Module<T, RootState>):void {
		if (this.store) {
			// TODO check if it is already registered
			this.store.registerModule(namespace, store);
		}
		else {
			this.error('Unable to register store module ' + namespace + ', store has not been already started');
		}
	}

	storeDispatch (action: string, obj: any, global?:{ root: boolean }): Promise<any>
	{
		if (!global)
			return this.store.dispatch (action, obj);
		else
			return this.store.dispatch (action, obj, global);
	}
	registerRoute (newRoute: RouteConfig, parent?:string):void {
		if (parent && typeof parent === "string") {
				this.router.addRoute (parent,newRoute);
		} else {
				this.router.addRoute (newRoute);
		}
	}

	registerView (view: VueConstructor<Vue>):void {
		Vue.component ((view as any).options.name, view);
	}

	error (err: string):void {
		console.error (err);
	}

	logEvent (pack: string, component: string, message: string, type?: LogType): void {
		switch (type) {
			case LogType.INFO:
				console.info(`INFO from |[${pack}]|[${component}]| with message: [${message}]`);
			case LogType.WARRNING:
				console.warn(`WARNNING from |[${pack}]|[${component}]| with message: [${message}]`);
			case LogType.ERROR:
				console.error(`ERROR from |[${pack}]|[${component}]| with message: [${message}]`);
			default:
				console.log(`|[${pack}]|[${component}]|[${message}]`);
		}
	}

	public static getInstance(): UI {
		if (!UI.instance) {
			UI.instance = new UI();
			UI.instance.start ();
		}
		return UI.instance;
	}

}
