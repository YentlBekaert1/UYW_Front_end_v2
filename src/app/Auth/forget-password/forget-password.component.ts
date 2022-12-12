import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;

  errorToast: string;
  credentialsError:string;
  errorMessage = '';
  responseMessage = "We hebben de link naar u toegemaild";
  responseMessageState = false;
  isLoading = false;

  forget_password_validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Er is geen correct email adres ingegeven' }
    ]
  }


  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastService: HotToastService,
    private translate: TranslateService
    ) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.translate.get('FORGET_PASSWORD_PAGE').subscribe((res)=>{
      this.forget_password_validation_messages = {
        'email': [
          { type: 'required', message: res.VALIDATION_EMAIL1 },
          { type: 'email', message:  res.VALIDATION_EMAIL2 }
        ]
      }
      this.responseMessage = res.RESPONSE;
      this.errorToast = res.ERROR_TOAST;
      this.credentialsError = res.CREDENTIALS_ERROR;
    })

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.forget_password_validation_messages = {
        'email': [
          { type: 'required', message: event.translations.FORGET_PASSWORD_PAGE.VALIDATION_EMAIL1 },
          { type: 'email', message:  event.translations.FORGET_PASSWORD_PAGE.VALIDATION_EMAIL2 }
        ]
      }
      this.errorToast =  event.translations.FORGET_PASSWORD_PAGE.ERROR_TOAST;
      this.credentialsError = event.translations.FORGET_PASSWORD_PAGE.CREDENTIALS_ERROR;
      this.responseMessage = event.translations.FORGET_PASSWORD_PAGE.RESPONSE;
      this.errorMessage = "";
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if(this.forgetPasswordForm.invalid){
      this.forgetPasswordForm.markAllAsTouched();
      return;
    }
    else{
      this.isLoading = true;
      this.auth.csrf().subscribe({
        next: data => {
          this.auth.forgetpassword(this.forgetPasswordForm.value).pipe(first()).subscribe({
            next: data => {
              //console.log(data);
              this.responseMessageState = true;
              this.isLoading = false;
            },
            error: err_res => {
              this.isLoading = false;
              if(err_res.error.errors.email){
                //this.errorMessage = err_res.error.errors.email;
                this.errorMessage = this.credentialsError;
              }
            }
          });
        },
        error: err => {
          //this.errorMessage = "Oeps, er is iets mis gegaan";
          this.isLoading = false;
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

  closeClicked(){
    this.responseMessageState = false;
  }
}
