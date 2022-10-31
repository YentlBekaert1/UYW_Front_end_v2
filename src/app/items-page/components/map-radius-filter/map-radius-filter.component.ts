import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
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

  @Output() filterRadius = new EventEmitter<[number,number,number,boolean]>(); //[afstand, lat, lng, useUserLocation]
  @Output() annuleerFilterRadius = new EventEmitter();
  distance: number = 0;

  addresses: string[] = [];
  selectedAddress = "";

  searchStatus: boolean = false;

  constructor(private geoSearch: GeosearchService) { }

  ngOnInit(): void {
  }

  searchButtonClicked(){
    if(this.searchStatus === false){
      this.distance = parseInt(this.distanceSeletor.nativeElement.value) * 1000 //*1000 om in kilometer te plaatsen
      if(this.userLocationChechekbox.nativeElement.checked){
        this.filterRadius.emit([this.distance,0,0,this.userLocationChechekbox.nativeElement.checked]);
      }
      else{
        //zoek hier de coordinaten van de plaats
        console.log('input:',this.textInput.nativeElement.value);
        const searchTerm = this.textInput.nativeElement.value.toLowerCase();
        if (searchTerm && searchTerm.length > 0) {
            this.geoSearch
            .searchWordPhoton(searchTerm)
            .subscribe((features: any) => {
              if(features[0].lat && features[0].lon){
                console.log(features[0].lat, features[0].lon)
                this.filterRadius.emit([this.distance,features[0].lat,features[0].lon,this.userLocationChechekbox.nativeElement.checked]);
              }
            });
        }
        else {
            this.filterRadius.emit([this.distance,0,0,this.userLocationChechekbox.nativeElement.checked]);
        }
      }
      this.searchStatus = true;
    }
    else if(this.searchStatus === true){
      this.annuleerFilterRadius.emit();
      this.searchStatus = false;
    }


  }

  annuleerButtonClicked(){
    this.annuleerFilterRadius.emit();
  }

}
