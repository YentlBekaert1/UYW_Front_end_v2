import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { throttleTime } from 'rxjs';
import { GetProfile } from './store/authstate/auth.actions';
import { Profile } from './store/authstate/auth.model';
import { selectisLoggedIn, selectProfile } from './store/authstate/auth.selector';
import { isLoaded, isNotLoaded } from './store/loadstate/load.actions';
import { BooleanisLoaded, selectLoad } from './store/loadstate/load.selector';

import { UserAccount } from './_models/user';
import { AuthService } from './_services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  user!: UserAccount;
  profile$ = this.store.select(selectProfile);
  userLoggedIn$ = this.store.select(selectisLoggedIn);

  loadState$ = this.store.select(BooleanisLoaded);

  constructor(private auth: AuthService, private store: Store, private route: ActivatedRoute){
    this.store.dispatch(GetProfile());
    this.store.dispatch(isNotLoaded());
  }
}
