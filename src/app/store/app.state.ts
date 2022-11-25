import { AuthState } from "./authstate/auth.state"
import { FilterState } from "./filterstate/filter.state"
import { Languagestate } from "./languagestate/languagestate"
import { Loadstate } from "./loadstate/loadstate"

export interface AppState {
  Languagestate: Languagestate,
  Filterstate: FilterState
  Loadstate: Loadstate
  Authdata: AuthState,
}
