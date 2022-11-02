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

  categories_array: {key: number, name: string, image: string}[] = [
    { key: 1, name:"Afval", image:"../../assets/category-logos/afval.svg"},
    { key: 2, name:"Inspiratie", image:"../../assets/category-logos/inspiratie.svg"},
    { key: 3, name:"Persoon", image:"../../assets/category-logos/mens.svg"},
    { key: 4, name:"Organisatie", image:"../../assets/category-logos/organisatie.svg"},
    { key: 5, name:"Technologie", image:"../../assets/category-logos/technologie.svg"},
  ];

  constructor() { }

  ngOnInit(): void {
  }

  ButtonClick(event: any){
    //console.log(event.target.id);
    this.categoryButtonEvent.emit(parseInt(event));
  }
   //als er een verandering gebeurt van een Input()
   ngOnChanges(changes: SimpleChanges) {
    if(changes['wasteCategoryState']){
    //console.log('change wasteCategoryState:',changes['wasteCategoryState'].currentValue);
      if(changes['wasteCategoryState'].currentValue == 0){
        document.getElementById('1')?.classList.add('active');
      }
      if(changes['wasteCategoryState'].currentValue == 1){
        document.getElementById('1')?.classList.remove('active');
      }
    }
    if(changes['inspirationCategoryState']){
      //console.log('change inspirationCategoryState:',changes['inspirationCategoryState'].currentValue);
      if(changes['inspirationCategoryState'].currentValue == 0){
        document.getElementById('2')?.classList.add('active');
      }
      if(changes['inspirationCategoryState'].currentValue == 1){
        document.getElementById('2')?.classList.remove('active');
      }
    }
    if(changes['organisationCategoryState']){
      //console.log('change organisationCategoryState:',changes['organisationCategoryState'].currentValue);
      if(changes['organisationCategoryState'].currentValue == 0){
        document.getElementById('3')?.classList.add('active');
      }
      if(changes['organisationCategoryState'].currentValue == 1){
        document.getElementById('3')?.classList.remove('active');
      }
    }
    if(changes['humanCategoryState']){
      //console.log('change humanCategoryState:',changes['humanCategoryState'].currentValue);
      if(changes['humanCategoryState'].currentValue == 0){
        document.getElementById('4')?.classList.add('active');
      }
      if(changes['humanCategoryState'].currentValue == 1){
        document.getElementById('4')?.classList.remove('active');
      }
    }
    if(changes['technologyCategoryState']){
      //console.log('change technologyCategoryState:',changes['technologyCategoryState'].currentValue);
      if(changes['technologyCategoryState'].currentValue == 0){
        document.getElementById('5')?.classList.add('active');
      }
      if(changes['technologyCategoryState'].currentValue == 1){
        document.getElementById('5')?.classList.remove('active');
      }
    }
  }
}
