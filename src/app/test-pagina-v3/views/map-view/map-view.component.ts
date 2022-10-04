import { Component, OnInit, Input,Output, EventEmitter,SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  @Input() data: any
  @Input() wasteCategoryState!: number;
  @Input() inspirationCategoryState!: number;
  @Input() humanCategoryState!: number;
  @Input() organisationCategoryState!: number;
  @Input() technologyCategoryState!: number;
  @Input() filterRadius: [number, number, number, boolean] = [0,0,0,false];;

  @Output() changeCategoryEvent = new EventEmitter<[number,number]>(); //Event to change category status

  public categoryFilter: [number, number] = [0,0]; //wordt in de gaten gehouden door map met onChange

  public clickedItem: any;


  constructor() { }

  ngOnInit(): void {
  }

  mapControlClickedEvent(clickedLayer: [number,number]){
    console.log('mapControlClickedEvent', clickedLayer);
    //past de status van de categorie aan in parent.
    this.changeCategoryEvent.emit(clickedLayer);
  }

  //functie die uitgevoerd word als er op de map punten geselecteerd zijn,
  selectedPointsEvent(event: []){
    console.log('selectedPointsEvent:' ,event);
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
  }
}
