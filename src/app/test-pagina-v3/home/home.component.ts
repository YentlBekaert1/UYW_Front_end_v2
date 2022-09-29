import { Component, OnInit } from '@angular/core';
import test_geojson from '../../../assets/geojson.json';
import test_data from '../../../assets/data.json';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponentV3 implements OnInit {

  title = 'LeafLetMapTest';

  public geojsonList: any;
  public categoryFilter: [number, number] = [0,0]; //wordt in de gaten gehouden door map met onChange
  public filterRadius: [number, number, number, boolean] = [0,0,0,false];

  public listdataInit:any = [];
  public listdata:any = [];
  public listDataAfterFilter:any = [];

  public clickedItem: any;

  wasteCategoryState: number = 1;
  inspirationCategoryState: number = 1;
  humanCategoryState: number = 1;
  organisationCategoryState: number = 1;
  technologyCategoryState: number = 1;



  constructor() { }

  ngOnInit(): void {
    this.geojsonList = [];
    test_data.data.forEach((el: any) => {
      console.log(el.geojson)
      if(el.geojson !== null && el.geojson !== undefined){
        this.geojsonList.push(el.geojson);
      }
    });
    this.listdataInit = this.geojsonList;
    this.listdata = this.geojsonList;
  }

  mapControlClickedEvent(clickedLayer: [number,number]){
    console.log('mapControlClickedEvent', clickedLayer);
    //past de status van de categorie aan.
    if(clickedLayer[0] === 1){
      this.wasteCategoryState = clickedLayer[1];
    }
    else if(clickedLayer[0] === 2){
      this.inspirationCategoryState = clickedLayer[1] ;
    }
    else if(clickedLayer[0] === 3){
      this.organisationCategoryState = clickedLayer[1] ;
    }
    else if(clickedLayer[0] === 4){
      this.humanCategoryState = clickedLayer[1] ;
    }
    else if(clickedLayer[0] === 5){
      this.technologyCategoryState = clickedLayer[1] ;
    }
  }

  // functie die uitgevoerd word al er op een knop van de categorieen gedrukt word. Output van child component
   categoryButtonClicked(categoryNumber: number){
     console.log("categoryButtonClicked:", categoryNumber);
    if(categoryNumber === 1){
      this.wasteCategoryState = 1 - this.wasteCategoryState; //keert de status om van 0 naar of van 1 naar 0
      this.categoryFilter = [categoryNumber, this.wasteCategoryState];
    }
    if(categoryNumber === 2){
      this.inspirationCategoryState = 1 - this.inspirationCategoryState;
      this.categoryFilter = [categoryNumber, this.inspirationCategoryState];
    }
    if(categoryNumber === 3){
      this.organisationCategoryState = 1 - this.organisationCategoryState;
      this.categoryFilter= [categoryNumber, this.organisationCategoryState];
    }
    if(categoryNumber === 4){
      this.humanCategoryState = 1 - this.humanCategoryState;
      this.categoryFilter = [categoryNumber, this.humanCategoryState];
    }
    if(categoryNumber === 5){
      this.technologyCategoryState = 1 - this.technologyCategoryState;
      this.categoryFilter = [categoryNumber, this.technologyCategoryState];
    }

    //verander de lijst als er een categorieknop ingedrukt wordt
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

  //functie die uitgevoerd word als er in de component van de radius op de zoek knop wordt gedrukt: @output event
  filterRadiusClicked(radiusFilter: [number,number,number,boolean]){
    console.log('filterRadiusClicked: ',radiusFilter);
    this.filterRadius = radiusFilter;
  }

  //functie die uitgevoerd word als er in de component van de radius op de annuleer knop wordt gedrukt: @output event
  annuleerfilterRadiusClicked(){
    console.log('annuleerfilterRadiusClickedevent:');
    this.listdata = this.listdataInit;
    this.filterRadius = [0,0,0,false];
  }

  //functie die uitgevoerd word als er op de map punten geselecteerd zijn,
  selectedPointsEvent(event: []){
    console.log('selectedPointsEvent:' ,event);
    this.listdata = event
  }

  //functie die uitgevoerd word als er op een item uit de lijst geklikt wordt
  clickOnItemEvent(item: any){
    console.log('clickOnItemEvent: ', item);
    this.clickedItem = item;
  }

}
