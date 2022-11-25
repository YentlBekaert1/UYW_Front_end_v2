import { createAction, props } from '@ngrx/store';
import { Category } from './category.model';




export const changeCategories = createAction(
  '[category] changeCategories',
   props<{categories: Category[]}>()
);


export const CategoryActions = {
  changeCategories: changeCategories
}
