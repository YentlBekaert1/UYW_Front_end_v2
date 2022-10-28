import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpRequest, HttpResponse, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private cookieExtractor:HttpXsrfTokenExtractor) { }

  csrf(){

    const requesturl = environment.apiUrl + 'sanctum/csrf-cookie';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return lastValueFrom(
      this.http.get(requesturl, httpOptions)
    );

  }

  login(loginData: any){
    //console.log(postdata);
    const requesturl = environment.apiUrl + 'login';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    // const body = {
    //   email: 'bekaert.yentl@gmail.com',
    //   password: 'yentl12345',
    //   remember: false
    // };

    console.log('login');

    return lastValueFrom(
      this.http.post(requesturl, loginData, httpOptions)
    );
  }

  logout(){
    //console.log(postdata);
    const requesturl = environment.apiUrl + 'logout';
    const token = this.cookieExtractor.getToken()!;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json'}),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    console.log('logout');
    return lastValueFrom(
      this.http.post(requesturl, {}, httpOptions)
    );
  }
}
