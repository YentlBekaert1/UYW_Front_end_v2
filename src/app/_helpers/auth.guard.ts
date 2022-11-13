import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { GetProfile } from '../store/authstate/auth.actions';
import { selectisLoggedIn, selectProfile } from '../store/authstate/auth.selector';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private auth: AuthService,
    private store: Store
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(this.checkLoggedIn());
    return this.checkLoggedIn();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkLoggedIn();
  }

  private checkLoggedIn(){
    this.store.dispatch(GetProfile());
    return this.store.select(selectisLoggedIn).pipe(map(isLoggedIn => isLoggedIn ? true : this.router.parseUrl('/login')))
  }

  //  private async checkLoggedIn2(){
  //   try {
  //     const res = await this.store.dispatch(GetProfile())

  //     return true
  //   } catch (error) {
  //     return this.router.parseUrl('/login');
  //   }
  // }

  // private async checkLoggedIn(){
  //   try {
  //     const res = await this.auth.userdata();
  //     return true;
  //   } catch (error) {
  //     return this.router.parseUrl('/login');
  //   }
  // }
}
