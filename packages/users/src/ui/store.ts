import { Module } from "vuex";
import { RootState, NO_TOKEN, NO_USER, Session, User} from "../common";
import { UI } from "@startupway/main/lib/ui"

const STARTUPWAY_TOKEN = "startupway:token";

export interface UsersState {
	token: string,
	user:User
}

export default function usersStore () {
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
			token: NO_TOKEN,
			user: NO_USER
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
			async login (store, { username, password }: { username: string, password: string }) {
                // axios to login => session
                try
                {
                    const r = await ui.api.post<Session>("/api/v1/users/login", {
                        username,
						password,
						lastLogin: new Date()
					});
					if(r.data.sessionId === 0) {
						return r.data.token;
					}
                    store.commit ('token', r.data.token);
                    return r.data.token;
                }
                catch (e)
                {
					console.error(e);
					const errorToken = "error";
                    return errorToken;
                }
            },
            async logout (store) {
                // axios to logout
                try
                {
                    await ui.api.post<Session>("/api/v1/users/logout");
                    store.commit ('token', NO_TOKEN);

                    return true;
                }
                catch (e)
                {
                    return NO_TOKEN;
                }
                // store.commit ('token', session.token);
			},
			async load(store) {
				let user = NO_USER;
				try {
					const response = await ui.api.get("/api/v1/user");
					user = response.data;
				} catch(e) {
					console.error(e);
					return false;
				}
				store.commit("user",user);
				return true;
			}
		}
	};
	return store;
}
