import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UpdateProfile } from 'src/app/store/authstate/auth.actions';
import { Profile } from 'src/app/store/authstate/auth.model';
import { selectProfile } from 'src/app/store/authstate/auth.selector';
import { AuthState } from 'src/app/store/authstate/auth.state';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  userData: Profile;
  registerForm: FormGroup;


  constructor(private authservice: AuthService, private fb: FormBuilder, private store: Store<AuthState>) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
   }

  ngOnInit(): void {
    this.store.select(selectProfile).subscribe(data =>{
      console.log(data);
      this.userData = data;
      this.registerForm.patchValue({
        name: data.name,
        email: data.email
      })
    })
  }

  onSubmit(){
    console.log(this.registerForm.value);
    //functie werkt al maar moet nog zorgen dat de gebruiker melding krijgt dat er nieuwe verificatie mail is verstuurd.
    //this.store.dispatch(UpdateProfile(this.registerForm.value))
  }

}
