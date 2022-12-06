import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferlocationService {

  constructor(private http: HttpClient) { }

  public getLocationsWithBounds(bounds: {latNW: any, latSE: any, lonNW: any, lonSE: any}, filters: {categories: any, materials:any, query:any,  lat: any,
    lon: any, distance: any}){
    //console.log("getLoc", bounds);
    var locationFilterString;
    if(filters.lat !== null && filters.lon !== null){
      locationFilterString = filters.lat + "," + filters.lon + "," + filters.distance.toString();
    }else{
      locationFilterString = "";
    }

    const requesturl = environment.apiUrl + 'api/locationsmapbounds?latNW='+bounds.latNW
    + '&latSE='+bounds.latSE
    + '&lonNW='+bounds.lonNW
    + '&lonSE=' +bounds.lonSE
    +'&categories='+ filters.categories
    +'&materials=' + filters.materials
    +'&query=' + filters.query
    +'&location=' + locationFilterString;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return this.http.get<any>(requesturl, httpOptions).pipe(map(data => {
      //console.log(data);
      return data.data;
    }))
  }

  public getLocationsWithoutBounds(filters: {categories: any, materials:any, query:any,  lat: any,
    lon: any, distance: any}){
    //console.log("getLoc", bounds);
    var locationFilterString;
    if(filters.lat !== null && filters.lon !== null){
      locationFilterString = filters.lat + "," + filters.lon + "," + filters.distance.toString();
    }else{
      locationFilterString = "";
    }

    const requesturl = environment.apiUrl + 'api/locationsmap'
    +'?categories='+ filters.categories
    +'&materials=' + filters.materials
    +'&query=' + filters.query
    +'&location=' + locationFilterString;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return this.http.get<any>(requesturl, httpOptions).pipe(map(data => {
      //console.log(data);
      return data.data;
    }))
  }

}
