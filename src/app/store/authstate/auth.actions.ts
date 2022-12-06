import { createAction, props } from '@ngrx/store';
import { Profile } from './auth.model';


export const loadProfileSucces = createAction(
  '[Auth/API] Load Profile Succes',
  props<{ profile: Profile}>()
);

export const loadProfileFailure = createAction(
  '[Auth/API] Load Profile Failure',
);

export const updateProfile = createAction(
  '[Auth/API] Update Profile',
  props<{ profile: Profile, isLoggedIn: Boolean }>()
);

export const deleteProfile = createAction(
  '[Auth/API] Delete Profile',
);


export const AuthActions = {
  loadProfileSucces:loadProfileSucces,
  loadProfileFailure:loadProfileFailure,
  updateProfile:updateProfile,
  deleteProfile:deleteProfile,
}
