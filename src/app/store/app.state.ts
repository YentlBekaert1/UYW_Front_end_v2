import { AuthState } from "./authstate/auth.state"
import { FilterState } from "./filterstate/filter.state"
import { Loadstate } from "./loadstate/loadstate"

export interface AppState {
  Filterstate: FilterState
  Loadstate: Loadstate
  Authdata: AuthState,
}
