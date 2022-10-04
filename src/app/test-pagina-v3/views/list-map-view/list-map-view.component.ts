import { Component, OnInit, Input,Output, EventEmitter,SimpleChanges,ViewChild,ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-list-map-view',
  templateUrl: './list-map-view.component.html',
  styleUrls: ['./list-map-view.component.scss']
})
export class ListMapViewComponent implements AfterViewInit {

  @Input() data: any
  @Input() wasteCategoryState!: number;
  @Input() inspirationCategoryState!: number;
  @Input() humanCategoryState!: number;
  @Input() organisationCategoryState!: number;
  @Input() technologyCategoryState!: number;
  @Input() filterRadius: [number, number, number, boolean] = [0,0,0,false];

  @Output() changeCategoryEvent = new EventEmitter<[number,number]>(); //Event to change category status

  public categoryFilter: [number, number] = [0,0]; //wordt in de gaten gehouden door map met onChange

  public listdataInit:any = [];
  public listdata:any = [];
  public listDataAfterFilter:any = [];
  public clickedItem: any;
  public activeTab!: string;

  @ViewChild('mapV', { read: ElementRef }) mapV!: ElementRef<HTMLInputElement>;
  @ViewChild('listV', { read: ElementRef }) listV!: ElementRef<HTMLInputElement>;


  constructor() { }

  ngAfterViewInit(): void {
  }

  mapControlClickedEvent(clickedLayer: [number,number]){
    console.log('mapControlClickedEvent', clickedLayer);
    //past de status van de categorie aan in parent.
    this.changeCategoryEvent.emit(clickedLayer);
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
    if(changes['data']){
      this.listdataInit = this.data;
      this.listdata = this.data;
    }

    if(changes['filterRadius']){
      console.log('filterRadius changed: ', this.filterRadius);
    }

    if(changes['wasteCategoryState']){
      //console.log('change wasteCategoryState:',changes['wasteCategoryState'].currentValue);
      this.categoryFilter = [1, this.wasteCategoryState];
    }
    if(changes['inspirationCategoryState']){
      //console.log('change inspirationCategoryState:',changes['inspirationCategoryState'].currentValue);
      this.categoryFilter = [2, this.inspirationCategoryState];
    }
    if(changes['organisationCategoryState']){
      //console.log('change organisationCategoryState:',changes['organisationCategoryState'].currentValue);
      this.categoryFilter = [3, this.organisationCategoryState];
    }
    if(changes['humanCategoryState']){
      //console.log('change humanCategoryState:',changes['humanCategoryState'].currentValue);
      this.categoryFilter = [4, this.humanCategoryState];
    }
    if(changes['technologyCategoryState']){
      //console.log('change technologyCategoryState:',changes['technologyCategoryState'].currentValue);
      this.categoryFilter = [5, this.technologyCategoryState];
    }

    //pas de lijstdata aan
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

  tabClickedEvent(event: string){
    console.log(event);
    this.activeTab = event;
    if(this.activeTab === 'maptab'){
      console.log(this.listV.nativeElement.className);
      this.listV.nativeElement.className = 'hide'
      this.mapV.nativeElement.className = 'full'
    }
    else if(this.activeTab === 'listtab'){
      this.listV.nativeElement.className = 'full'
      this.mapV.nativeElement.className = 'hide'
    }
    else if(this.activeTab === 'maplisttab'){
      this.listV.nativeElement.className = ''
      this.mapV.nativeElement.className = ''
    }
  }
}
