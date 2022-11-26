import { Component, EventEmitter, OnInit, Output, Input,SimpleChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Category } from 'src/app/store/categorystate/category.model';
import { selectCategories } from 'src/app/store/categorystate/category.selector';
import { setinitialPageURL, updateCategories } from 'src/app/store/filterstate/filter.actions';
import { FilterState } from 'src/app/store/filterstate/filter.state';
import { selectedLang } from 'src/app/store/languagestate/lang.selector';


@Component({
  selector: 'app-category-buttons',
  templateUrl: './category-buttons.component.html',
  styleUrls: ['./category-buttons.component.scss']
})
export class CategoryButtonsComponent implements AfterViewInit {
  @Input() categorieFilters: number[];

  @ViewChild('categories', { read: ElementRef }) categories!: ElementRef<HTMLInputElement>;

  // categories_array: Categories[] = [
  //   { key: 1, name:"afval", image:"../../assets/category-logos/afval.svg"},
  //   { key: 2, name:"inspiratie", image:"../../assets/category-logos/inspiratie.svg"},
  //   { key: 3, name:"persoon", image:"../../assets/category-logos/mens.svg"},
  //   { key: 4, name:"organisatie", image:"../../assets/category-logos/organisatie.svg"},
  //   { key: 5, name:"technologie", image:"../../assets/category-logos/technologie.svg"},
  // ];

  active_categories: number[];
  active_cat: number = 0;

  categories_array: Category[];
  categories_array$ = this.store.select(selectCategories);

  lang$ = this.store.select(selectedLang);
  lang: string;

  constructor(private route: ActivatedRoute, private store: Store, private router: Router) {
    this.lang$.subscribe(res => {
      this.lang =  res
    });
    
    this.categories_array$.subscribe(res => {
      this.categories_array =  res
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['categorieFilters']){
      const active_categories = changes['categorieFilters'].currentValue;
      active_categories.forEach(cat => {
        console.log(cat);
        this.categories_array.forEach(element => {
          if(parseInt(cat) === element.id){
           //this.categories.nativeElement.children[element.key-1].classList.add('active');
          }
        });
      });
    }
  }

  ngAfterViewInit(): void {
    this.categorieFilters.forEach(filter_el => {
       this.categories_array.forEach(categorie => {
          if(filter_el === categorie.id){
            this.categories.nativeElement.children[filter_el-1].classList.add('active');
          }
      });
    });
  }

  ButtonClick(category_id: any){
    //voor filter met alleen 1 categorie
    var new_array = [];
    // this.categorieFilters.forEach(el=>new_array.push(el));
    // const found = new_array.find(element => element === category_id);
    // console.log(new_array);
    // new_array.pop();
    console.log(this.active_cat)
    this.categories_array.forEach(element => {
      if(element.id == category_id && category_id != this.active_cat){
        this.categories.nativeElement.children[element.id-1].classList.add('active');
        new_array.push(category_id);
        this.active_cat = category_id;
      }else if(element.id == category_id && category_id == this.active_cat){
        this.categories.nativeElement.children[element.id-1].classList.remove('active');
        this.active_cat = 0
      }
      else{
        this.categories.nativeElement.children[element.id-1].classList.remove('active');
      }
    });
    //voor filter met meerder categorieen
    // if(found !== undefined){
    //   this.categories.nativeElement.children[category_id-1].classList.remove('active');
    //   new_array.splice(new_array.indexOf(category_id), 1);
    // }
    // else{
    //   this.categories.nativeElement.children[category_id-1].classList.add('active');
    //   new_array.push(category_id);
    // }
    this.store.dispatch(updateCategories({categories: new_array}));
    this.store.dispatch(setinitialPageURL());
  }
  goToAdd(){
      this.router.navigate(['/addoffer'])
  }
}
