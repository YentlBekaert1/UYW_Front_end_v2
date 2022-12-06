import { createAction, props } from '@ngrx/store';

export const changeLang = createAction(
  '[lang] changeLang',
   props<{ lang: string}>()
);


export const AuthActions = {
  changeLang: changeLang
}
