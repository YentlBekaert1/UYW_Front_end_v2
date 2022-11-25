import { Component, Input, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Category } from '../store/categorystate/category.model';
import { selectCategories } from '../store/categorystate/category.selector';
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
export class HomePagev2Component {




  latest_offers: any;
  categories_array: Category[];
  categories_array$ = this.store.select(selectCategories);

  lang$ = this.store.select(selectedLang);
  lang: string;

  constructor(private router: Router, private geoSearch: GeosearchService, private offerservice: OfferService, private store: Store) {
    this.lang$.subscribe(res => {
      console.log("hallo lang:", res);
      this.lang =  res
    });

    this.categories_array$.subscribe(res => {
      console.log("hallo:", res);
      this.categories_array =  res
    });

    this.offerservice.getOffersDesc(20).then((res: any) => {
      console.log(res);
      this.latest_offers = res.data;
    })
  }

}
