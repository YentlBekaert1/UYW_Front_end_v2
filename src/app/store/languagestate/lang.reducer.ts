
import { createReducer, on } from '@ngrx/store';
import { Languagestate } from './languagestate';
import { changeLang } from './load.actions';

export const initialLoadState: Languagestate = {
  lang: "en"
};

export const LanguageReducer = createReducer(
  initialLoadState,
  on(changeLang, (state, {lang}) => ({ ...state, lang: lang }))
);
