import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-category-buttons',
  templateUrl: './category-buttons.component.html',
  styleUrls: ['./category-buttons.component.scss']
})
export class CategoryButtonsComponent implements OnInit {

  @Output() categoryButtonEvent = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  ButtonClick(event: any){
    //console.log(event.target.id);
    this.categoryButtonEvent.emit(parseInt(event.target.id));
  }

}
