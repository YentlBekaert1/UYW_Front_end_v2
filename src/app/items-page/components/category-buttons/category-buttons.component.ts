import { Component, EventEmitter, OnInit, Output, Input,SimpleChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Categories } from 'src/app/_models/categories';

@Component({
  selector: 'app-category-buttons',
  templateUrl: './category-buttons.component.html',
  styleUrls: ['./category-buttons.component.scss']
})
export class CategoryButtonsComponent implements AfterViewInit {
  @Output() categoryFilterEvent = new EventEmitter<Array<any>>();

  @ViewChild('categories', { read: ElementRef }) categories!: ElementRef<HTMLInputElement>;

  categories_array: Categories[] = [
    { key: 1, name:"afval", image:"../../assets/category-logos/afval.svg"},
    { key: 2, name:"inspiratie", image:"../../assets/category-logos/inspiratie.svg"},
    { key: 3, name:"persoon", image:"../../assets/category-logos/mens.svg"},
    { key: 4, name:"organisatie", image:"../../assets/category-logos/organisatie.svg"},
    { key: 5, name:"technologie", image:"../../assets/category-logos/technologie.svg"},
    { key: 6, name:"events", image:"../../assets/category-logos/technologie.svg"},
  ];

  active_categories: any[] = [];

  constructor(private route: ActivatedRoute) { }

  ngAfterViewInit(): void {
    const paramsub = this.route.paramMap.subscribe(params => {
      const active_category = params.get('categories').split(',');
      this.active_categories = [];
      active_category.forEach(cat => {
          console.log()
          // if(cat === '0'){
          //   this.categories_array.forEach(element => {
          //       this.active_categories.push(element.key);
          //       this.categories.nativeElement.children[element.key-1].classList.add('active');
          //   });
          // }else{
          //   this.categories_array.forEach(element => {
          //     if(parseInt(cat) === element.key){
          //       this.active_categories.push(element.key);
          //       this.categories.nativeElement.children[element.key-1].classList.add('active');
          //     }
          //   });
          // }
            this.categories_array.forEach(element => {
              if(parseInt(cat) === element.key){
                this.active_categories.push(element.key);
                this.categories.nativeElement.children[element.key-1].classList.add('active');
              }
            });
        });
        //this.categoryFilterEvent.emit(this.active_categories);
    });
  }

  ButtonClick(event: any){
    //console.log(event);
    this.setCategoryActive(event);
  }

  setCategoryActive(number: number){
    //console.log('arraybefore:', this.active_categories);
    const found = this.active_categories.find(element => element === number);
    if(found !== undefined){
      this.categories.nativeElement.children[number-1].classList.remove('active');
      this.active_categories.splice(this.active_categories.indexOf(number), 1);
    }
    else{
      this.categories.nativeElement.children[number-1].classList.add('active');
      this.active_categories.push(number);
    }
    this.categoryFilterEvent.emit(this.active_categories);
    //console.log('found:', found);
    //console.log('arrayafter:', this.active_categories);
  }
}
