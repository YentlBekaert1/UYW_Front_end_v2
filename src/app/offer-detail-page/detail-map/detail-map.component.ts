import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { radiusCenterIcon } from 'src/app/items-page/components/map/customMarkers';

@Component({
  selector: 'app-detail-map',
  templateUrl: './detail-map.component.html',
  styleUrls: ['./detail-map.component.scss']
})
export class DetailMapComponent implements OnInit, OnDestroy {
  private map_detail! : any;
  @Input() lat_lan: any;

  constructor() { }

  ngOnInit(): void {
    this.initMap();
  }

  ngOnDestroy(){
    console.log('remove map');
    this.map_detail.remove();
  }

  private initMap(): void {
    //kaart op pagina plaatsen
      this.map_detail = L.map('map_detail', {
        center: [50.85, 3.6],
        zoom: 10,
        minZoom: 2,
        maxZoom: 19,
        scrollWheelZoom: false
    });

    //kaartlagen
    const mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
    const mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const satellite = L.tileLayer(mbUrl, {id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
    const streets = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

    //bepalen kaart lagen
    const baseLayers = {
      'OpenStreetMap': osm,
      'Streets': streets,
      'Satellite' :satellite
    };

    this.map_detail.addLayer(osm);

    //controller toevoegen aan de map = rechtsboven knop om venster open te maken
    const layerControl = L.control.layers(baseLayers).addTo(this.map_detail);

    if(this.lat_lan != undefined && this.map_detail != undefined){
      //console.log(this.lat_lan);
      const icon = L.divIcon({
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [10, 0],
        shadowSize: [0, 0],
        className: 'user_location_icon' // class css staat in global styles.css
      });
      // create marker
      var marker = L.marker(this.lat_lan , {icon: radiusCenterIcon,title: 'user location'});
      marker.addTo(this.map_detail);
      this.map_detail.setView(this.lat_lan, 10)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['lat_lan']){
      if(changes['lat_lan'].currentValue != undefined && this.map_detail != undefined){
        //console.log(changes['lat_lan']);
        const icon = L.divIcon({
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [10, 0],
          shadowSize: [0, 0],
          className: 'user_location_icon' // class css staat in global styles.css
        });
        // create marker
        var marker = L.marker(changes['lat_lan'].currentValue, {icon: icon,title: 'user location'});
        marker.addTo(this.map_detail);
        this.map_detail.setView(changes['lat_lan'].currentValue, 10)
      }
    }
  }

}
