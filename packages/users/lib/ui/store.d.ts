import { Module } from "vuex";
import { RootState, User } from "../common";
export interface UsersState {
    token?: string;
    user?: User;
}
export default function usersStore(): Module<UsersState, RootState>;
//# sourceMappingURL=store.d.ts.map