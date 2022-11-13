
import { createReducer, on } from '@ngrx/store';
import { Authenticated, DeleteProfile, GetProfile, ShowProfile } from './auth.actions';
import { Profile } from './auth.model';
import { AuthState } from './auth.state';


export const initialAuthState: AuthState = {
  isLoggedIn: false,
  profile: {
    id:0,
    name:"",
    email:"",
    email_verified_at:"",
    two_factor_confirmed_at:"",
    current_team_id:0,
    profile_photo_path:"",
    created_at:"",
    updated_at:"",
    role_id:0,
    profile_photo_url:""
  }
};


export const AuthReducer = createReducer(
  initialAuthState,
  on(Authenticated, state => ({ ...state, isLoggedin: true })),
  on(ShowProfile, ((state, {profile, isLoggedIn}) => ({...state, profile:profile, isLoggedIn:isLoggedIn}))),
  on(DeleteProfile, (state) => ({...state,
    isLoggedIn: false,
    profile: {
      id:0,
      name:"",
      email:"",
      email_verified_at:"",
      two_factor_confirmed_at:"",
      current_team_id:0,
      profile_photo_path:"",
      created_at:"",
      updated_at:"",
      role_id:0,
      profile_photo_url:""
    }
  }))
);
