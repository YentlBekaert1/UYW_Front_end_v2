import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DeleteProfile } from 'src/app/store/authstate/auth.actions';

import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, private store: Store) { }

  ngOnInit(): void {
  }

  logOut($event: any): void {
    $event.stopPropagation();

    this.auth.csrf().subscribe({
      next: data => {
        this.auth.logout().subscribe({
          next: data => {
            this.store.dispatch(DeleteProfile());
          },
          error: err => {}
        }
        )
        this.router.navigate(['home']);
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
