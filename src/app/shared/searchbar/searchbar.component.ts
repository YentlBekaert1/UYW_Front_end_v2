import { AfterViewChecked, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { FactoryTarget } from '@angular/compiler';

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
  @ViewChild('use_location', { read: ElementRef }) useLocation!: ElementRef<HTMLInputElement>;
  private offerSubject = new Subject<string>();
  showResults = false;

  readonly offers$ = this.offerSubject.pipe(
    liveSearch(searchquery => this.offerservice.autocomplete(searchquery, this.lang))
  );

  searchResults = [];
  placeholderText: string = "";
  lang: string;

  constructor(private offerservice: OfferService, private eRef: ElementRef, private store: Store, private router: Router,
    private translate: TranslateService, private geoSearch: GeosearchService, private route: ActivatedRoute) {
    this.offers$.subscribe(res=>{
      console.log(res);
      this.searchResults = res
      this.showResults = true;
    });
    this.store.select(selectLang).subscribe(res => {
      this.lang = res.lang;
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
    console.log(this.useMyLocationCheckbox);
    if(this.placement == 'top'){
      this.store.dispatch(updateQuery({query:query}));
      this.store.dispatch(setinitialPageURL());
    }else if(this.placement == 'filterbalk'){
      console.log('filerbalk')
      if(this.useLocation.nativeElement.checked == true && this.useMyLocationCheckbox.nativeElement.checked == false){
        console.log('uselocation')
        if(query && query.length > 0) {
          this.geoSearch
            .searchWordPhoton(query)
            .subscribe((features: any) => {
              console.log(features)
              var selectedlocationName = "";
              if(features[0].display_name){
                selectedlocationName = features[0].display_name;
              }else{
                selectedlocationName = "Location";
              }
              if(features[0].lat && features[0].lon){
                lat = features[0].lat;
                lon = features[0].lon;
                distance = parseInt(this.distanceSelector.nativeElement.value)  * 1000 //*1000 om in kilometer te plaatsen;
                this.store.dispatch(updateFiltersFromFilterComponent({
                  query:"",
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
      }
      else if(this.useMyLocationCheckbox.nativeElement.checked == true){
        console.log('mylocation');
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              // Success function
             (position)=>{
              console.log(position);
              this.geoSearch
              .searchWordPhotonbbCoordinates(position.coords.latitude,position.coords.longitude)
              .subscribe((features: any) => {
                console.log(features)
                var selectedlocationName = "";
                if(features.display_name){
                  selectedlocationName = features.display_name;
                }else{
                  selectedlocationName = "Location";
                }
                if(features.lat && features.lon){
                  distance = parseInt(this.distanceSelector.nativeElement.value)  * 1000 //*1000 om in kilometer te plaatsen;
                  this.store.dispatch(updateFiltersFromFilterComponent({
                    query:query,
                    materials:[],
                    coordinates:[position.coords.latitude,position.coords.longitude],
                    distance:distance,
                    material_name:"",
                    location_name:selectedlocationName
                  }));
                  this.store.dispatch(setinitialPageURL());
                }
                else {
                  this.store.dispatch(updateQuery({query:query}));
                  this.store.dispatch(setinitialPageURL());
                }
              });
             },
              // Error function
              ()=>{
                alert("oeps somthing went wrong");
              },
              // Options. See MDN for details.
              {
                 enableHighAccuracy: true,
                 timeout: 5000,
                 maximumAge: 0
              });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
      }
      else{
        console.log('query')
        this.store.dispatch(updateQuery({query:query}));
        this.store.dispatch(setinitialPageURL());
      }
    }

    //na acties
    this.searchInput.nativeElement.style.outline = "none"
    this.searchInput.nativeElement.value = "";
    const paramsub = this.route.paramMap.subscribe(params => {
      var tab = params.get('tab');
      if(tab === 'list'){
        this.router.navigate(['/items','list']);
      }
      else if(tab === 'map'){
        this.router.navigate(['/items', 'map']);
      }
      else if(tab === 'combi'){
        this.router.navigate(['/items', 'combi']);
      }
      else{
        this.router.navigate(['/items']);
      }
      paramsub.unsubscribe;
    });

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
