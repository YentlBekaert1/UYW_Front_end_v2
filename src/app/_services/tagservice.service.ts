import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagserviceService {

  constructor(private http: HttpClient) { }

  tagsTypeAhead(name: string){
    const requesturl = environment.apiUrl + 'api/tagsautocomplete';
    const httpOptions = {
      headers: new HttpHeaders({'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    const body = {
      query: name
    };
    return this.http.post(requesturl, body, httpOptions);
  }
}
