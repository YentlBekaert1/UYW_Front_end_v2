import { Component, OnInit, Input,Output, EventEmitter,SimpleChanges,ViewChild,ElementRef, AfterViewInit, ViewContainerRef, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import test_data from '../../assets/data.json';
import { MapComponent } from './components/map/map.component';

@Component({
  selector: 'app-items-page',
  templateUrl: './items-page.component.html',
  styleUrls: ['./items-page.component.scss']
})
export class ItemsPageComponent implements OnInit, AfterViewInit {

  public data: any

  //@Input() filterRadius: [number, number, number, boolean] = [0,0,0,false];
  @Output() changeCategoryEvent = new EventEmitter<[number,number]>(); //Event to change category status

  public wasteCategoryState: number = 1;
  public inspirationCategoryState: number = 1;
  public humanCategoryState: number = 1;
  public organisationCategoryState: number = 1;
  public technologyCategoryState: number = 1;

  public categoryFilter: [number, number] = [0,0]; //wordt in de gaten gehouden door map met onChange
  public filterRadius: [number, number, number, boolean] = [0,0,0,false];

  public geojsonList: any
  public listdataInit:any = [];
  public listdata:any = [];
  public listDataAfterFilter:any = [];
  public clickedItem: any;
  public activeTab!: string;

  @ViewChild('listcontainer', { read: ElementRef }) listcontainer!: ElementRef<HTMLInputElement>;
  @ViewChild('propertylist', { read: ElementRef }) propertylist!: ElementRef<HTMLInputElement>;
  @ViewChild('propertymap', { read: ElementRef }) propertymap!: ElementRef<HTMLInputElement>;

  //We maken gebrui van een observable om te kijken of activeTab veanderd. Dit is nodig om dat de functie 'tabClickedEvent' al wordt uitgevoerd
  //voor dat de view geladen is. Daardoor kunnen we de styling niet aanpassen.
  private _activeTabSubject$= new Subject<string>();
  get activeTabData() {
    return this._activeTabSubject$.asObservable();
  }

  constructor() { }

  ngOnInit(): void {
    this.geojsonList = [];
    test_data.data.forEach((el: any) => {
      //console.log(el.geojson)
      if(el.geojson !== null && el.geojson !== undefined){
        this.geojsonList.push(el.geojson);
      }
    });
    this.listdataInit = this.geojsonList;
    this.listdata = this.geojsonList;

  }

  ngAfterViewInit(): void {
    console.log(this.propertymap);
    this.propertymap.nativeElement.style.top = "auto";
    this.propertymap.nativeElement.style.width = "auto";
    this.propertymap.nativeElement.style.height = (window.innerHeight-250).toString() + "px";;

    this.activeTabData.subscribe((data) => {
      console.log('ob ',data);
      this.changeView(data);
    })
  }

  mapControlClickedEvent(clickedLayer: [number,number]){
    if(clickedLayer[0] === 1){
      this.wasteCategoryState = clickedLayer[1];
    }
    if(clickedLayer[0] === 2){
      this.inspirationCategoryState = clickedLayer[1];
    }
    if(clickedLayer[0] === 3){
      this.organisationCategoryState = clickedLayer[1];
    }
    if(clickedLayer[0] === 4){
      this.humanCategoryState = clickedLayer[1];
    }
    if(clickedLayer[0] === 5){
      this.technologyCategoryState = clickedLayer[1];
    }
  }

  //functie die uitgevoerd word als er op de map punten geselecteerd zijn,
  selectedPointsEvent(event: []){
    console.log('selectedPointsEvent:' ,event);
    this.listdata = event
  }

  //functie die uitgevoerd word als er op een item uit de lijst geklikt wordt
  //wordt bnaar map component meegegeven om in te zoomen op dat punt
  clickOnItemEvent(item: any){
    console.log('clickOnItemEvent: ', item);
    this.clickedItem = item;
  }

  //als er een verandering gebeurt van een Input()
  ngOnChanges(changes: SimpleChanges) {

  }

  // functie die uitgevoerd word al er op een tab gedrukt wordt. Output van child component
  tabClickedEvent(event: string){
    console.log(event);
    this.activeTab = event;

    var dataView = document.getElementsByClassName('list-container');
    if(this.activeTab === 'mapV'){
      dataView[0].classList.add('property-list-map');
      dataView[0].classList.remove('property-list-full');
      dataView[0].classList.remove('property-list-combi');
    }
    else if(this.activeTab === 'listV'){
      dataView[0].classList.add('property-list-full');
      dataView[0].classList.remove('property-list-map');
      dataView[0].classList.remove('property-list-combi');
    }
    else if(this.activeTab === 'maplistV'){
      dataView[0].classList.add('property-list-combi');
      dataView[0].classList.remove('property-list-map');
      dataView[0].classList.remove('property-list-full');
    }

    //zend waarde als volgende waarde in de observable
    this._activeTabSubject$.next(event);
  }

  // functie die uitgevoerd word al er op een knop van de categorieen gedrukt word. Output van child component
  categoryButtonClicked(categoryNumber: number){
    console.log("categoryButtonClicked:", categoryNumber);
    if(categoryNumber === 1){
      this.wasteCategoryState = 1 - this.wasteCategoryState; //keert de status om van 0 naar of van 1 naar 0
      //console.log("categoryButtonClickedWaset:", this.wasteCategoryState);
      this.categoryFilter = [categoryNumber,this.wasteCategoryState];
    }
    if(categoryNumber === 2){
      this.inspirationCategoryState = 1 - this.inspirationCategoryState;
      this.categoryFilter = [categoryNumber,this.inspirationCategoryState];
    }
    if(categoryNumber === 3){
      this.organisationCategoryState = 1 - this.organisationCategoryState;
      this.categoryFilter = [categoryNumber,this.organisationCategoryState];
    }
    if(categoryNumber === 4){
      this.humanCategoryState = 1 - this.humanCategoryState;
      this.categoryFilter = [categoryNumber,this.humanCategoryState];
    }
    if(categoryNumber === 5){
      this.technologyCategoryState = 1 - this.technologyCategoryState;
      this.categoryFilter = [categoryNumber,this.technologyCategoryState];
    }
    this.filterData();
  }

  filterData(){
    this.listDataAfterFilter = [];
    this.listdataInit.forEach((element: any) => {
      //kijk naar de state van de categorie
      if(this.wasteCategoryState == 1 && element.properties.category == '1'){
        this.listDataAfterFilter.push(element);
      }
      else if(this.inspirationCategoryState == 1 && element.properties.category == '2'){
        this.listDataAfterFilter.push(element);
      }
      else if(this.organisationCategoryState == 1 && element.properties.category == '3'){
        this.listDataAfterFilter.push(element);
      }
      else if(this.humanCategoryState == 1 && element.properties.category == '4'){
        this.listDataAfterFilter.push(element);
      }
      else if(this.technologyCategoryState == 1 && element.properties.category == '5'){
        this.listDataAfterFilter.push(element);
      }
    });
    this.listdata = [];
    this.listdata = this.listDataAfterFilter;
  }

  changeView(activeTab: string){
    console.log('changeVieuw', activeTab)
    if(activeTab === 'listV'){
        this.listcontainer.nativeElement.style.minHeight = "906px";
        window.scrollTo(0, 0);
    }
    if(activeTab === 'mapV'){
        this.propertymap.nativeElement.style.width = ((window.innerWidth - 20).toFixed()).toString() + "px";
        window.scrollTo(0, 0);
    }
    if(activeTab === 'maplistV'){
        console.log(((window.innerWidth - this.propertylist.nativeElement.clientWidth - 50).toFixed()).toString(), window.innerWidth,  this.propertylist.nativeElement.clientWidth)
        this.propertymap.nativeElement.style.width = ((window.innerWidth - this.propertylist.nativeElement.clientWidth - 50).toFixed()).toString() + "px";
        window.scrollTo(0, 0);
    }
  }

  //functie die uitgevoerd word als er in de component van de radius op de zoek knop wordt gedrukt: @output event
  filterRadiusClicked(radiusFilter: [number,number,number,boolean]){
    console.log('filterRadiusClicked: ',radiusFilter);
    this.filterRadius = radiusFilter;
  }

  //functie die uitgevoerd word als er in de component van de radius op de annuleer knop wordt gedrukt: @output event
  annuleerfilterRadiusClicked(){
    console.log('annuleerfilterRadiusClickedevent:');
    this.filterRadius = [0,0,0,false];
    this.filterData();
  }
}
