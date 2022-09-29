import { Component, OnInit } from '@angular/core';
import data from '../../../assets/geojson.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'LeafLetMapTest';
  public geojsonList: any = data;
  public categoryFilterNumber: [number, number] = [0,0];
  public radiusFilterValues: [number, number, number, boolean]= [0,0,0,false];
  public listdataInit:any = [];
  public listdata:any = [];
  public listDataAfterFilter:any = [];
  public selPts:any = [];

  wasteCategoryState: number = 1;
  inspirationCategoryState: number = 1;
  humanCategoryState: number = 1;
  organisationCategoryState: number = 1;
  technologyCategoryState: number = 1;

  constructor() { }

  ngOnInit(): void {
    this.listdataInit = this.geojsonList.data;
    this.listdata = this.geojsonList.data;
  }

  // functie die uitgevoerd word al er op een knop van de categorieen gedrukt word. Output van child component
  categoryButtonClicked(categoryNumber: number){
    console.log("Bericht van parent:", categoryNumber);
    if(categoryNumber === 1){
      this.wasteCategoryState = 1 - this.wasteCategoryState; //keert de status om van 0 naar of van 1 naar 0
      this.categoryFilterNumber = [categoryNumber, this.wasteCategoryState];
    }
    if(categoryNumber === 2){
      this.inspirationCategoryState = 1 - this.inspirationCategoryState;
      this.categoryFilterNumber = [categoryNumber, this.inspirationCategoryState];
    }
    if(categoryNumber === 3){
      this.organisationCategoryState = 1 - this.organisationCategoryState;
      this.categoryFilterNumber = [categoryNumber, this.organisationCategoryState];
    }
    if(categoryNumber === 4){
      this.humanCategoryState = 1 - this.humanCategoryState;
      this.categoryFilterNumber = [categoryNumber, this.humanCategoryState];
    }
    if(categoryNumber === 5){
      this.technologyCategoryState = 1 - this.technologyCategoryState;
      this.categoryFilterNumber = [categoryNumber, this.technologyCategoryState];
    }
    //verander de lijst als er een categorieknop ingedrukt wordt
    this.listDataAfterFilter = [];
    this.listdataInit.forEach((element: any) => {
      console.log(element.properties);
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
    //console.log(this.listDataAfterFilter);
    this.listdata = [];
    this.listdata = this.listDataAfterFilter;
  }

  categoryControlClicked(categoryNumber: [number,number]){
    console.log("Bericht van parent:", categoryNumber);
    if(categoryNumber[0] === 1){
      console.log('before: ', this.wasteCategoryState);
      this.wasteCategoryState = categoryNumber[1]; //keert de status om van 0 naar of van 1 naar 0
      console.log('after: ',this.wasteCategoryState);
    }
    if(categoryNumber[0] === 2){
      this.inspirationCategoryState = categoryNumber[1] ;
    }
    if(categoryNumber[0] === 3){
      this.organisationCategoryState = categoryNumber[1] ;
    }
    if(categoryNumber[0] === 4){
      this.humanCategoryState = categoryNumber[1] ;
    }
    if(categoryNumber[0] === 5){
      this.technologyCategoryState = categoryNumber[1] ;
    }
  }

  filterRadiusClicked(emitResult: [number,number,number,boolean]){
    console.log("Bericht van parent:", emitResult);
    this.radiusFilterValues = emitResult;
  }

  selectedPointsEvent(event: []){
    console.log('selectedPointsEvent:' ,event);
    this.listdata = event
  }

  annuleerfilterRadiusClicked(){
    console.log('annuleerfilterRadiusClickedevent:');
    this.listdata = this.geojsonList.data;
    this.radiusFilterValues = [0,0,0,false];
  }

}
