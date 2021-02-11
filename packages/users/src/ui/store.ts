import { Module } from "vuex";
import { RootState, Session, User} from "../common";
import { UI } from "@startupway/main/lib/ui";

const STARTUPWAY_TOKEN = "startupway:token";

export interface UsersState {
	token?: string,
	user?: User
}

export default function usersStore ():Module<UsersState, RootState> {
	const ui = UI.getInstance();
    ui.api.interceptors.request.use ((config:any) => {
        if (window.localStorage.getItem (STARTUPWAY_TOKEN))
        {
            config.headers.Authorization = 'Bearer ' + window.localStorage.getItem (STARTUPWAY_TOKEN);
        }
        return config;
    });

	const store: Module<UsersState, RootState> = {
		namespaced: true,
		state: {
			token: undefined,
			user: undefined
		},
		getters: {
			token: (state) => state.token,
			user: (state) => state.user
		},
		mutations: {
			token: (state, token: string) => {
                state.token = token;
                window.localStorage.setItem (STARTUPWAY_TOKEN, token);
			},
			user: (state, newUser:User) => {
				state.user = newUser;
			}
		},
		actions: {
			async login (storeParam, { username, password }: { username: string, password: string }):Promise<string> {
                // axios to login => session
                try
                {
                    const r = await ui.api.post<Session>("/api/v1/users/login", {
                        username,
						password,
						lastLogin: new Date()
					});
					if(r.data.sessionId === "") {
						return r.data.token;
					}
                    storeParam.commit ('token', r.data.token);
                    return r.data.token;
                }
                catch (e)
                {
					console.error(e);
					const errorToken = "error";
                    return errorToken;
                }
            },
            async logout (storeParam):Promise<boolean> {
                // axios to logout
                try
                {
                    await ui.api.post<Session>("/api/v1/users/logout");
                    storeParam.commit ('token', null);

                    return true;
                }
                catch (e)
                {
                    return false;
                }
                // store.commit ('token', session.token);
			},
			async load(storeParam):Promise<boolean> {
				let user = null;
				try {
					const response = await ui.api.get<User | null>("/api/v1/users/user");
					user = response.data;
				} catch(e) {
					console.error(e);
					return false;
				}
				storeParam.commit("user",user);
				return true;
			}
		}
	};
	return store;
}
