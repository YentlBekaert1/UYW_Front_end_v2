import { AfterViewChecked, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { setinitialPageURL, updateFiltersFromFilterComponent, updateQuery } from 'src/app/store/filterstate/filter.actions';
import { selectQuery } from 'src/app/store/filterstate/filter.selector';
import { OfferService } from 'src/app/_services/offer.service';
import { liveSearch } from './livesearch.operator';
import { TranslateService } from '@ngx-translate/core';
import { changeLang } from 'src/app/store/languagestate/load.actions';
import { selectLang } from 'src/app/store/languagestate/lang.selector';
import { GeosearchService } from 'src/app/_services/geosearch.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit{
  @Input() placement:string;
  @ViewChild('searchInput', { read: ElementRef }) searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('distance_selector', { read: ElementRef }) distanceSelector!: ElementRef<HTMLInputElement>;
  @ViewChild('use_my_locatiom_checkbox', { read: ElementRef }) useMyLocationCheckbox!: ElementRef<HTMLInputElement>;

  private offerSubject = new Subject<string>();
  showResults = false;

  readonly offers$ = this.offerSubject.pipe(
    liveSearch(searchquery => this.offerservice.autocomplete(searchquery))
  );

  searchResults = [];
  placeholderText: string = "";


  constructor(private offerservice: OfferService, private eRef: ElementRef, private store: Store, private router: Router,
    private translate: TranslateService, private geoSearch: GeosearchService) {
    this.offers$.subscribe(res=>{
      console.log(res);
      this.searchResults = res
      this.showResults = true;
    });
    this.store.select(selectLang).subscribe(res => {
      if(this.placement == 'top'){
        const getTrans = this.translate.get('SEARCHBAR.PLACEHOLDER1').subscribe((res: string) => {
          console.log(res);
          this.placeholderText = res;
        });
       ;
      }else{
        const getTrans =  this.translate.get('SEARCHBAR.PLACEHOLDER2').subscribe((res: string) => {
          console.log(res);
          this.placeholderText = res;
        });

      }
    });
  }
  ngOnInit(): void {
  }
  // ngAfterViewChecked(): void {
  //   //this.store.select(selectQuery).subscribe(res=> this.searchInput.nativeElement.value =res);
  // }

  searchDatabase(query: string){
    this.searchInput.nativeElement.blur();
    var lat: any;
    var lon: any;
    var distance: number;
    var selectedlocationName: "";

    console.log(this.distanceSelector);
    distance = parseInt(this.distanceSelector.nativeElement.value);

    if(query && query.length > 0) {
      this.geoSearch
        .searchWordPhoton(query)
        .subscribe((features: any) => {
          console.log(features)
          selectedlocationName = features[0].display_name;
          if(features[0].lat && features[0].lon){
            lat = features[0].lat;
            lon = features[0].lon;
            this.store.dispatch(updateFiltersFromFilterComponent({
              materials:[],
              coordinates:[parseFloat(lat),parseFloat(lon)],
              distance:distance,
              material_name:"",
              location_name:selectedlocationName
            }));
            this.store.dispatch(setinitialPageURL());
          }
          else {
            lat = null;
            lon = null;
            this.store.dispatch(updateQuery({query:query}));
            this.store.dispatch(setinitialPageURL());
          }
      });
    }

    //na acties
    this.searchInput.nativeElement.style.outline = "none"
    this.searchInput.nativeElement.value = "";
    this.router.navigate(['/items']);
    this.showResults = false;
  }

  searchItems(event) {
    console.log("searchItems")
    var searchquery = event.target.value
    this.offerSubject.next(searchquery);
    this.showResults = true;
  }

  closeResults(query){
    console.log("closeResults")
    this.searchDatabase(query);
  }

  onEnter(event){
    console.log("onEnter");
    this.searchDatabase(event.target.value);
  }

  buttonClick($event){
    console.log("buttonClick")
    this.searchDatabase(this.searchInput.nativeElement.value);
  }

  keyUp() {
    //console.log("keyUp")
  }


  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
    }
    else {
      this.showResults = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
      this.showResults = false;
  }

}
