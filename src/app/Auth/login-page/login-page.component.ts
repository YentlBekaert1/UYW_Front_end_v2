import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
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
  url:string = "";

  offer_validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Er is geen correct email adres ingegeven' }
    ],
    'password': [
      { type: 'required', message: 'Wachtwoord is required' },
    ]
  }

  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router, private store: Store, private route: ActivatedRoute) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        remember: [false]
      });
      const paramsub = this.route.paramMap.subscribe(params => {
        var url = params.get('url');
        if(url){
          this.url = url;
          console.log(url)
        }
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
              this.isLoading = false;

              if(this.url != ""){
                this.auth.verfiyaccount(this.url).pipe(first()).subscribe({
                  next: data => {
                    this.router.navigate(['/account','profile']);
                  },
                  error: err => {
                    console.log(err)
                  }
                });
              }else{
                this.router.navigate(['/account', 'profile']);
              }
            },
            error: err_res => {
              this.isLoading = false;
              console.log(err_res);
              if(err_res.error.message){
                this.errorMessage = err_res.error.message
              }
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
