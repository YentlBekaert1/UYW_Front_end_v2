import { Component, OnInit, Input,Output, EventEmitter,SimpleChanges,ViewChild,ElementRef, AfterViewInit, ViewContainerRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { updatePageURL } from '../store/filterstate/filter.actions';
import { selectAllFilters, selectCategories, selectMaterials } from '../store/filterstate/filter.selector';
import { Filters } from '../_models/filters';
import { OfferService } from '../_services/offer.service';
import { OfferlocationService } from '../_services/offerlocation.service';


@Component({
  selector: 'app-items-page',
  templateUrl: './items-page.component.html',
  styleUrls: ['./items-page.component.scss']
})
export class ItemsPageComponent implements OnInit, AfterViewInit {
  listdata: {data: [], links:[], meta:[]} = {data: [], links:[], meta:[]};

  public wasteCategoryState: number = 1;
  public inspirationCategoryState: number = 1;
  public humanCategoryState: number = 1;
  public organisationCategoryState: number = 1;
  public technologyCategoryState: number = 1;

  active_tab:string = 'list';
  active_category!:string;

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

  showMoreFiltes = false;

  constructor(private route: ActivatedRoute, private offerService: OfferService, private store: Store) { }

  ngOnInit(): void {
    this.items_per_page = 20;
    this.offerService.getMaterials().then((res: any) => {
      this.res_materials = res.data;
    });
    this.filters$.subscribe(res => {
      console.log(res)
      //this.filtersCategorieEvent(res.categories)
      this.getOffers(res.pageUrl, this.items_per_page, res.categories, res.materials, res.coordinates, res.distance)
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



  getOffers(url: string, pagesize:number, categorieFilter: number[], materialFilter: number[], coordinatesFilter: [any,any], distanceFilter: number){
    this.offerService.getOffers(url, pagesize, categorieFilter, materialFilter, coordinatesFilter, distanceFilter)
    .then((res: {data: [], links:[], meta:[]})=> { this.listdata = res });
  }

  moreFiltersClicked(){
    this.showMoreFiltes = !this.showMoreFiltes
   }
}
