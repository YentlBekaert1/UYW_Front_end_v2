import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../_services/auth.service';
import { AuthActions } from './auth.actions';
import { Profile } from './auth.model';

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authservice: AuthService
  ) {}

  getUserData$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.GetProfile),
    switchMap(() => this.authservice.getuserdata()
      .pipe(
        map((profile: Profile) => AuthActions.ShowProfile({ profile: profile, isLoggedIn: true })),
        catchError(() => EMPTY)
      ))
    )
  );

  updateUserData$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.UpdateProfile),
    mergeMap((data) => this.authservice.updateuserdata(data)
      .pipe(
        map((profile: Profile) => AuthActions.ShowProfile({ profile: profile, isLoggedIn: true })),
        catchError(() => EMPTY)
      ))
    )
  );

}
