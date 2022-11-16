import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { catchError, filter, map, Observable, of, switchMap, take, tap} from 'rxjs';
import { AuthFacade } from '../store/authstate/auth.facade';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authFacade: AuthFacade
  ){}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot):| boolean | UrlTree| Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log('hallo')
    return this.getuserData().pipe(
      map((isLoggedIn) => {
        console.log(isLoggedIn);
        if (!isLoggedIn) {
          return this.router.createUrlTree(['/login']);
        }
        return true;
      }));
  }

  private getuserData() {
    return this.authFacade.isLoggedIn$.pipe(
      tap(data => this.prefetch()),
      map(data => data),
      take(1),
      catchError(data => data)
    );
  }

  private prefetch() {
      this.authFacade.getProfile();
  }

  // private checkLoggedIn(){
  //   this.store.dispatch(GetProfile());
  //   return this.store.select(selectisLoggedIn).pipe(map(isLoggedIn => isLoggedIn ? true : this.router.parseUrl('/login')))
  // }

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
