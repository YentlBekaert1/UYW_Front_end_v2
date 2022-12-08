import { Component, AfterViewInit, OnInit, Input, SimpleChanges, Output, EventEmitter, OnDestroy  } from '@angular/core';
import { Store } from '@ngrx/store';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { selectAllFilters } from 'src/app/store/filterstate/filter.selector';
import { environment } from 'src/environments/environment';
import { OfferlocationService } from '../../../_services/offerlocation.service';

import {wasteIcon,inspirationIcon,organisationIcon,humanIcon,technologyIcon,radiusCenterIcon,wasteIconRadius,
  inspirationIconRadius,organisationIconRadius,humanIconRadius,technologyIconRadius} from './customMarkers'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy  {
  @Input() jsonData!: any
  @Input() categoryFilter!: [number,number];
  @Input() radiusFilterValues!: [number,number,number,boolean];
  @Input() clickedItem: any;
  @Input() active_tab!: string;

  @Output() categoryControlEvent = new EventEmitter<[number,number]>();
  @Output() selectedPointsEvent = new EventEmitter<[]>(); //geselecteerde punten na zoeken in straal;

  private map! : any;
  private geoJSONData!: L.GeoJSON;
  private userLocation: any;
  private userLocationLat: any;
  private userLocationLng: any;
  private theCircle: any; //cirkel die de range aanduid
  private theMarker: any; // marker voor middelpunt range
  markerCluster = new L.MarkerClusterGroup();

  zoomtimeout = null;
  pantimeout = null;
  canZoom = true;
  url = environment.apiUrl;
  storeFilters:any;
  //true = toon ennkel de markers die zichtbaar zijn op de kaart, false =  toon al de marker meteen
  useMapBounds: boolean = false;

  mapisInit = false;

  constructor(private locationService: OfferlocationService, private store: Store) {
    this.store.select(selectAllFilters).subscribe( res => {
      this.storeFilters = res;
      if(this.map){
        const bounds = this.map.getBounds();
        //console.log(this.storeFilters);
        if (this.theCircle != undefined) {
          this.map.removeLayer(this.theCircle);
        };
        if (this.theMarker != undefined) {
            this.map.removeLayer(this.theMarker);
        };
        if(this.storeFilters.coordinates[0] != null && this.storeFilters.coordinates[1] != null){
            //gebruik search location
            this.theMarker = L.marker([this.storeFilters.coordinates[0],this.storeFilters.coordinates[1]], {icon: radiusCenterIcon}).addTo(this.map);
            this.theCircle = L.circle([this.storeFilters.coordinates[0],this.storeFilters.coordinates[1]], this.storeFilters.distance ,
            {
              color: 'orange',
              fillOpacity: 0,
              opacity: 1
            }).addTo(this.map);
        }
        this.getMarkerbyLocation(bounds);
        if(this.storeFilters.distance <= 10000){
          this.zoomToPoint([this.storeFilters.coordinates[0],this.storeFilters.coordinates[1]], 11);
        }
        else if(this.storeFilters.distance <= 25000){
          this.zoomToPoint([this.storeFilters.coordinates[0],this.storeFilters.coordinates[1]], 10);
        }
        else if(this.storeFilters.distance <= 50000){
          this.zoomToPoint([this.storeFilters.coordinates[0],this.storeFilters.coordinates[1]], 9);
        }
        else if(this.storeFilters.distance <= 100000){
          this.zoomToPoint([this.storeFilters.coordinates[0],this.storeFilters.coordinates[1]], 8);
        }
        else if(this.storeFilters.distance <= 200000){
          this.zoomToPoint([this.storeFilters.coordinates[0],this.storeFilters.coordinates[1]], 7);
        }
        else if(this.storeFilters.distance <= 300000){
          this.zoomToPoint([this.storeFilters.coordinates[0],this.storeFilters.coordinates[1]], 6.5);
        }
        else if(this.storeFilters.distance <= 500000){
          this.zoomToPoint([this.storeFilters.coordinates[0],this.storeFilters.coordinates[1]], 6);
        }
      }
    })
  }

  zoomToPoint(coord: [number,number], zoom: number){
    this.map.flyTo(coord, zoom)
  }

  private initMap(): void {
    //kaart op pagina plaatsen
      this.map = L.map('map', {
        center: [50.85, 3.6],
        zoom: 8,
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

    //lagen toevoegen aan map
    this.map.addLayer(osm);

    //controller toevoegen aan de map = rechtsboven knop om venster open te maken
    const layerControl = L.control.layers(baseLayers).addTo(this.map);

    if(this.useMapBounds == false){
      var bounds = "";
      this.getMarkerbyLocation(bounds);
    }

    /* --------------------------------------- KAART LATEN INZOOMEN OP GEBRUIKER -------------------------------------------------------------------*/
    //vraag de gebruiker om zijn locatie
    this.map.locate({setView: false, maxZoom:8});

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
       this.map.addLayer(marker);
     }

     this.map.on('locationfound', onLocationFound);

     this.map.on('zoomend', (event: any)=>{
        //als de map kan zoomen en de we willen enkel de markers laden die zichtbaar op de kaart zouden staan
        if(this.canZoom == true && this.useMapBounds == true){
          clearTimeout(this.zoomtimeout);
          // Make a new timeout set to go off in 1000ms (1 second)
          this.zoomtimeout = setTimeout(() => {
            //console.log(event.target.value);
            var bounds = event.target.getBounds();
            this.getMarkerbyLocation(bounds);
          }, 500);
        }
      });

      this.map.on('move', (event: any)=>{
        //als de map kan zoomen en de we willen enkel de markers laden die zichtbaar op de kaart zouden staan
        if(this.canZoom == true && this.useMapBounds == true){
          clearTimeout(this.zoomtimeout);
          // Make a new timeout set to go off in 1000ms (1 second)
          this.zoomtimeout = setTimeout(() => {
            //console.log(event.target.value);
            var bounds = event.target.getBounds();
            this.getMarkerbyLocation(bounds);
          }, 500);
        }
      });

      //als we een pop up openen willen we niet dat de markers opnieuw laden (kaart verschuifd soms een beetje)
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
    this.mapisInit = true;
  }

  getMarkerbyLocation(resbounds: any){
    if(this.useMapBounds == true){
      var bounds = resbounds;
      this.locationService.getLocationsWithBounds({
        latNW: bounds._northEast.lat,
        latSE: bounds._southWest.lat,
        lonNW: bounds._northEast.lng,
        lonSE: bounds._southWest.lng
        },
        {
          categories: this.storeFilters.categories.toString(),
          materials:this.storeFilters.materials.toString(),
          query:this.storeFilters.query,
          lat: this.storeFilters.coordinates[0],
          lon:this.storeFilters.coordinates[1],
          distance: this.storeFilters.distance
        }).subscribe(data=>{
        this.addMarkers(data);
      });
    }
    else{
      this.locationService.getLocationsWithoutBounds(
        {
          categories: this.storeFilters.categories.toString(),
          materials:this.storeFilters.materials.toString(),
          query:this.storeFilters.query,
          lat: this.storeFilters.coordinates[0],
          lon:this.storeFilters.coordinates[1],
          distance: this.storeFilters.distance
        }).subscribe(data=>{
        this.addMarkers(data);
      });
    }
  }

  //------test marker cluster--------
  // addMarkerCluster(data: any){
  //   const markerCluster = new L.MarkerClusterGroup();
	// 	var markerList = [];
  //   for (var i = 0; i < data.length; i++) {
  //     console.log(data);
	// 		var a = data[i].geometry.coordinates;
	// 		var title = data[i].properties.title;
	// 		var marker = L.marker(L.latLng(a), { icon: wasteIcon });
	// 		marker.bindPopup(title);
	// 		markerCluster.addLayer(marker);
	// 	}
  //   console.log(markerCluster);
	// 	this.map.addLayer(markerCluster);
  // }

  //functie die de markers op de kaartoevoegd.

  addMarkers(data: any){
    this.removeAllMarkers();
    this.markerCluster = new L.MarkerClusterGroup();
    /* --------------------------------------- MARKERS TOEVOEGEN VANUIT GEOJSON -------------------------------------------------------------------*/
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

      this.markerCluster.addLayer(layer);
    }

    this.geoJSONData = L.geoJSON(data, {
            onEachFeature: onEachFeature,
            pointToLayer: function(feature, latlng) {
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
              }
    });
    //this.map.removeLayer(markerCluster);
    this.map.addLayer(this.markerCluster);
  }

  removeAllMarkers(){
    //console.log(this.markerCluster);
    this.map.removeLayer(this.markerCluster);
  }

  //functie uitgevoerd bij initialiseren component
  ngOnInit(): void {
      if(this.mapisInit === false){
        console.log('init map')
          this.initMap();
      }
  }
  
  ngOnDestroy(){
    console.log('remove map');
    this.map.remove();
  }
  //als er een verandering gebeurt van een Input()
  ngOnChanges(changes: SimpleChanges) {
    if(changes['active_tab']){
      if(changes['active_tab'].currentValue != undefined && this.map != undefined){
          //console.log('changeMapSize')
          this.map.invalidateSize()
          //this.map.locate({setView: true, maxZoom: 16});
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
