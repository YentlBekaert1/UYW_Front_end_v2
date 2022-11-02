import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-list-display',
  templateUrl: './list-display.component.html',
  styleUrls: ['./list-display.component.scss']
})
export class ListDisplayComponent implements OnInit {
  @Input() listdata: any
  @Input() activeTab!: string;
  @Output() clickOnItemEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    //console.log(this.listdata);
  }

  listItemClicked(item: any){
    console.log(item);
    this.clickOnItemEvent.emit(item);
  }
   //als er een verandering gebeurt van een Input()
   ngOnChanges(changes: SimpleChanges) {
    if(changes['activeTab']){
      var cards = document.querySelectorAll('#cards');
      cards[0].className = changes['activeTab'].currentValue;
    }
  }

}
