import { AuthState } from "./authstate/auth.state"
import { Categorystate } from "./categorystate/categorystate"
import { FilterState } from "./filterstate/filter.state"
import { Languagestate } from "./languagestate/languagestate"
import { Loadstate } from "./loadstate/loadstate"

export interface AppState {
  Categorystate: Categorystate,
  Languagestate: Languagestate,
  Filterstate: FilterState
  Loadstate: Loadstate
  Authdata: AuthState,
}
