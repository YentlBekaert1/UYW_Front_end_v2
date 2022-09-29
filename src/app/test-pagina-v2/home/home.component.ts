import { Component, OnInit } from '@angular/core';
import data from '../../../assets/geojson.json';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponentV2 implements OnInit {

  title = 'LeafLetMapTest';
  public geojsonList: any = data;
  public categoryFilterNumber: [number, number] = [0,0];
  public listdataInit:any = [];
  public listdata:any = [];
  public listDataAfterFilter:any = [];
  public selPts:any = [];

  wasteCategoryState: number = 1;
  inspirationCategoryState: number = 1;
  humanCategoryState: number = 1;
  organisationCategoryState: number = 1;
  technologyCategoryState: number = 1;

  wasteLayer: any;
  inspirationLayer: any;
  humanLayer: any ;
  organisationLayer: any;
  techonolgyLayer: any;

  public map!: L.Map;
  jsondata:any;
  userLocation: any;
  userLocationLat: any;
  userLocationLng: any;
  theCircle: any; //cirkel die de range aanduid
  theMarker: any; // marker voor middelpunt range
  geojsonLayer: any; //laag om de punten anders aan te duiden als ze binnen de range staan

  filterRadius: [number, number, number, boolean] = [0,0,0,false];

  constructor() { }

  ngOnInit(): void {
    this.listdataInit = this.geojsonList.data;
    this.listdata = this.geojsonList.data;
    this.initMap();
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
    this.FilterByCategorie(this.categoryFilterNumber);

    //verander de lijst als er een categorieknop ingedrukt wordt
    this.listDataAfterFilter = [];
    this.listdataInit.forEach((element: any) => {
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
    this.listdata = [];
    this.listdata = this.listDataAfterFilter;

    this.filterRadiusClicked(this.filterRadius);
  }

  categoryControlClicked(categoryNumber: [number,number]){
    console.log("Bericht van parent:", categoryNumber);
    if(categoryNumber[0] === 1){
      this.wasteCategoryState = categoryNumber[1];
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

  filterRadiusClicked(radiusFilter: [number,number,number,boolean]){
    this.filterRadius = radiusFilter;
    console.log("Bericht van parent filter:", radiusFilter);
    var lat;
    var lon;

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

    //als de afstand niet nul is
    if(radiusFilter[0] !== 0){
      //Voeg marker toe om te tonen waar je geklikt hebt
      const myIcon = L.icon({
        iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=',
        iconSize:     [40, 51], // size of the icon
        iconAnchor:   [20, 51], // point of the icon which will correspond to marker's location
      })
      //als je de user location gebruikt plaat je geen marker anders wel
      if(radiusFilter[3] === true){
        //gebruik user location
        if(this.userLocationLat !== undefined && this.userLocationLng!== undefined){
          this.SelectPoints(this.userLocationLat,this.userLocationLng,radiusFilter[0]);
          lat = this.userLocationLat;
          lon = this.userLocationLng;
        }
      }else if(radiusFilter[3] === false){
        //gebruik search location
        this.theMarker = L.marker([radiusFilter[1],radiusFilter[2]], {icon: myIcon}).addTo(this.map);
        this.SelectPoints(radiusFilter[1],radiusFilter[2],radiusFilter[0]);
        lat = radiusFilter[1];
        lon = radiusFilter[2];
      }

      // teken de cirkel om de geselecteerde radius te bekijken
      this.theCircle = L.circle([lat,lon], radiusFilter[0] , {   // nummer is in Meter
        color: 'orange',
        fillOpacity: 0,
        opacity: 1
      }).addTo(this.map);
    }
  }

  SelectPoints(lat: number,lon: number, distance: number ){
    var theRadius = distance; //de range afstand
    var xy = [lat,lon];//coordinaten van het middelpunt van de range
    this.selPts.length = 0;

    this.jsondata.eachLayer((layer: any) => {
      // Lat, long van punt van de laag worden doorlopen.
      var layer_lat_long = layer.getLatLng();
      //console.log(layer_lat_long);
      // afstand van de range marker tot het punt in meter
      var distance_from_centerPoint =  layer_lat_long.distanceTo(xy);
      // Kijk of de meters binnen het berijk liggen van de gekozen radius en voeg toe aan de array
      console.log('est:', theRadius, distance_from_centerPoint);
      if (distance_from_centerPoint <= theRadius) {
        //console.log('inRadius');
        if(this.wasteCategoryState == 1 && layer.feature.properties.category === '1'){
          this.selPts.push(layer.feature);
        }
        else if(this.inspirationCategoryState == 1 && layer.feature.properties.category == '2'){
          this.selPts.push(layer.feature);
        }
        else if(this.organisationCategoryState == 1 && layer.feature.properties.category == '3'){
          this.selPts.push(layer.feature);
        }
        else if(this.humanCategoryState == 1 && layer.feature.properties.category == '4'){
          this.selPts.push(layer.feature);
        }
        else if(this.technologyCategoryState == 1 && layer.feature.properties.category == '5'){
          this.selPts.push(layer.feature);
        }
      }
    });
    console.log('plts: ',this.selPts);
    this.listdata =  this.selPts;

    //custom markers
    const wasteIconRadius = L.icon({
      iconUrl: '../../assets/map-icons/marker_waste_radius.png',
      iconSize:     [40, 51], // size of the icon
      iconAnchor:   [20, 51], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -51] // point from which the popup should open relative to the iconAnchor
    });
    const inspirationIconRadius= L.icon({
      iconUrl: '../../assets/map-icons/marker_inspiration_radius.png',
      iconSize:     [40, 51], // size of the icon
      iconAnchor:   [20, 51], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -51] // point from which the popup should open relative to the iconAnchor
    });
    const organisationIconRadius = L.icon({
      iconUrl: '../../assets/map-icons/marker_organisation_radius.png',
      iconSize:     [40, 51], // size of the icon
      iconAnchor:   [20, 51], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -51] // point from which the popup should open relative to the iconAnchor
    });
    const humanIconRadius = L.icon({
      iconUrl: '../../assets/map-icons/marker_human_radius.png',
      iconSize:     [40, 51], // size of the icon
      iconAnchor:   [20, 51], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -51] // point from which the popup should open relative to the iconAnchor
    });
    const technologyIconRadius = L.icon({
      iconUrl: '../../assets/map-icons/marker_technology_radius.png',
      iconSize:     [40, 51], // size of the icon
      iconAnchor:   [20, 51], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -51] // point from which the popup should open relative to the iconAnchor
    });

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
              return L.marker(latlng, { icon: humanIconRadius })
          }
          else if(feature.properties.category === '5'){
              return L.marker(latlng, { icon: technologyIconRadius })
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

  annuleerfilterRadiusClicked(){
    console.log('annuleerfilterRadiusClickedevent:');
    this.listdata = this.geojsonList.data;
    this.filterRadius = [0,0,0,false];
    this.filterRadiusClicked([0,0,0,false]);
  }

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
      console.log(e);
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
      console.log(marker);
      marker.addTo(this.map);
    }

    //als de map de locatie gevonden heeft gaat hij de functie location found uitvoeren
    this.map.on('locationfound', onLocationFound);

    /* --------------------------------------- CUSTOM MARKERS ---------------------------------------------------------------------------------------*/
    // icon class aanmaken
    const wasteIcon = L.icon({
      iconUrl: '../../assets/map-icons/marker_waste.png',
      iconSize:     [40, 51], // size of the icon
      iconAnchor:   [20, 51], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -51] // point from which the popup should open relative to the iconAnchor
    });
    const inspirationIcon = L.icon({
      iconUrl: '../../assets/map-icons/marker_inspiration.png',
      iconSize:     [40, 51], // size of the icon
      iconAnchor:   [20, 51], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -51] // point from which the popup should open relative to the iconAnchor
    });
    const organisationIcon = L.icon({
      iconUrl: '../../assets/map-icons/marker_organisation.png',
      iconSize:     [40, 51], // size of the icon
      iconAnchor:   [20, 51], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -51] // point from which the popup should open relative to the iconAnchor
    });
    const humanIcon = L.icon({
      iconUrl: '../../assets/map-icons/marker_human.png',
      iconSize:     [40, 51], // size of the icon
      iconAnchor:   [20, 51], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -51] // point from which the popup should open relative to the iconAnchor
    });
    const technologyIcon = L.icon({
      iconUrl: '../../assets/map-icons/marker_technology.png',
      iconSize:     [40, 51], // size of the icon
      iconAnchor:   [20, 51], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -51] // point from which the popup should open relative to the iconAnchor
    });

    /* --------------------------------------- MARKERS TOEVOEGEN VANUIT GEOJSON -------------------------------------------------------------------*/

    //oneachfuter functie om functies bij de geojson bij te voegen voo dat ze geladen worden in dit geval een popup waneer er op geklikt word.
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

    this.jsondata = L.geoJSON(this.geojsonList.data, {
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

        })

        //laat de map een event geven als er een overlay aangeklikt in de controller van de map
        this.map.on('overlayadd', this.overlayControlClicked);
        this.map.on('overlayremove', this.overlayControlClicked);
   }

     //functie die uitgevoed word als er een overlay aangeklikt wordt in de controller van de map
  overlayControlClicked = (e: any) =>{
    console.log("layer", e);
    if(e.type === 'overlayadd'){
      if(e.name === 'Afval'){
        this.wasteCategoryState = 1;
      }else if(e.name === 'Inspiratie'){
        this.inspirationCategoryState = 1 ;
      }else if(e.name === 'Mens'){
        this.humanCategoryState = 1;
      }else if(e.name === 'Organisatie'){
        this.organisationCategoryState = 1;
      }else if(e.name === 'Techonolgie'){
        this.technologyCategoryState = 1;
      }
    }else if(e.type === 'overlayremove'){
      if(e.name === 'Afval'){
        this.wasteCategoryState = 0;
      }else if(e.name === 'Inspiratie'){
        this.inspirationCategoryState = 0 ;
      }else if(e.name === 'Mens'){
        this.humanCategoryState = 0;
      }else if(e.name === 'Organisatie'){
        this.organisationCategoryState = 0;
      }else if(e.name === 'Techonolgie'){
        this.technologyCategoryState = 0;
      }
    }
    
    this.filterRadiusClicked(this.filterRadius);
  }

  FilterByCategorie(categoryNumber: [number, number]) {
    console.log('filter', categoryNumber);
    //wasteFilter
    if(categoryNumber[0] == 1 && categoryNumber[1] == 1){
      if(!this.map.hasLayer(this.wasteLayer)) {
        this.map.addLayer(this.wasteLayer);
      }
    }
    if(categoryNumber[0] == 1 && categoryNumber[1] == 0){
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
    if(categoryNumber[0] == 2 && categoryNumber[1] == 0){
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
    if(categoryNumber[0] == 3 && categoryNumber[1] == 0){
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
    if(categoryNumber[0] == 4 && categoryNumber[1] == 0){
      if( this.map.hasLayer(this.humanLayer)) {
        this.map.removeLayer(this.humanLayer);
      }
    }

    //TechnolgyFilter
    if(categoryNumber[0] == 5 && categoryNumber[1] == 1){
      if( !this.map.hasLayer(this.techonolgyLayer)) {
        this.map.addLayer(this.techonolgyLayer);
      }
    }
    if(categoryNumber[0] == 5 && categoryNumber[1] == 0){
      if( this.map.hasLayer(this.techonolgyLayer)) {
        this.map.removeLayer(this.techonolgyLayer);
      }
    }

  }
}
