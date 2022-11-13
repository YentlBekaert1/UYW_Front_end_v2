
import { createReducer, on } from '@ngrx/store';
import { isLoaded, isNotLoaded } from './load.actions';
import { Loadstate } from './loadstate';

export const initialLoadState: Loadstate = {
  isLoaded: false
};

export const LoadReducer = createReducer(
  initialLoadState,
  on(isLoaded, state => ({ ...state, isLoaded: true })),
  on(isNotLoaded, state => ({ ...state, isLoaded: false })),
);
