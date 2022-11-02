import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter, Input, SimpleChanges} from '@angular/core';
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

  selectedFitlers: Filters = {category:0, distance: 0, lat:0, lon:0, userLocation:false, material: 0};

  showMoreFiltes = false;

  constructor(private geoSearch: GeosearchService) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['materials']){
      this.materials = changes['materials'].currentValue;
      console.log(this.materials)
    }
  }

  searchButtonClicked(){
      //material select value
      this.selectedFitlers.material = this.materialInput.nativeElement.value;
      //plaats distance
      this.selectedFitlers.distance = parseInt(this.distanceSeletor.nativeElement.value) * 1000 //*1000 om in kilometer te plaatsen
      //kijk of user location in gechecked
      if(this.userLocationChechekbox.nativeElement.checked){
        this.selectedFitlers.userLocation = true;
      }
      else{
        this.selectedFitlers.userLocation = false;
        //zoek hier de coordinaten van de plaats
        const searchTerm = this.textInput.nativeElement.value.toLowerCase();
        if (searchTerm && searchTerm.length > 0) {
            this.geoSearch
            .searchWordPhoton(searchTerm)
            .subscribe((features: any) => {
              if(features[0].lat && features[0].lon){
                this.selectedFitlers.lat = features[0].lat;
                this.selectedFitlers.lon = features[0].lon;
                this.filterRadius.emit(this.selectedFitlers);
              }
              else {
                this.selectedFitlers.lat = 0;
                this.selectedFitlers.lon = 0;
                this.filterRadius.emit(this.selectedFitlers);
              }
            });
        }
        else {
          this.selectedFitlers.lat = 0;
          this.selectedFitlers.lon = 0;
          this.filterRadius.emit(this.selectedFitlers);
        }
      }


    }

    moreFiltersClicked(){
     this.showMoreFiltes = !this.showMoreFiltes
    }

}


