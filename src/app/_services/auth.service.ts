import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpRequest, HttpResponse, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, lastValueFrom, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { AuthState } from '../store/authstate/auth.state';
import { deleteProfile, loadProfileFailure, loadProfileSucces } from '../store/authstate/auth.actions';
import { Profile } from '../store/authstate/auth.model';
import { Router } from '@angular/router';
import { id } from '@swimlane/ngx-charts';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //observable to store userdata
  private userAccountSubject: BehaviorSubject<any>;
  public user: Observable<any>;
  userLoggedIn$: Observable<Boolean>;

  constructor(private http: HttpClient, private cookieExtractor:HttpXsrfTokenExtractor,private store: Store<AuthState>) {
    this.userAccountSubject = new BehaviorSubject<any>({} as any);
    this.user = this.userAccountSubject.asObservable();
    this.userLoggedIn$ = this.user.pipe(map(user => { return !!user.name;}));

    // if(sessionStorage.getItem("_user")){
    //   const user = sessionStorage.getItem("_user");
    //   if(user){
    //     this.userAccountSubject.next(user);
    //   }
    // }
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
  }

  public register(registerData: any){
    const requesturl = environment.apiUrl + 'register';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return this.http.post<any>(requesturl, registerData, httpOptions)
  }

  public verfiyaccount(url){
    const requesturl = url

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return this.http.get<any>(requesturl, httpOptions)
  }

  public resendverfiy(){
    const requesturl = environment.apiUrl + 'email/verification-notification'

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };
    const body = {}
    return this.http.post<any>(requesturl, body, httpOptions)
  }

  public forgetpassword(data: any){
    const requesturl = environment.apiUrl + 'forgot-password'

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return this.http.post<any>(requesturl, data, httpOptions)
  }

  public resetpassword(data: any){
    const requesturl = environment.apiUrl + 'reset-password '

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return this.http.post<any>(requesturl, data, httpOptions)
  }

  //logout
  public logout(){
    const requesturl = environment.apiUrl + 'logout';
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'accept': 'application/json'}),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return lastValueFrom(
      this.http.post<any>(requesturl, {}, httpOptions)
      .pipe(
        map((res:Profile) => {
          this.store.dispatch(deleteProfile());
        }),
        catchError(err => {
          this.store.dispatch(loadProfileFailure());
          return err;
        }),
        catchError(err => {
          this.store.dispatch(loadProfileFailure());
          return err;
        })
      )
    );
  }

  // get userdata
  public getuserdata(){

    const requesturl = environment.apiUrl + 'api/userprofile';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return lastValueFrom(
      this.http.get(requesturl, httpOptions)
      .pipe(
        map((res:Profile) => {
          this.store.dispatch(loadProfileSucces({profile:res}));
          return res
        }),
        catchError(err => {
          return err;
        }),
        catchError(err => {
          return err;
        })
    )
    );
  }

  public updateuserdata(Formdata: any, id:number){
    console.log(Formdata);
    const requesturl = environment.apiUrl + 'api/users/' + id;

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json',  'accept': 'application/json'}),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return this.http.patch(requesturl, Formdata, httpOptions);
  }

  // get userdata
  public getuserdashboarddata(){

    const requesturl = environment.apiUrl + 'api/userdashboarddata';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return lastValueFrom(
      this.http.get(requesturl, httpOptions)
    );
  }

  public updatepassword(Formdata: any){
    const requesturl = environment.apiUrl + 'user/password '

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return this.http.put<any>(requesturl, Formdata, httpOptions)
  }

  public deleteuser(id:number){
    const requesturl = environment.apiUrl + 'api/users/' + id;

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json',  'accept': 'application/json'}),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    return this.http.delete(requesturl, httpOptions);
  }


}






  // public userdata(){

  //   const requesturl = environment.apiUrl + 'api/userprofile';

  //   const httpOptions = {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json',  'accept': 'application/json', }),
  //     withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
  //   };
  //   return lastValueFrom(
  //     this.http.get(requesturl, httpOptions)
  //   //   .pipe(
  //   //     map(res => {
  //   //       sessionStorage.setItem("_user", JSON.stringify(true));
  //   //       return res
  //   //     }),
  //   //     catchError(err => {
  //   //          //if logout succes
  //   //           this.userAccountSubject.next(null as any);
  //   //           //delete data
  //   //           sessionStorage.removeItem("_user");
  //   //         return throwError(err);
  //   //     }),
  //   //     catchError(err => {
  //   //          //if logout succes
  //   //           this.userAccountSubject.next(null as any);
  //   //           //delete data
  //   //           sessionStorage.removeItem("_user");
  //   //         return throwError(err);
  //   //     })
  //   // )
  //   );
  // }
