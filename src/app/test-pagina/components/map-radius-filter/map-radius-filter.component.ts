import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';


@Component({
  selector: 'app-map-radius-filter',
  templateUrl: './map-radius-filter.component.html',
  styleUrls: ['./map-radius-filter.component.scss']
})
export class MapRadiusFilterComponent implements OnInit {

  @ViewChild("distanceSeletor") distanceSeletor!: ElementRef;
  @ViewChild("userLocationChechekbox") userLocationChechekbox!: ElementRef;
  @Output() filterRadius = new EventEmitter<[number,number,number,boolean]>(); //[afstand, lat, lng, useUserLocation]
  @Output() annuleerFilterRadius = new EventEmitter();
  distance: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  searchButtonClicked(){
    console.log('click');
    console.log(this.distanceSeletor.nativeElement.value, this.userLocationChechekbox.nativeElement.checked);
    this.distance = parseInt(this.distanceSeletor.nativeElement.value) * 1000 //*1000 om in kilometer te plaatsen
    this.filterRadius.emit([this.distance,0,0,this.userLocationChechekbox.nativeElement.checked]);
  }

  annuleerButtonClicked(){
    console.log('click');
    this.annuleerFilterRadius.emit();
  }
}
