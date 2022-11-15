import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FilterState } from "./filter.state";

export const selectFilter = createFeatureSelector<FilterState>('FilterData')

export const selectAllFilters= createSelector(
  selectFilter,
    (state: FilterState) => state
);

export const selectQuery= createSelector(
  selectFilter,
    (state: FilterState) => state.query
);

export const selectCategories= createSelector(
  selectFilter,
    (state: FilterState) => state.categories
);

export const selectMaterials = createSelector(
  selectFilter,
    (state: FilterState) => state.materials
);

export const selectCoordinates = createSelector(
  selectFilter,
    (state: FilterState) => state.coordinates
);

export const selectDisatnce = createSelector(
  selectFilter,
    (state: FilterState) => state.distance
);

