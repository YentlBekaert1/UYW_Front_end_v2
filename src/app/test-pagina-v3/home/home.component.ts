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

  public geojsonList: any;
  public filterRadius: [number, number, number, boolean] = [0,0,0,false];

  public wasteCategoryState: number = 1;
  public inspirationCategoryState: number = 1;
  public humanCategoryState: number = 1;
  public organisationCategoryState: number = 1;
  public technologyCategoryState: number = 1;

  constructor() { }

  ngOnInit(): void {
    this.geojsonList = [];
    test_data.data.forEach((el: any) => {
      console.log(el.geojson)
      if(el.geojson !== null && el.geojson !== undefined){
        this.geojsonList.push(el.geojson);
      }
    });
  }

  // functie die uitgevoerd word al er op een knop van de categorieen gedrukt word. Output van child component
   categoryButtonClicked(categoryNumber: number){
    console.log("categoryButtonClicked:", categoryNumber);
    if(categoryNumber === 1){
      this.wasteCategoryState = 1 - this.wasteCategoryState; //keert de status om van 0 naar of van 1 naar 0
    }
    if(categoryNumber === 2){
      this.inspirationCategoryState = 1 - this.inspirationCategoryState;
    }
    if(categoryNumber === 3){
      this.organisationCategoryState = 1 - this.organisationCategoryState;
    }
    if(categoryNumber === 4){
      this.humanCategoryState = 1 - this.humanCategoryState;
    }
    if(categoryNumber === 5){
      this.technologyCategoryState = 1 - this.technologyCategoryState;
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
  }

  changeCategoryEvent(event: [number, number]){
    console.log('changeCategoryEvent: ', event);
    if(event[0] === 1){
      this.wasteCategoryState = event[1];
    }
    if(event[0] === 2){
      this.inspirationCategoryState = event[1];
    }
    if(event[0] === 3){
      this.organisationCategoryState = event[1];
    }
    if(event[0] === 4){
      this.humanCategoryState = event[1];
    }
    if(event[0] === 5){
      this.technologyCategoryState = event[1];
    }
  }
}
