import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Languagestate } from "./languagestate";


export const selectLang = createFeatureSelector<Languagestate>('LangData')

export const selectedLang= createSelector(
  selectLang,
    (state: Languagestate) => state.lang
);



