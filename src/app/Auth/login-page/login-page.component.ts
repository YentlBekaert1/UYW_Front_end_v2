import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { GetProfile } from 'src/app/store/authstate/auth.actions';
import { selectisLoggedIn } from 'src/app/store/authstate/auth.selector';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;

  errorMessage = '';
  isLoading = false;

  offer_validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Er is geen correct email adres ingegeven' }
    ],
    'password': [
      { type: 'required', message: 'Wachtwoord is required' },
    ]
  }

  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router, private store: Store) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        remember: [false]
      });
   }


  ngOnInit(): void {
  }

  onSubmit(): void {
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }else{
      this.isLoading = true;
      this.auth.csrf().subscribe({
        next: data => {
          this.auth.login(this.loginForm.value).pipe(first()).subscribe({
            next: data => {
              console.log(data);
              this.store.dispatch(GetProfile())
              this.store.select(selectisLoggedIn).subscribe((res)=>{
                this.isLoading = false;
                this.router.navigate(['/account', 'profile'])
              })
            },
            error: err_res => {
              this.isLoading = false;
              if(err_res.error.errors.email){
                this.errorMessage = err_res.error.errors.email;
              }
              if(err_res.error.errors.password){
                this.errorMessage = err_res.error.errors.password;
              }
            }
          });
        },
        error: err => {
          this.isLoading = false;
          this.errorMessage = "Oeps, er is iets mis gegaan";
        }
      });
    }
  }

  goToRegister(){
    this.router.navigate(['register']);
  }


}
