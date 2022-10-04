import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-list-display',
  templateUrl: './list-display.component.html',
  styleUrls: ['./list-display.component.scss']
})
export class ListDisplayComponent implements OnInit {
  @Input() listdata: any
  @Output() clickOnItemEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    console.log(this.listdata);
  }

  listItemClicked(item: any){
    console.log(item);
    this.clickOnItemEvent.emit(item);
  }

}
