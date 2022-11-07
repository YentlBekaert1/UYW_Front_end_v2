import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpRequest, HttpResponse, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserAccount } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //observable to store userdata
  private userAccountSubject: BehaviorSubject<UserAccount>;
  public user: Observable<UserAccount>;
  userLoggedIn$: Observable<Boolean>;

  constructor(private http: HttpClient, private cookieExtractor:HttpXsrfTokenExtractor) {
    this.userAccountSubject = new BehaviorSubject<UserAccount>({} as any);
    this.user = this.userAccountSubject.asObservable();
    this.userLoggedIn$ = this.user.pipe(map(user => { return !!user.name;}));

    if(localStorage.getItem("USER_DATA")){
      const user = localStorage.getItem("USER_DATA");
      if(user){
        this.userAccountSubject.next(JSON.parse(user));
      }
    }
  }

  public csrf(): Observable<any>{

    const requesturl = environment.apiUrl + 'sanctum/csrf-cookie';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'accept': 'application/json'}),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return this.http.get<any>(requesturl, httpOptions)
  }

  public login(loginData: any){
    const requesturl = environment.apiUrl + 'login';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return this.http.post<any>(requesturl, loginData, httpOptions)
    // .pipe(map(user => {
    //   this.userAccountSubject.next(user);
    //   localStorage.setItem("USER_DATA", JSON.stringify(user));
    //   return user;
    // }))
  }

  public logout(){
    const requesturl = environment.apiUrl + 'logout';
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'accept': 'application/json'}),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return this.http.post<any>(requesturl, {}, httpOptions).subscribe(
      response =>{
        //if logout succes
        this.userAccountSubject.next(null as any);
        //delete data
        localStorage.removeItem("USER_DATA");
        //this.router.navigate(['login']);
      }
    )
  }

  public userdata(){

    const requesturl = environment.apiUrl + 'api/userprofile';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return lastValueFrom(
      this.http.get(requesturl, httpOptions)
    );
  }


}
