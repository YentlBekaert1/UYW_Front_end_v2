import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { DeleteProfile, GetProfile } from "./auth.actions";
import { selectisLoggedIn, selectProfile } from "./auth.selector";
import { AuthState } from "./auth.state";

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  userProfile$ = this.store.select(selectProfile);
  isLoggedIn$ = this.store.select(selectisLoggedIn);
  constructor(private store: Store<AuthState>) {}

  getProfile() {
    this.store.dispatch(GetProfile());
  }

  deleteProfile() {
    this.store.dispatch(DeleteProfile());
  }
}
