import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { updateCategories, updateQuery } from 'src/app/store/filterstate/filter.actions';
import { selectAllFilters } from 'src/app/store/filterstate/filter.selector';

@Component({
  selector: 'app-active-filters',
  templateUrl: './active-filters.component.html',
  styleUrls: ['./active-filters.component.scss']
})
export class ActiveFiltersComponent implements OnInit {

  filters$ = this.store.select(selectAllFilters);

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.filters$.subscribe(res => {

    })
  }

  deleteFilter(type: string){
    if(type == 'query'){
      this.store.dispatch(updateQuery({query:"" }));
    }
    if(type == 'categories'){
      this.store.dispatch(updateCategories({categories: []}));
    }
  }
}
