import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../_services/auth.service';
import { AuthActions } from './auth.actions';
import { Profile } from './auth.model';
import { initialAuthState } from './auth.reducer';

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authservice: AuthService
  ) {}
}
