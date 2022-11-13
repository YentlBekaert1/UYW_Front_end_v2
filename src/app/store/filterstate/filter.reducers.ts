
import { createReducer, on } from '@ngrx/store';
import { environment } from 'src/environments/environment';

import { updateCategories, updateFiltersFromFilterComponent, updateLocation, updateMaterials, updatePageURL } from './filter.actions';
import { FilterState } from './filter.state';


export const initialFilterState: FilterState = {
  pageUrl: environment.apiUrl + "api/offers?page=1",
  categories: [],
  materials: [],
  coordinates:[null,null],
  distance: 0
};


export const FilterReducer = createReducer(
  initialFilterState,
  on(updateCategories, ((state, {categories}) => ({...state, categories:categories}))),
  on(updateMaterials, ((state, {materials}) => ({...state, materials:materials}))),
  on(updateLocation, ((state, {coordinates, distance}) => ({...state, coordinates:coordinates, distance:distance}))),
  on(updatePageURL, ((state, {pageURL}) => ({...state, pageUrl:pageURL}))),
  on(updateFiltersFromFilterComponent, ((state, {materials ,coordinates, distance }) => ({
    ...state,
    materials:materials,
    coordinates:coordinates,
    distance:distance
  }))),
);
