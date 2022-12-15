
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
  categorie_name:"",
  material_name: "",
  location_name: "",
  distance: 0
};


export const FilterReducer = createReducer(
  initialFilterState,
  on(setinitialPageURL, ((state) => ({...state, pageUrl: environment.apiUrl + "api/offers?page=1"}))),
  on(updateQuery, ((state, {query}) => ({...state, query:query}))),
  on(updateCategories, ((state, {categories, categorie_name}) => ({...state, categories:categories, categorie_name:categorie_name}))),
  on(updateMaterials, ((state, {materials, material_name}) => ({...state, materials:materials, material_name:material_name}))),
  on(updateLocation, ((state, {coordinates, distance, location_name}) => ({...state, coordinates:coordinates, distance:distance, location_name:location_name}))),
  on(updatePageURL, ((state, {pageURL}) => ({...state, pageUrl:pageURL}))),
  on(updateFiltersFromFilterComponent, ((state, {materials ,coordinates, distance, material_name, location_name, query}) => ({
    ...state,
    query:query,
    materials:materials,
    material_name:material_name,
    location_name:location_name,
    coordinates:coordinates,
    distance:distance
  }))),
);
