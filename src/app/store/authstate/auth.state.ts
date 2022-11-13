import { Profile } from "./auth.model";

export interface AuthState {
  isLoggedIn: Boolean,
  profile: Profile
}
