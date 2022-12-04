import { Component, OnInit, Input,Output, EventEmitter,SimpleChanges,ViewChild,ElementRef, AfterViewInit, ViewContainerRef, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { updatePageURL, updateQuery } from '../store/filterstate/filter.actions';
import { selectAllFilters, selectCategories, selectMaterials, selectQuery } from '../store/filterstate/filter.selector';
import { selectedLang } from '../store/languagestate/lang.selector';
import { Filters } from '../_models/filters';
import { OfferService } from '../_services/offer.service';
import { OfferlocationService } from '../_services/offerlocation.service';


@Component({
  selector: 'app-items-page',
  templateUrl: './items-page.component.html',
  styleUrls: ['./items-page.component.scss']
})
export class ItemsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  listdata: {data: [], links:[], meta:[]} = {data: [], links:[], meta:[]};

  public wasteCategoryState: number = 1;
  public inspirationCategoryState: number = 1;
  public humanCategoryState: number = 1;
  public organisationCategoryState: number = 1;
  public technologyCategoryState: number = 1;

  active_tab:string = 'list';
  active_category!:string;
  tabs_style = "large"

  items_per_page: number;
  getoffersurl = environment.apiUrl + 'api/offers?page=1'
  res_materials: any = [];

  locationString: string = "";

  @ViewChild('listcontainer', { read: ElementRef }) listcontainer!: ElementRef<HTMLInputElement>;
  @ViewChild('propertylist', { read: ElementRef }) propertylist!: ElementRef<HTMLInputElement>;
  @ViewChild('propertymap', { read: ElementRef }) propertymap!: ElementRef<HTMLInputElement>;

  selectedFitlers: Filters = {category:'', distance: 0, lat:0, lon:0, userLocation:false, material: 0};

  filter_categories$ = this.store.select(selectCategories);
  filter_materials$ = this.store.select(selectMaterials);
  filters$ = this.store.select(selectAllFilters);
  query$ = this.store.select(selectQuery);

  showMoreFiltes = false;

  lang$ = this.store.select(selectedLang);
  lang: string;

  isLoading = false;

  constructor(private route: ActivatedRoute, private offerService: OfferService, private store: Store, private router: Router) {
    this.lang$.subscribe(res => {
      this.lang =  res
    });
  }

  ngOnInit(): void {
    if(window.innerWidth < 680){
      this.tabs_style = "small";
    }

    this.items_per_page = 20;
    this.offerService.getMaterials(this.lang).then((res: any) => {
      this.res_materials = res.data;
    });
    this.filters$.subscribe(res => {
      console.log(res)
      //this.filtersCategorieEvent(res.categories)
      this.getOffers(res.pageUrl,  this.items_per_page, res.query, res.categories, res.materials, res.coordinates, res.distance)
    })
  }

  changeListPage(urlstring: string){
    window.scrollTo(0, 0);
    this.store.dispatch(updatePageURL({pageURL:urlstring}))
  }

  ngAfterViewInit(): void {
    this.propertymap.nativeElement.style.top = "auto";
    this.propertymap.nativeElement.style.width = "auto";
    this.propertymap.nativeElement.style.height = (window.innerHeight-250).toString() + "px";
    var dataView = document.getElementsByClassName('list-container');
    const paramsub = this.route.paramMap.subscribe(params => {
      //get activetab
      this.active_tab = params.get('tab');
      if(this.active_tab === 'list'){
        dataView[0].classList.add('property-list-full');
        dataView[0].classList.remove('property-list-map');
        dataView[0].classList.remove('property-list-combi');
        this.listcontainer.nativeElement.style.minHeight = "906px";
        window.scrollTo(0, 0);
      }
      else if(this.active_tab === 'map'){
        dataView[0].classList.add('property-list-map');
        dataView[0].classList.remove('property-list-full');
        dataView[0].classList.remove('property-list-combi');
        this.propertymap.nativeElement.style.width = ((window.innerWidth - 20).toFixed()).toString() + "px";
        window.scrollTo(0, 0);
      }
      else if(this.active_tab === 'combi'){
        dataView[0].classList.add('property-list-combi');
        dataView[0].classList.remove('property-list-map');
        dataView[0].classList.remove('property-list-full');
        console.log(((window.innerWidth - this.propertylist.nativeElement.clientWidth - 50).toFixed()).toString(), window.innerWidth,  this.propertylist.nativeElement.clientWidth)
        this.propertymap.nativeElement.style.width = ((window.innerWidth - this.propertylist.nativeElement.clientWidth - 50).toFixed()).toString() + "px";
        window.scrollTo(0, 0);
      }
      this.selectedFitlers.category = params.get('categories');
      this.selectedFitlers.distance = parseInt(params.get('distance'));
      if(params.get('lat') != '0' && params.get('lon')){
        this.selectedFitlers.lat = parseFloat(params.get('lat'));
        this.selectedFitlers.lon = parseFloat(params.get('lon'));
        this.locationString = (this.selectedFitlers.lat + "," +this.selectedFitlers.lon  + "," +this.selectedFitlers.distance).toString();
      }
      else{
        this.locationString = "";
      }
    });
  }



  getOffers(url: string, pagesize:number, query:string, categorieFilter: number[], materialFilter: number[], coordinatesFilter: [any,any], distanceFilter: number){
    this.isLoading = true;
    this.offerService.getOffers(url, pagesize, query, categorieFilter, materialFilter, coordinatesFilter, distanceFilter)
    .then((res: {data: [], links:[], meta:[]})=> {
      this.listdata = res;
      this.isLoading = false;
    });
  }

  moreFiltersClicked(){
    this.showMoreFiltes = !this.showMoreFiltes
   }

   removeQuery(){
    this.store.dispatch(updateQuery({query:"" }));
   }

   goToAdd(){
    this.router.navigate(['/addoffer']);
   }
   goToSearch(){
    this.router.navigate(['/search']);
   }

   ngOnDestroy() {
    this.store.dispatch(updateQuery({query:"" }));
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    if(event.target.innerWidth < 680){
      this.tabs_style = "small";
    }else{
      this.tabs_style = "large";
    }
  }
}
