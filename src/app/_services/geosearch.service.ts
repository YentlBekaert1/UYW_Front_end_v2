import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


export interface Feature {
  type: string;
  geometry: {coordinates: [number,number]; type: 'string'};
  properties: {country: string; city: string; countrycode: string; postcode: number; housenumber: number; street: string};
}
//"country":"Belgium","city":"Rumst","countrycode":"BE","postcode":"2840","county":"Antwerp","type":"street",
//"osm_type":"W","osm_key":"highway","district":"Rumst","osm_value":"residential","name":"Statiestraat","state":"Antwerp"}}],
//"type":"FeatureCollection"}
@Injectable({
  providedIn: 'root'
})
export class GeosearchService {

  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
  };

  urlPhoton = 'https://nominatim.openstreetmap.org/search?q=';

  constructor(private http: HttpClient) { }


  searchWordPhoton(query: string) {
    return this.http.get(this.urlPhoton + query + '&format=json&limit=1', this.httpOptions);
  }
  searchWordPhotonbbCoordinates(lat: number, lon: number){
    //?lat=50&lon=3&zoom=18&format=jsonv2
    return this.http.get("https://nominatim.openstreetmap.org/reverse" + '?lat='+lat+'&lon='+lon+'&zoom=18&format=jsonv2', this.httpOptions);
  }

}
