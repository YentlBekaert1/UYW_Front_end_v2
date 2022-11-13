import { AuthState } from "./authstate/auth.state"
import { Loadstate } from "./loadstate/loadstate"

export interface AppState {
  Loadstate: Loadstate
  Authdata: AuthState,
}
