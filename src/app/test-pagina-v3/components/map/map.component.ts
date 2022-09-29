import { Component, AfterViewInit, OnInit, Input, SimpleChanges, Output, EventEmitter  } from '@angular/core';
import * as L from 'leaflet';
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
  @Output() categoryControlEvent = new EventEmitter<[number,number]>();
  @Output() selectedPointsEvent = new EventEmitter<[]>(); //geselecteerde punten na zoeken in straal;

  map! : any;
  userLocation: any;
  userLocationLat: any;
  userLocationLng: any;

  wasteLayer: any;
  inspirationLayer: any;
  humanLayer: any ;
  organisationLayer: any;
  techonolgyLayer: any;

  geoJSONData!: L.GeoJSON;

  theCircle: any; //cirkel die de range aanduid
  theMarker: any; // marker voor middelpunt range
  geojsonLayer: any; //laag om de punten anders aan te duiden als ze binnen de range staan
  selPts:any = [];//geselecteerde punten binnen de range
  RadiusFilter!: [number,number,number,boolean];


  constructor() { }

  private initMap(): void {
    //kaart op pagina plaatsen
      this.map = L.map('map', {
        center: [50.85, 3.6],
        zoom: 10,
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

    //lagen toevoegen aan map
    this.map.addLayer(osm);
    this.map.addLayer(this.wasteLayer);
    this.map.addLayer(this.inspirationLayer);
    this.map.addLayer(this.humanLayer);
    this.map.addLayer(this.organisationLayer);
    this.map.addLayer(this.techonolgyLayer);

    //controller toevoegen aan de map = rechtsboven knop om venster open te maken
    const layerControl = L.control.layers(baseLayers, overlays).addTo(this.map);

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
          iconSize: [30, 30],
          iconAnchor: [10, 10],
          popupAnchor: [10, 0],
          shadowSize: [0, 0],
          className: 'user_location_icon' // class css staat in global styles.css
      });

      // create marker
      var marker = L.marker(e.latlng, {icon: icon,title: 'user location'});
      marker.addTo(this.map);
    }

    //als de map de locatie gevonden heeft gaat hij de functie location found uitvoeren
    this.map.on('locationfound', onLocationFound);
    this.addMarkers(this.jsonData);

    //laat de map een event geven als er een overlay aangeklikt in de controller van de map
    this.map.on('overlayadd', this.overlayControlClicked);
    this.map.on('overlayremove', this.overlayControlClicked);
  }

  //functie die de markers op de kaartoevoegd.
  addMarkers(data: any){

    /* --------------------------------------- MARKERS TOEVOEGEN VANUIT GEOJSON -------------------------------------------------------------------*/

    //oneachfuter functie om functies bij de geojson bij te voegen voor dat ze geladen worden in dit geval een popup waneer er op geklikt word.
    const onEachFeature = (feature: any, layer: any) => {
      //geef de naam weer als ID, belangrijk om later op in te zoomen bij klikken
      layer._leaflet_id = feature.properties.name;

      //does this feature have a property named popupContent?
      if (feature.properties && feature.properties.name) {
          layer.bindPopup(feature.properties.name);
      }

      //voeg de marker toe aan de juiste categorie
      if(feature.properties.category === '1'){
          layer.addTo(this.wasteLayer);
      }
      else if(feature.properties.category === '2'){
          layer.addTo(this.inspirationLayer);
      }
      else if(feature.properties.category === '3'){
          layer.addTo(this.organisationLayer);
      }
      else if(feature.properties.category === '4'){
          layer.addTo(this.humanLayer);
      }
      else if(feature.properties.category === '5'){
          layer.addTo(this.techonolgyLayer);
      }
      else{
          layer.addTo(this.map);
      }
    }

    this.geoJSONData = L.geoJSON(data, {
            onEachFeature: onEachFeature,
            pointToLayer: function(feature, latlng) {
                //console.log(feature.properties.category);
			          if(feature.properties.category === '1'){
                    return L.marker(latlng, { icon: wasteIcon })
                }
                else if(feature.properties.category === '2'){
                    return L.marker(latlng, { icon: inspirationIcon })
                }
                else if(feature.properties.category === '3'){
                    return L.marker(latlng, { icon: organisationIcon })
                }
                else if(feature.properties.category === '4'){
                    return L.marker(latlng, { icon: humanIcon })
                }
                else if(feature.properties.category === '5'){
                    return L.marker(latlng, { icon: technologyIcon })
                }
                else{
                    return L.circleMarker(latlng, {
                        radius:6,
                        opacity: .5,
                        color: "#000",
                        fillOpacity: 0.8
                    });
                }
            }

    });
    //console.log(this.map);
  }

  //functie die uitgevoed word als er een overlay aangeklikt wordt in de controller van de map
  overlayControlClicked = (e: any) =>{
    if(e.type === 'overlayadd'){
      if(e.name === 'Afval'){
        this.categoryControlEvent.emit([1,1]);
      }else if(e.name === 'Inspiratie'){
        this.categoryControlEvent.emit([2,1]);
      }else if(e.name === 'Mens'){
        this.categoryControlEvent.emit([4,1]);
      }else if(e.name === 'Organisatie'){
        this.categoryControlEvent.emit([3,1]);
      }else if(e.name === 'Techonolgie'){
        this.categoryControlEvent.emit([5,1]);
      }
    }else if(e.type === 'overlayremove'){
      if(e.name === 'Afval'){
        this.categoryControlEvent.emit([1,0]);
      }else if(e.name === 'Inspiratie'){
        this.categoryControlEvent.emit([2,0]);
      }else if(e.name === 'Mens'){
        this.categoryControlEvent.emit([4,0]);
      }else if(e.name === 'Organisatie'){
        this.categoryControlEvent.emit([3,0]);
      }else if(e.name === 'Techonolgie'){
        this.categoryControlEvent.emit([5,0]);
      }
    }
    this.ProcessRadiusFilter(this.RadiusFilter);
  }

  //functie die de lagen van de markers in of uitschakeld door categorienummer en state mee te geven
  FilterByCategorie(categoryNumber: [number, number]) {
    //wasteFilter
    if(categoryNumber[0] == 1 && categoryNumber[1] == 1){
      if(!this.map.hasLayer(this.wasteLayer)) {
        this.map.addLayer(this.wasteLayer);
      }
    }
    else if(categoryNumber[0] == 1 && categoryNumber[1] == 0){
      if( this.map.hasLayer(this.wasteLayer)) {
        this.map.removeLayer(this.wasteLayer);
      }
    }
    //InspirationFilter
    if(categoryNumber[0] == 2 && categoryNumber[1] == 1){
      if( !this.map.hasLayer(this.inspirationLayer)) {
        this.map.addLayer(this.inspirationLayer);
      }
    }
    else if(categoryNumber[0] == 2 && categoryNumber[1] == 0){
      if( this.map.hasLayer(this.inspirationLayer)) {
        this.map.removeLayer(this.inspirationLayer);
      }
    }
    //OrganisationFilter
    if(categoryNumber[0] == 3 && categoryNumber[1] == 1){
      if( !this.map.hasLayer(this.organisationLayer)) {
        this.map.addLayer(this.organisationLayer);
      }
    }
    else if(categoryNumber[0] == 3 && categoryNumber[1] == 0){
      if( this.map.hasLayer(this.organisationLayer)) {
        this.map.removeLayer(this.organisationLayer);
      }
    }
    //HumanFilter
    if(categoryNumber[0] == 4 && categoryNumber[1] == 1){
      if( !this.map.hasLayer(this.humanLayer)) {
        this.map.addLayer(this.humanLayer);
      }
    }
    else if(categoryNumber[0] == 4 && categoryNumber[1] == 0){
      if( this.map.hasLayer(this.humanLayer)) {
        this.map.removeLayer(this.humanLayer);
      }
    }
    //TechnolgyFilter
    else if(categoryNumber[0] == 5 && categoryNumber[1] == 1){
      if( !this.map.hasLayer(this.techonolgyLayer)) {
        this.map.addLayer(this.techonolgyLayer);
      }
    }
    if(categoryNumber[0] == 5 && categoryNumber[1] == 0){
      if( this.map.hasLayer(this.techonolgyLayer)) {
        this.map.removeLayer(this.techonolgyLayer);
      }
    }
    if(categoryNumber[0] != 0 && categoryNumber[1] != 0){
      //kijk of er een radius filter is.
      this.ProcessRadiusFilter(this.RadiusFilter);
    }

  }

  //functie die een een radius maakt op de kaart
  ProcessRadiusFilter(radiusFilterValues: [number, number, number, boolean]){
    var lat,lon;
    //verwijder de bestaande marker, cirkel, em geselecteerde punten als er nieuwe punten beschikbaar zijn
    if (this.theCircle != undefined) {
      this.map.removeLayer(this.theCircle);
    };
    if (this.theMarker != undefined) {
        this.map.removeLayer(this.theMarker);
    };
    if (this.geojsonLayer != undefined) {
      this.map.removeLayer(this.geojsonLayer);
    };
    if(radiusFilterValues[0] !== 0){
      //Voeg marker toe om te tonen waar je geklikt hebt

      if(radiusFilterValues[3] === true){
        //gebruik user location
        if(this.userLocationLat !== undefined && this.userLocationLng!== undefined){
          this.SelectPoints(this.userLocationLat,this.userLocationLng,radiusFilterValues[0]);
          lat = this.userLocationLat;
          lon = this.userLocationLng;
           // teken de cirkel om de geselecteerde radius te bekijken
          this.theCircle = L.circle([lat,lon], radiusFilterValues[0] , {   // nummer is in Meter
            color: 'orange',
            fillOpacity: 0,
            opacity: 1
          }).addTo(this.map);
        }
      }else if(radiusFilterValues[3] === false){
        //gebruik search location
        this.theMarker = L.marker([radiusFilterValues[1],radiusFilterValues[2]], {icon: radiusCenterIcon}).addTo(this.map);
        this.SelectPoints(radiusFilterValues[1],radiusFilterValues[2],radiusFilterValues[0]);
        lat = radiusFilterValues[1];
        lon = radiusFilterValues[2];
         // teken de cirkel om de geselecteerde radius te bekijken
        this.theCircle = L.circle([lat,lon], radiusFilterValues[0] , {   // nummer is in Meter
          color: 'orange',
          fillOpacity: 0,
          opacity: 1
        }).addTo(this.map);
      }
      if(radiusFilterValues[0] <= 10000){
        this.zoomToPoint([lat,lon], 11);
      }
      else if(radiusFilterValues[0] <= 25000){
        this.zoomToPoint([lat,lon], 10);
      }
      else if(radiusFilterValues[0] <= 50000){
        this.zoomToPoint([lat,lon], 9);
      }
      else if(radiusFilterValues[0] <= 100000){
        this.zoomToPoint([lat,lon], 8);
      }
      else if(radiusFilterValues[0] <= 200000){
        this.zoomToPoint([lat,lon], 7);
      }
      else if(radiusFilterValues[0] <= 300000){
        this.zoomToPoint([lat,lon], 6.5);
      }
      else if(radiusFilterValues[0] <= 500000){
        this.zoomToPoint([lat,lon], 6);
      }
    }
  }

  //functie die de punten binnen de filter radius selecteerd
  SelectPoints(lat: number,lon: number, distance: number){

    const xy = [lat,lon];  //coordinaten van het middelpunt van de range
    var theRadius = distance; //de range afstand
    this.selPts.length = 0;  //als er nieuwe punten zijn maak de array leeg

    this.geoJSONData.eachLayer((layer: any) => {
      var layer_lat_long = layer.getLatLng();   // Lat, long van punt van de laag worden doorlopen.
      var distance_from_centerPoint =  layer_lat_long.distanceTo(xy); // afstand van de range marker tot het punt in meter

      if (distance_from_centerPoint <= theRadius) { // Kijk of de meters binnen het berijk liggen van de gekozen radius en voeg toe aan de array
        //console.log(layer.feature.properties.category);
         if(layer.feature.properties.category === '1'){
          if(this.map.hasLayer(this.wasteLayer)){
            this.selPts.push(layer.feature);
          }
         }
         else if(layer.feature.properties.category === '2'){
          if(this.map.hasLayer(this.inspirationLayer)){
            this.selPts.push(layer.feature);
          }
         }
         else if(layer.feature.properties.category === '3'){
          if(this.map.hasLayer(this.organisationLayer)){
            this.selPts.push(layer.feature);
          }
         }
         else if(layer.feature.properties.category === '4'){
          if(this.map.hasLayer(this.humanLayer)){
            this.selPts.push(layer.feature);
          }
        }
          else if(layer.feature.properties.category === '5'){
            if(this.map.hasLayer(this.techonolgyLayer)){
              this.selPts.push(layer.feature);
            }
         }
      }
    });

    //stuur punten naar parent
    this.selectedPointsEvent.emit(this.selPts);

    //plaats nieuwe markers die de punten binnen de range aanduiden
    this.geojsonLayer = L.geoJson(this.selPts, {
      pointToLayer: function(feature, latlng) {
          //console.log(feature.properties.category);
          if(feature.properties.category === '1'){
              return L.marker(latlng, { icon: wasteIconRadius })
          }
          else if(feature.properties.category === '2'){
              return L.marker(latlng, { icon: inspirationIconRadius })
          }
          else if(feature.properties.category === '3'){
              return L.marker(latlng, { icon: organisationIconRadius })
          }
          else if(feature.properties.category === '4'){
              return L.marker(latlng, { icon: humanIconRadius }).bindPopup("<b>Hello world!</b><br>I am a popup.")
          }
          else if(feature.properties.category === '5'){
              return L.marker(latlng, { icon: technologyIconRadius }).bindPopup("<b>Hello world!</b><br>I am a popup.")
          }
          else{
              return L.circleMarker(latlng, {
                  radius:6,
                  opacity: .5,
                  color: "#000",
                  fillOpacity: 0.8
              });
          }
        }
    });
    //Voeg de geselecteerde punten terug toe aan de map als green circles.
    this.map.addLayer(this.geojsonLayer);
  }

  zoomToPoint(coord: [number,number], zoom: number){
    this.map.flyTo(coord, zoom)
  }

  showPopUp(marker: any){
    console.log(this.map._layers[marker])
    this.map._layers[marker].fire('click');
  }

  //functie uitgevoerd bij initialiseren component
  ngOnInit(): void {
    this.initMap();
  }

  //als er een verandering gebeurt van een Input()
  ngOnChanges(changes: SimpleChanges) {
    if(changes['categoryFilter']){
      console.log('verandering op categoryFilter:  ', changes['categoryFilter'].currentValue);
      this.FilterByCategorie(changes['categoryFilter'].currentValue);
      //als er een radius filter was ingesteld pas deze aan zodat de categorien verdwijnen of zichtbaar worden
      if(this.RadiusFilter !== undefined && this.RadiusFilter[0] !== 0){
        this.ProcessRadiusFilter(this.RadiusFilter);
      }
    }
    if(changes['radiusFilterValues']){
      console.log('verandering op radiusFilterValues: ', changes['radiusFilterValues'].currentValue);
      this.RadiusFilter = changes['radiusFilterValues'].currentValue;
      this.ProcessRadiusFilter(changes['radiusFilterValues'].currentValue);
    }
    if(changes['clickedItem']){
      if(changes['clickedItem'].currentValue != undefined){
        console.log('verandering op clickedItem: ', changes['clickedItem'].currentValue);
        this.zoomToPoint([changes['clickedItem'].currentValue.geometry.coordinates[1],changes['clickedItem'].currentValue.geometry.coordinates[0]],13)
        this.showPopUp(changes['clickedItem'].currentValue.properties.name)
      }
    }
  }
}
