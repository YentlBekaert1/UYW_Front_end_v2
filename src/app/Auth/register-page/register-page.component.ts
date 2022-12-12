import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  registerForm: FormGroup;

  errorToast: string;
  errorMessage = '';
  emailServerError:string;
  passwordServerError:string;

  isLoading = false;

  register_validation_messages = {
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

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastService: HotToastService,
    private translate: TranslateService
    ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
    this.translate.get('REGISTER_PAGE').subscribe((res)=>{
      this.register_validation_messages = {
        'name': [
          { type: 'required', message: res.VALIDATION_NAME },
        ],
        'email': [
          { type: 'required', message: res.VALIDATION_EMAIL1 },
          { type: 'email', message: res.VALIDATION_EMAIL2 }
        ],
        'password': [
          { type: 'required', message: res.VALIDATION_PASSWORD },
        ],
        'password_confirmation': [
          { type: 'required', message: res.VALIDATION_PASSWORD_CONFIRM },
        ],
        'terms': [
          { type: 'required', message: res.VALIDATION_TERMS }
        ],

      }
      this.errorToast = res.ERROR_TOAST;
    })

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.register_validation_messages = {
        'name': [
          { type: 'required', message: event.translations.REGISTER_PAGE.VALIDATION_NAME },
        ],
        'email': [
          { type: 'required', message: event.translations.REGISTER_PAGE.VALIDATION_EMAIL1 },
          { type: 'email', message: event.translations.REGISTER_PAGE.VALIDATION_EMAIL2 }
        ],
        'password': [
          { type: 'required', message: event.translations.REGISTER_PAGE.VALIDATION_PASSWORD },
        ],
        'password_confirmation': [
          { type: 'required', message: event.translations.REGISTER_PAGE.VALIDATION_PASSWORD_CONFIRM },
        ],
        'terms': [
          { type: 'required', message: event.translations.REGISTER_PAGE.VALIDATION_TERMS }
        ],
      }
      this.errorToast =  event.translations.REGISTER_PAGE.ERROR_TOAST;
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
              // if(err_res.error.errors.email){
              //   this.emailServerError = err_res.error.errors.email;
              // }
              // if(err_res.error.errors.password){
              //   this.passwordServerError = err_res.error.errors.password;
              // }
              this.toastService.error(this.errorToast, {
                position: 'top-right',
                style: {
                  border: '2px solid #EF4444',
                  padding: '16px',
                  color: '#EF4444',
                  background: '#fff'
                },
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              })
            }
          });
        },
        error: err => {
          this.isLoading = false;
          //this.emailServerError = "Oeps, er is iets mis gegaan."
          this.toastService.error(this.errorToast, {
            position: 'top-right',
            style: {
              border: '2px solid #EF4444',
              padding: '16px',
              color: '#EF4444',
              background: '#fff'
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          })
        }
      });
    }
  }

  goToLogin(){
    this.router.navigate(['login']);
  }
}
