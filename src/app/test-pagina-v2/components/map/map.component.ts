import { Component, AfterViewInit, OnInit, Input, SimpleChanges, Output, EventEmitter  } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit  {
  @Input() map!: L.Map;
  @Input() jsondata: any


  wasteLayer: any;
  inspirationLayer: any;
  humanLayer: any ;
  organisationLayer: any;
  techonolgyLayer: any;

  theCircle: any; //cirkel die de range aanduid
  theMarker: any; // marker voor middelpunt range
  geojsonLayer: any; //laag om de punten anders aan te duiden als ze binnen de range staan
  selPts:any = [];//geselecteerde punten binnen de range
  RadiusFilter!: [number,number,number,boolean];


  constructor() { }

  ngOnInit(): void {
  }
}
