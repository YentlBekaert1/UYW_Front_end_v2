import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Loadstate } from "./loadstate";

export const selectLoad = createFeatureSelector<Loadstate>('LoadData')

export const BooleanisLoaded = createSelector(
  selectLoad,
    (state: Loadstate) => state.isLoaded
);
