import { createReducer, on } from '@ngrx/store';
import { changeCategories } from './category.actions';
import { Categorystate } from './categorystate';

export const initialCategoryState: Categorystate = {
  categories: []
};


export const CategoryReducer = createReducer(
  initialCategoryState,
  on(changeCategories, ((state, {categories}) => ({...state, categories:categories}))),
);
