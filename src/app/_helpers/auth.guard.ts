import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import {Observable} from 'rxjs';

import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService
  ){}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot):| boolean | UrlTree| Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkLoggedIn();
  }


  private async checkLoggedIn(){
    try {
      const res = await this.auth.getuserdata();
      //console.log(res);
      return true;
    } catch (error) {
      return this.router.parseUrl('/login');
    }
  }
}
