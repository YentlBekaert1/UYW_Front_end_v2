
import { createReducer, on } from '@ngrx/store';
import { environment } from 'src/environments/environment';

import { setinitialPageURL, updateCategories, updateFiltersFromFilterComponent, updateLocation, updateMaterials, updatePageURL, updateQuery } from './filter.actions';
import { FilterState } from './filter.state';


export const initialFilterState: FilterState = {
  query:"",
  pageUrl: environment.apiUrl + "api/offers?page=1",
  categories: [],
  materials: [],
  coordinates:[null,null],
  distance: 0
};


export const FilterReducer = createReducer(
  initialFilterState,
  on(setinitialPageURL, ((state) => ({...state, pageUrl: environment.apiUrl + "api/offers?page=1"}))),
  on(updateQuery, ((state, {query}) => ({...state, query:query}))),
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
