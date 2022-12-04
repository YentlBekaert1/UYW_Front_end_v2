import { createAction, props } from '@ngrx/store';

export const setinitialPageURL = createAction(
  '[filters] setinitialPageURL',
);

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
  props<{ materials: number[], material_name: string}>()
);

export const updateLocation = createAction(
  '[filters] updateLocation',
  props<{ coordinates: [any, any], distance: number, location_name: string}>()
);

export const updateFiltersFromFilterComponent = createAction(
  '[filters] updateFiltersFromFilterComponent',
  props<{
    materials: number[],
    coordinates: [any, any],
    distance: number,
    location_name: string,
    material_name: string
  }>()
);


export const AuthActions = {
  setinitialPageURL: setinitialPageURL,
  updateFiltersFromFilterComponent:updateFiltersFromFilterComponent,
  updatePageURL:updatePageURL,
  updateCategories:updateCategories,
  updateMaterials:updateMaterials,
  updateLocation:updateLocation,

}
