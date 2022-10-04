import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface Feature {
  type: string;
  geometry:{coordinates: [number,number],type: "string"}
  properties:{country:string,city:string,countrycode:string,postcode:number,housenumber: number,street: string}
}
//"country":"Belgium","city":"Rumst","countrycode":"BE","postcode":"2840","county":"Antwerp","type":"street","osm_type":"W","osm_key":"highway","district":"Rumst","osm_value":"residential","name":"Statiestraat","state":"Antwerp"}}],"type":"FeatureCollection"}
@Injectable({
  providedIn: 'root'
})
export class GeosearchService {

  constructor(private http: HttpClient) { }

  URLPhoton = "https://nominatim.openstreetmap.org/search?q="

  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
  }

  search_word_photon(query: string) {
    return this.http.get(this.URLPhoton + query + '&format=json&limit=1', this.httpOptions)
  }

}
