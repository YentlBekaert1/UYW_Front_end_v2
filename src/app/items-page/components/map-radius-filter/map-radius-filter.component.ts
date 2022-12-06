import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter, Input, SimpleChanges} from '@angular/core';
import { Store } from '@ngrx/store';
import { updateFiltersFromFilterComponent, updateLocation, updateMaterials, updatePageURL } from 'src/app/store/filterstate/filter.actions';
import { Filters } from 'src/app/_models/filters';
import { Feature, GeosearchService } from '../../../_services/geosearch.service';


@Component({
  selector: 'app-map-radius-filter',
  templateUrl: './map-radius-filter.component.html',
  styleUrls: ['./map-radius-filter.component.scss']
})
export class MapRadiusFilterComponent implements OnInit {

  @ViewChild("distanceSeletor") distanceSeletor!: ElementRef;
  @ViewChild("userLocationChechekbox") userLocationChechekbox!: ElementRef;
  @ViewChild("textInput") textInput!: ElementRef;
  @ViewChild("materialInput") materialInput!: ElementRef;

  @Input() materials: any;
  @Output() filterRadius = new EventEmitter<Filters>(); //[afstand, lat, lng, useUserLocation]

  distance: number = 0;
  addresses: string[] = [];
  selectedAddress = "";

  selectedFitlers: Filters = {category:'', distance: 0, lat:0, lon:0, userLocation:false, material: 0};

  showMoreFiltes = false;

  constructor(private geoSearch: GeosearchService, private store: Store) { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if(changes['materials']){
      this.materials = changes['materials'].currentValue;
      //console.log(this.materials)
    }
  }

  searchButtonClicked(){
    var lat: any;
    var lon: any;
    var distance: number;
    var materialsArray: number[] = [];
    var selectedMaterialName: "";
    var selectedlocationName: "";
    //material select value

    if(this.materialInput.nativeElement.value > 0){
      materialsArray.push(parseInt(this.materialInput.nativeElement.value));
      selectedMaterialName = this.materialInput.nativeElement.selectedOptions[0].innerText;
    }

      //plaats distance
      distance = parseInt(this.distanceSeletor.nativeElement.value) * 1000 //*1000 om in kilometer te plaatsen

      //kijk of user location in gechecked
      if(this.userLocationChechekbox.nativeElement.checked){
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position)=>{
            lon = position.coords.longitude;
            lat = position.coords.latitude;

            this.store.dispatch(updateFiltersFromFilterComponent({
              query:"",
              materials:materialsArray,
              coordinates:[parseInt(lat),parseInt(lon)],
              distance:distance,
              material_name:selectedMaterialName,
              location_name:selectedlocationName
            }))
          });
           }else {
            //console.log("No support for geolocation");
          }
      }
      else{
        this.selectedFitlers.userLocation = false;
        //zoek hier de coordinaten van de plaats
        const searchTerm = this.textInput.nativeElement.value.toLowerCase();
        if (searchTerm && searchTerm.length > 0) {
            this.geoSearch
            .searchWordPhoton(searchTerm)
            .subscribe((features: any) => {
              //console.log(features)
              selectedlocationName = features[0].display_name;
              if(features[0].lat && features[0].lon){
                lat = features[0].lat;
                lon = features[0].lon;
              }
              else {
                lat = null;
                lon = null;
              }
              this.store.dispatch(updateFiltersFromFilterComponent({
                query:"",
                materials:materialsArray,
                coordinates:[parseFloat(lat),parseFloat(lon)],
                distance:distance,
                material_name:selectedMaterialName,
                location_name:selectedlocationName
              }))
            });
        }
        else {
          lat = null;
          lon = null;

          this.store.dispatch(updateFiltersFromFilterComponent({
            query:"",
            materials:materialsArray,
            coordinates:[lat,lon],
            distance:distance,
            material_name:selectedMaterialName,
            location_name:selectedlocationName
          }))
        }
      }
    }

    moreFiltersClicked(){
     this.showMoreFiltes = !this.showMoreFiltes
    }

}


