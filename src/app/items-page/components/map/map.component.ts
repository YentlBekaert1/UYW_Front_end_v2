import { Component, AfterViewInit, OnInit, Input, SimpleChanges, Output, EventEmitter  } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { environment } from 'src/environments/environment';
import { OfferlocationService } from '../../../_services/offerlocation.service';

import {wasteIcon,inspirationIcon,organisationIcon,humanIcon,technologyIcon,radiusCenterIcon,wasteIconRadius,
  inspirationIconRadius,organisationIconRadius,humanIconRadius,technologyIconRadius} from './customMarkers'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit  {
  @Input() jsonData!: any
  @Input() categoryFilter!: [number,number];
  @Input() radiusFilterValues!: [number,number,number,boolean];
  @Input() clickedItem: any;
  @Input() active_tab!: string;

  @Output() categoryControlEvent = new EventEmitter<[number,number]>();
  @Output() selectedPointsEvent = new EventEmitter<[]>(); //geselecteerde punten na zoeken in straal;

  private map! : any;
  private userLocation: any;
  private userLocationLat: any;
  private userLocationLng: any;

  private wasteLayer: any;
  private inspirationLayer: any;
  private humanLayer: any ;
  private organisationLayer: any;
  private techonolgyLayer: any;

  private wasteMarkers: any[] = new Array();
  private inspirationMarkers = new Array();
  private humanMarkers = new Array();
  private organisationMarkers = new Array();
  private techonolgyMarkers = new Array();

  private geoJSONData!: L.GeoJSON;

  private theCircle: any; //cirkel die de range aanduid
  private theMarker: any; // marker voor middelpunt range
  private geojsonLayer: any; //laag om de punten anders aan te duiden als ze binnen de range staan
  private selPts:any = [];//geselecteerde punten binnen de range
  private RadiusFilter!: [number,number,number,boolean];

  zoomtimeout = null;
  pantimeout = null;

  canZoom = true;

  url = environment.apiUrl;

  constructor(private locationService: OfferlocationService) { }

  private initMap(): void {
    //kaart op pagina plaatsen
      this.map = L.map('map', {
        center: [50.85, 3.6],
        zoom: 10,
        minZoom: 4,
        maxZoom: 17
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

    //marker lagen
    //verschillende lagen aanmaken voor ieder categorie
    this.wasteLayer = L.layerGroup();
    this.inspirationLayer = L.layerGroup();
    this.humanLayer = L.layerGroup();
    this.organisationLayer = L.layerGroup();
    this.techonolgyLayer = L.layerGroup();

    //bepalen markers lagen
    const overlays = {
      'Afval': this.wasteLayer,
      'Inspiratie': this.inspirationLayer,
      'Mens': this.humanLayer,
      'Organisatie': this.organisationLayer,
      'Techonolgie': this.techonolgyLayer
    };


    // var markers = L.markerClusterGroup({ chunkedLoading: true });

    // markers.addLayers(this.wasteMarkers);
    // markers.addLayers(this.inspirationMarkers);
    // markers.addLayers(this.humanMarkers);
    // markers.addLayers(this.organisationMarkers);

    // this.map.addLayer(markers);

    //lagen toevoegen aan map
    this.map.addLayer(osm);

    //controller toevoegen aan de map = rechtsboven knop om venster open te maken
    const layerControl = L.control.layers(baseLayers,overlays).addTo(this.map);

    /* --------------------------------------- KAART LATEN INZOOMEN OP GEBRUIKER -------------------------------------------------------------------*/
    //vraag de gebruiker om zijn locatie
    this.map.locate({setView: true, maxZoom: 16});

   //functie die een cirkel rond de locatie plaatst en er een marker toevoegd.
    const onLocationFound = (e: any) => {
      //radius is in meter
      //var radius = e.accuracy;
      //L.circle(e.latlng, radius).addTo(map);
      this.userLocation = e.latlng;
      this.userLocationLat = e.latlng.lat;
      this.userLocationLng= e.latlng.lng;

      const icon = L.divIcon({
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [10, 0],
          shadowSize: [0, 0],
          className: 'user_location_icon' // class css staat in global styles.css
      });
       // create marker
       var marker = L.marker(e.latlng, {icon: icon,title: 'user location'});
       marker.addTo(this.map);
     }

     this.map.on('locationfound', onLocationFound);

     this.map.on('zoomend', (event: any)=>{
        if(this.canZoom == true){
          clearTimeout(this.zoomtimeout);
          // Make a new timeout set to go off in 1000ms (1 second)
          this.zoomtimeout = setTimeout(() => {
            //console.log(event.target.value);
            var bounds = event.target.getBounds();
            this.removeAllMarkers();
            this.getMarkerbyLocation(bounds);
          }, 500);
        }
      });

      this.map.on('move', (event: any)=>{
        if(this.canZoom == true){
          clearTimeout(this.zoomtimeout);
          // Make a new timeout set to go off in 1000ms (1 second)
          this.zoomtimeout = setTimeout(() => {
            //console.log(event.target.value);
            var bounds = event.target.getBounds();
            this.removeAllMarkers();
            this.getMarkerbyLocation(bounds);
          }, 500);
        }
      });

      this.map.on('autopanstart', (event: any)=>{
        this.canZoom = false;
        clearTimeout(this.zoomtimeout);
        this.zoomtimeout = setTimeout(() => {
          this.canZoom = true;
        }, 2000);
      });
      this.map.on('popupopen', (event: any)=>{
        this.canZoom = false;
      });
      this.map.on('popupclose', (event: any)=>{
        this.canZoom = true;
      });


    //laat de map een event geven als er een overlay aangeklikt in de controller van de map
    // this.map.on('overlayadd', this.overlayControlClicked);
    // this.map.on('overlayremove', this.overlayControlClicked);

  }

  getMarkerbyLocation(resbounds: any){
    var bounds = resbounds;
    this.locationService.getLocations({
      latNW: bounds._northEast.lat,
      latSE: bounds._southWest.lat,
      lonNW: bounds._northEast.lng,
      lonSE: bounds._southWest.lng
    }).subscribe(data=>{
      this.addMarkers(data);
    });
  }

  addMarkerCluster(data: any){
    const markerCluster = new L.MarkerClusterGroup();
		var markerList = [];
    for (var i = 0; i < data.length; i++) {
      console.log(data);
			var a = data[i].geometry.coordinates;
			var title = data[i].properties.title;
			var marker = L.marker(L.latLng(a), { icon: wasteIcon });
			marker.bindPopup(title);
			markerCluster.addLayer(marker);
		}
    console.log(markerCluster);
		this.map.addLayer(markerCluster);
  }

  //functie die de markers op de kaartoevoegd.
  addMarkers(data: any){
    /* --------------------------------------- MARKERS TOEVOEGEN VANUIT GEOJSON -------------------------------------------------------------------*/
    const markerCluster = new L.MarkerClusterGroup();
    //var zoom = this.map._zoom;
    //oneachfuter functie om functies bij de geojson bij te voegen voor dat ze geladen worden in dit geval een popup waneer er op geklikt word.
    const onEachFeature = (feature: any, layer: any) => {
      //geef de naam weer als ID, belangrijk om later op in te zoomen bij klikken
      //layer._leaflet_id = feature.properties.title;

      //does this feature have a property named popupContent?
      if (feature.properties && feature.properties.title) {
        if(feature.properties.images[0]){
          var content = popUpGenerator(feature.properties.id,feature.properties.title, feature.properties.images[0].filename, feature.properties.category,feature.properties.materials);
        }else{
          var content = popUpGenerator(feature.properties.id,feature.properties.title, "images/resources/default.png", feature.properties.category,feature.properties.materials);
        }

          layer.bindPopup(content);
      }

      markerCluster.addLayer(layer);
      // //voeg de marker toe aan de juiste categorie
      // if(feature.properties.category === 1){
      //     layer.addTo(this.wasteLayer);
      //     this.wasteMarkers.push(layer._leaflet_id);
      // }
      // else if(feature.properties.category === 2){
      //     layer.addTo(this.inspirationLayer);
      //     this.inspirationMarkers.push(layer._leaflet_id);
      // }
      // else if(feature.properties.category === 3){
      //     layer.addTo(this.humanLayer);
      //     this.humanMarkers.push(layer._leaflet_id);
      // }
      // else if(feature.properties.category === 4){
      //     layer.addTo(this.organisationLayer);
      //     this.organisationMarkers.push(layer._leaflet_id);
      // }
      // else if(feature.properties.category === 5){
      //     layer.addTo(this.techonolgyLayer);
      //     this.techonolgyMarkers.push(layer._leaflet_id);
      // }
      // else{
      //     layer.addTo(this.map);
      // }
    }

    this.geoJSONData = L.geoJSON(data, {
            onEachFeature: onEachFeature,
            pointToLayer: function(feature, latlng) {
              console.log(feature)
               //if(zoom >= 10){
                    if(feature.properties.category === 1){
                      return L.marker(L.latLng(latlng), { icon: wasteIcon })
                    }
                    else if(feature.properties.category === 2){
                        return L.marker(L.latLng(latlng), { icon: inspirationIcon })
                    }
                    else if(feature.properties.category === 3){
                        return L.marker(L.latLng(latlng), { icon: humanIcon })
                    }
                    else if(feature.properties.category === 4){
                        return L.marker(L.latLng(latlng), { icon:  organisationIcon})
                    }
                    else if(feature.properties.category === 5){
                        return L.marker(L.latLng(latlng), { icon: technologyIcon })
                    }
                    else{
                        return L.circleMarker(L.latLng(latlng), {
                            radius:6,
                            opacity: .5,
                            color: "#000",
                            fillOpacity: 0.8
                        });
                    }
              //}
               //else{
               // return L.circleMarker(latlng, {radius:6,opacity: 1,color: "#42998B",fillOpacity: 0.8});
              // }
            }

    });
    this.map.addLayer(markerCluster);
    //console.log(this.map._zoom);
  }

  removeAllMarkers(){
    for(var i=0;i<this.wasteMarkers.length;i++){
      this.wasteLayer.removeLayer(this.wasteMarkers[i]);
    }
    for(var i=0;i<this.inspirationMarkers.length;i++){
      this.inspirationLayer.removeLayer(this.inspirationMarkers[i]);
    }
    for(var i=0;i<this.humanMarkers.length;i++){
      this.humanLayer.removeLayer(this.humanMarkers[i]);
    }
    for(var i=0;i<this.organisationMarkers.length;i++){
      this.organisationLayer.removeLayer(this.organisationMarkers[i]);
    }
    for(var i=0;i<this.techonolgyMarkers.length;i++){
      this.techonolgyLayer.removeLayer(this.techonolgyMarkers[i]);
    }
    this.wasteMarkers = [];
    this.inspirationMarkers = [];
    this.humanMarkers = [];
    this.organisationMarkers = [];
    this.techonolgyMarkers = [];
  }

  //functie uitgevoerd bij initialiseren component
  ngOnInit(): void {
      this.initMap();
  }

  //als er een verandering gebeurt van een Input()
  ngOnChanges(changes: SimpleChanges) {
    if(changes['active_tab']){
      if(changes['active_tab'].currentValue != undefined && this.map != undefined){
          console.log('changeMapSize')
          this.map.invalidateSize()
          this.map.locate({setView: true, maxZoom: 16});
      }
    }
  }

  //einde functie initMap
}

function popUpGenerator(id: number, name: string, image: string, category: number, material:any){
  var categorienaam = ""
  var materialnaam = ""
  if(category == 1){
    categorienaam = "Afval";
  }else  if(category == 2){
    categorienaam = "Inspiratie";
  }else  if(category == 3){
    categorienaam = "Persoon";
  }else  if(category == 4){
    categorienaam = "Organisatie";
  }else  if(category == 1){
    categorienaam = "Technologie";
  }

  if(material[0]){
    materialnaam = material[0].name;
  }
  return '<a href="https://upcycleyourwaste.be/offerdetail/'+id+'"  style="max-width: 150px; text-decoration:none; display:block; color:black">'
      +'<img src="https://backend.upcycleyourwaste.be/'+image+'" style="width: 100%; object-fit: contain;">'
      +'<p style="font-family: montserrat-light; font-size: .8rem; font-weight: 600; margin:.3rem 0;" >'+name+'</p>'
      +'<p style="font-family: montserrat-light; font-size: .8rem; color:#ffb048;  font-weight: 600; margin:.3rem 0;">'+categorienaam+'</p>'
      +'<p style="font-family: montserrat-light; font-size: .8rem; margin:.3rem 0;">Materiaal: '+materialnaam+'</p>'
    +'</a>'
}

//https://backend.upcycleyourwaste.be/'+image+'
