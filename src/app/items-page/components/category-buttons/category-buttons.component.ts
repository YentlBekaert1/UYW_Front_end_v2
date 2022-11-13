import { Component, EventEmitter, OnInit, Output, Input,SimpleChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { updateCategories } from 'src/app/store/filterstate/filter.actions';
import { FilterState } from 'src/app/store/filterstate/filter.state';
import { Categories } from 'src/app/_models/categories';

@Component({
  selector: 'app-category-buttons',
  templateUrl: './category-buttons.component.html',
  styleUrls: ['./category-buttons.component.scss']
})
export class CategoryButtonsComponent implements AfterViewInit {
  @Input() categorieFilters: number[];

  @ViewChild('categories', { read: ElementRef }) categories!: ElementRef<HTMLInputElement>;

  categories_array: Categories[] = [
    { key: 1, name:"afval", image:"../../assets/category-logos/afval.svg"},
    { key: 2, name:"inspiratie", image:"../../assets/category-logos/inspiratie.svg"},
    { key: 3, name:"persoon", image:"../../assets/category-logos/mens.svg"},
    { key: 4, name:"organisatie", image:"../../assets/category-logos/organisatie.svg"},
    { key: 5, name:"technologie", image:"../../assets/category-logos/technologie.svg"},
    // { key: 6, name:"events", image:"../../assets/category-logos/technologie.svg"},
  ];

  active_categories: number[];

  constructor(private route: ActivatedRoute, private store: Store<FilterState>) { }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['categorieFilters']){
      const active_categories = changes['categorieFilters'].currentValue;
      active_categories.forEach(cat => {
        //console.log(cat);
        this.categories_array.forEach(element => {
          if(parseInt(cat) === element.key){
           //this.categories.nativeElement.children[element.key-1].classList.add('active');
          }
        });
      });
    }
  }

  ngAfterViewInit(): void {
    // const paramsub = this.route.paramMap.subscribe(params => {
    //   const active_category = params.get('categories').split(',');
    //   this.active_categories = [];
    //   active_category.forEach(cat => {
    //       console.log()
    //       // if(cat === '0'){
    //       //   this.categories_array.forEach(element => {
    //       //       this.active_categories.push(element.key);
    //       //       this.categories.nativeElement.children[element.key-1].classList.add('active');
    //       //   });
    //       // }else{
    //       //   this.categories_array.forEach(element => {
    //       //     if(parseInt(cat) === element.key){
    //       //       this.active_categories.push(element.key);
    //       //       this.categories.nativeElement.children[element.key-1].classList.add('active');
    //       //     }
    //       //   });
    //       // }
    //         this.categories_array.forEach(element => {
    //           if(parseInt(cat) === element.key){
    //             this.active_categories.push(element.key);
    //             this.categories.nativeElement.children[element.key-1].classList.add('active');
    //           }
    //         });
    //     });
    //     //this.categoryFilterEvent.emit(this.active_categories);
    // });
    this.categorieFilters.forEach(filter_el => {
       this.categories_array.forEach(categorie => {
          if(filter_el === categorie.key){
            this.categories.nativeElement.children[filter_el-1].classList.add('active');
          }
      });
    });
  }

  ButtonClick(category_id: any){
    var new_array = [];
    this.categorieFilters.forEach(el=>new_array.push(el));
    const found = new_array.find(element => element === category_id);
    if(found !== undefined){
      this.categories.nativeElement.children[category_id-1].classList.remove('active');
      new_array.splice(new_array.indexOf(category_id), 1);
    }
    else{
      this.categories.nativeElement.children[category_id-1].classList.add('active');
      new_array.push(category_id);
    }
    this.store.dispatch(updateCategories({categories: new_array}));
  }
}
