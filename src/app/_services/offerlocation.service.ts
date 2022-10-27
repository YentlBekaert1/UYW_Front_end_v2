import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferlocationService {

  constructor(private http: HttpClient) { }

  public getLocations(bounds: {latNW: any, latSE: any, lonNW: any, lonSE: any}){
    console.log("getLoc", bounds);
    const requesturl = environment.apiUrl + 'api/locationsmap';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return this.http.post<any>(requesturl, bounds, httpOptions).pipe(map(data => {
      return data.data;
    }))
  }

}
