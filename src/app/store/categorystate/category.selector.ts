import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Categorystate } from "./categorystate";


export const selectCategorie = createFeatureSelector<Categorystate>('CategoryData')

export const selectCategories= createSelector(
  selectCategorie,
    (state: Categorystate) => state.categories
)


