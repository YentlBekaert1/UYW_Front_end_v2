import { Component, OnInit, Input,Output, EventEmitter,SimpleChanges,ViewChild,ElementRef, AfterViewInit, ViewContainerRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  items_per_page: number;
  getoffersurl = environment.apiUrl + 'api/offers?page=1'
  res_materials: any = [];

  @ViewChild('listcontainer', { read: ElementRef }) listcontainer!: ElementRef<HTMLInputElement>;
  @ViewChild('propertylist', { read: ElementRef }) propertylist!: ElementRef<HTMLInputElement>;
  @ViewChild('propertymap', { read: ElementRef }) propertymap!: ElementRef<HTMLInputElement>;

  selectedFitlers: Filters = {category:0, distance: 0, lat:0, lon:0, userLocation:false, material: 0};

  constructor(private route: ActivatedRoute, private offerService: OfferService) { }

  ngOnInit(): void {
    this.items_per_page = 20;
    this.getData();
    this.offerService.getMaterials().then((res: any) => {
      this.res_materials = res.data;
    })
  }

  changeListPage(urlstring: string){
    window.scrollTo(0, 0);
    this.getoffersurl = urlstring;
    this.getData();
  }

  ngAfterViewInit(): void {
    this.propertymap.nativeElement.style.top = "auto";
    this.propertymap.nativeElement.style.width = "auto";
    this.propertymap.nativeElement.style.height = (window.innerHeight-250).toString() + "px";
    var dataView = document.getElementsByClassName('list-container');
    const paramsub = this.route.paramMap.subscribe(params => {
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
    });
  }

  filtersSelectedEvent(filters:Filters){
    this.selectedFitlers.distance =filters.distance
    this.selectedFitlers.lat = filters.lat
    this.selectedFitlers.lon = filters.lon
    this.selectedFitlers.userLocation = filters.userLocation
    this.selectedFitlers.material = filters.material

    this.getoffersurl = environment.apiUrl + 'api/offers?page=1'
    this.getData();
  }

  getData(){
    console.log(this.selectedFitlers);
    var loctionString = "";
    if(this.selectedFitlers.lat !== 0 && this.selectedFitlers.lat !== 0){
      loctionString = (this.selectedFitlers.lat + "," +this.selectedFitlers.lon + "," +this.selectedFitlers.distance).toString();
    }else{
      loctionString = "";
    }

    this.offerService.getOffers(this.getoffersurl, this.items_per_page, this.selectedFitlers.material, loctionString).then( (res: {data: [], links:[], meta:[]})=> {this.listdata = res});
  }
}
