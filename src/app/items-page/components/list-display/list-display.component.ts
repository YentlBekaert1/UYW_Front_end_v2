import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-list-display',
  templateUrl: './list-display.component.html',
  styleUrls: ['./list-display.component.scss']
})
export class ListDisplayComponent implements OnInit {
  @Input() listdata: any;
  @Input() active_tab!: string;
  @Output() clickOnItemEvent = new EventEmitter<any>();

  displayData: any = [];
  total_items: number = 0;
  constructor() { }

  ngOnInit(): void {
    //console.log(this.listdata);
  }

  listItemClicked(item: any){
    console.log(item);
    //this.clickOnItemEvent.emit(item);
  }
   //als er een verandering gebeurt van een Input()
   ngOnChanges(changes: SimpleChanges) {
    if(changes['active_tab']){
      var cards = document.querySelectorAll('#cards');
      cards[0].className = changes['active_tab'].currentValue;
    }
    if(changes['listdata']){
      //console.log(changes['listdata'].currentValue);
      this.total_items = changes['listdata'].currentValue.meta.total;
      this.displayData = changes['listdata'].currentValue.data;
    }
  }

}
