import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { updateQuery } from 'src/app/store/filterstate/filter.actions';
import { selectAllFilters } from 'src/app/store/filterstate/filter.selector';


@Component({
  selector: 'app-list-display',
  templateUrl: './list-display.component.html',
  styleUrls: ['./list-display.component.scss']
})
export class ListDisplayComponent implements OnInit {
  @Input() listdata: any;
  @Input() active_tab!: string;


  displayData: any = [];
  total_items: number = 0;
  start_items: number = 0;
  stop_items: number = 0;

  filters$ = this.store.select(selectAllFilters);

  constructor(private route: Router, private store: Store) { }

  ngOnInit(): void {
    this.filters$.subscribe(res => {

    })
  }

  listItemClicked(item: number){
    console.log(item);
    this.route.navigate(['/offerdetail', item]);
  }
   //als er een verandering gebeurt van een Input()
   ngOnChanges(changes: SimpleChanges) {
    if(changes['active_tab']){
      var cards = document.querySelectorAll('#cards');
      cards[0].className = changes['active_tab'].currentValue;
    }
    if(changes['listdata']){
      console.log(changes['listdata'].currentValue);
      this.total_items = changes['listdata'].currentValue.meta.total;
      this.start_items = changes['listdata'].currentValue.meta.from;
      this.stop_items = changes['listdata'].currentValue.meta.to;
      this.displayData = changes['listdata'].currentValue.data;
    }
  }
  deleteFilter(type: string){
    this.store.dispatch(updateQuery({query:"" }));
  }
}
