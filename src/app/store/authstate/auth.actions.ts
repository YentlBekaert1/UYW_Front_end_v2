import { createAction, props } from '@ngrx/store';
import { Profile } from './auth.model';


export const Authenticated = createAction(
  '[auth] Authenticated'
);

export const GetProfile = createAction(
  '[auth] GetProfile',
);

export const ShowProfile = createAction(
  '[auth] ShowProfile',
  props<{ profile: Profile, isLoggedIn: Boolean }>()
);

export const DeleteProfile = createAction(
  '[auth] DeleteProfile',
);

export const AuthActions = {
  Authenticated:Authenticated,
  GetProfile:GetProfile,
  ShowProfile:ShowProfile,
  DeleteProfile:DeleteProfile,
}
