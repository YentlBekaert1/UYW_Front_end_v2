import { Component } from '@angular/core';
import { UserAccount } from './_models/user';
import { AuthService } from './_services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user!: UserAccount;

  constructor(private auth: AuthService){
    this.auth.user.subscribe(x => this.user = x);
    //getting user details
  }
}
