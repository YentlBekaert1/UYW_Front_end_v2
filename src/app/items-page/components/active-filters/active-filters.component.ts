import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { updateCategories, updateLocation, updateMaterials, updateQuery } from 'src/app/store/filterstate/filter.actions';
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
      console.log(res)
    })
  }

  deleteFilter(type: string){
    if(type == 'query'){
      this.store.dispatch(updateQuery({query:"" }));
    }
    if(type == 'categories'){
      this.store.dispatch(updateCategories({categories: []}));
    }
    if(type == 'materials'){
      this.store.dispatch(updateMaterials({materials: [], material_name:""}));
    }
    if(type == 'coordinates'){
      this.store.dispatch(updateLocation({coordinates: [null, null], distance: 0, location_name: ""}));
    }
  }
}
