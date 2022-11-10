import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  registerForm: FormGroup;

  errorMessage = '';
  emailServerError:string;
  passwordServerError:string;

  isLoading = false;

  offer_validation_messages = {
    'name': [
      { type: 'required', message: 'Naam is required' },
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Er is geen correct email adres ingegeven' }
    ],
    'password': [
      { type: 'required', message: 'Wachtwoord is required' },
    ],
    'password_confirmation': [
      { type: 'required', message: 'Bevestiging van wachtwoord is required' },
    ],
    'terms': [
      { type: 'required', message: 'Je moet akkoord gaan met de algemene voorwaarden' }
    ],

  }

  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
  }


  onSubmit(): void {
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      return;
    }
    else{
      this.isLoading = true;
      this.auth.csrf().subscribe({
        next: data => {
          this.auth.register(this.registerForm.value).pipe(first()).subscribe({
            next: data => {
              this.isLoading = false;
              this.router.navigate(['email', 'verify']);
            },
            error: err_res => {
              this.isLoading = false;
              if(err_res.error.errors.email){
                this.emailServerError = err_res.error.errors.email;
              }
              if(err_res.error.errors.password){
                this.passwordServerError = err_res.error.errors.password;
              }
            }
          });
        },
        error: err => {
          this.isLoading = false;
          this.emailServerError = "Oeps, er is iets mis gegaan."
        }
      });
    }
  }

  goToLogin(){
    this.router.navigate(['login']);
  }
}
