import { createAction, props } from '@ngrx/store';

export const isLoaded = createAction(
  '[auth] isLoaded'
);

export const isNotLoaded = createAction(
  '[auth] isNotLoaded',
);


export const AppActions = {
  isLoaded:isLoaded,
  isNotLoaded:isNotLoaded,
}
