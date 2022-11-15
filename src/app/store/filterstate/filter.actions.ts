import { createAction, props } from '@ngrx/store';

export const updatePageURL = createAction(
  '[filters] updatePageURL',
   props<{  pageURL: string}>()
);

export const updateQuery = createAction(
  '[filters] updateQuery',
   props<{ query: string}>()
);

export const updateCategories = createAction(
  '[filters] updateCategories',
   props<{ categories: number[]}>()
);

export const updateMaterials = createAction(
  '[filters] updateMaterials',
  props<{ materials: number[]}>()
);

export const updateLocation = createAction(
  '[filters] updateLocation',
  props<{ coordinates: [any, any], distance: number}>()
);

export const updateFiltersFromFilterComponent = createAction(
  '[filters] updateFiltersFromFilterComponent',
  props<{
    materials: number[],
    coordinates: [any, any],
    distance: number
  }>()
);


export const AuthActions = {
  updateFiltersFromFilterComponent:updateFiltersFromFilterComponent,
  updatePageURL:updatePageURL,
  updateCategories:updateCategories,
  updateMaterials:updateMaterials,
  updateLocation:updateLocation,

}
