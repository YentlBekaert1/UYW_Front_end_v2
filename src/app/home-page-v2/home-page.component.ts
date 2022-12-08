import { Component, Input, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Category } from '../store/categorystate/category.model';
import { selectCategories } from '../store/categorystate/category.selector';
import { updateCategories } from '../store/filterstate/filter.actions';
import { selectedLang, selectLang } from '../store/languagestate/lang.selector';
import { Filters } from '../_models/filters';
import { AuthService } from '../_services/auth.service';
import { GeosearchService } from '../_services/geosearch.service';
import { OfferService } from '../_services/offer.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePagev2Component implements AfterViewInit{




  latest_offers: any;
  categories_array: Category[];
  categories_array$ = this.store.select(selectCategories);

  lang$ = this.store.select(selectedLang);
  lang: string;

  constructor(private router: Router, private geoSearch: GeosearchService, private offerservice: OfferService, private store: Store) {
    this.lang$.subscribe(res => {
      this.lang =  res
    });

    this.categories_array$.subscribe(res => {
      this.categories_array =  res
    });

    this.offerservice.getOffersDesc(20).then((res: any) => {
      this.latest_offers = res.data;
    })
  }
  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry)=> {
          console.log(entry)
          if(entry.isIntersecting){
            entry.target.classList.add('show');
          }
          //if you want to see the animation more than once
          else{
            entry.target.classList.remove('show')
          }
        })
    })
      const hiddenElements = document.querySelectorAll(".hidden");
      hiddenElements.forEach((el)=> observer.observe(el));
  }
  goToItems(categorie_id: number){
   this.store.dispatch(updateCategories({categories:[categorie_id]}));
   this.router.navigate(['items']);
  }

}
