import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.state";


export const selectAuth = createFeatureSelector<AuthState>('Authdata')

export const selectProfile = createSelector(
    selectAuth,
    (state: AuthState) => state.profile
);

export const selectisLoggedIn = createSelector(
  selectAuth,
  (state: AuthState) => state.isLoggedIn
);

