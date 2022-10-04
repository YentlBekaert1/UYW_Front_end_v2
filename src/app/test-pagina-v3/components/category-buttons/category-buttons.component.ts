import { Component, EventEmitter, OnInit, Output, Input,SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-category-buttons',
  templateUrl: './category-buttons.component.html',
  styleUrls: ['./category-buttons.component.scss']
})
export class CategoryButtonsComponent implements OnInit {

  @Input() wasteCategoryState!: number;
  @Input() inspirationCategoryState!: number;
  @Input() humanCategoryState!: number;
  @Input() organisationCategoryState!: number;
  @Input() technologyCategoryState!: number;

  @Output() categoryButtonEvent = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  ButtonClick(event: any){
    //console.log(event.target.id);
    this.categoryButtonEvent.emit(parseInt(event.target.id));
  }
   //als er een verandering gebeurt van een Input()
   ngOnChanges(changes: SimpleChanges) {
    if(changes['wasteCategoryState']){
      //console.log('change wasteCategoryState:',changes['wasteCategoryState'].currentValue);
    }
    if(changes['inspirationCategoryState']){
      //console.log('change inspirationCategoryState:',changes['inspirationCategoryState'].currentValue);
    }
    if(changes['organisationCategoryState']){
      //console.log('change organisationCategoryState:',changes['organisationCategoryState'].currentValue);
    }
    if(changes['humanCategoryState']){
      //console.log('change humanCategoryState:',changes['humanCategoryState'].currentValue);
    }
    if(changes['technologyCategoryState']){
      //console.log('change technologyCategoryState:',changes['technologyCategoryState'].currentValue);
    }
  }

}
