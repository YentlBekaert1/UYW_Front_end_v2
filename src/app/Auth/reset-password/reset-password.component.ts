import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  errorToast: string;
  succesToast: string;
  credentialsError:string;
  resetpasswordForm: FormGroup;
  token: string;
  errorMessage = '';
  emailServerError:string;
  passwordServerError:string;

  responseMessage = "";
  responseMessageState = false;

  isLoading = false;

  reset_password_validation_messages = {
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
  }

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: HotToastService,
    private translate: TranslateService) {

    this.resetpasswordForm = this.fb.group({
      token: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required]
    });

    this.translate.get('RESET_PASSWORD_PAGE').subscribe((res)=>{
      this.reset_password_validation_messages = {
        'email': [
          { type: 'required', message: res.VALIDATION_EMAIL1 },
          { type: 'email', message:  res.VALIDATION_EMAIL2 }
        ],
        'password': [
          { type: 'required', message: res.VALIDATION_PASSWORD},
        ],
        'password_confirmation': [
          { type: 'required', message: res.VALIDATION_PASSWORD_CONFIRM },
        ],
      }
      this.errorToast = res.ERROR_TOAST;
      this.succesToast = res.SUCCES_TOAST;
      this.credentialsError = res.CREDENTIALS_ERROR;
    })

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.reset_password_validation_messages = {
        'email': [
          { type: 'required', message: event.translations.RESET_PASSWORD_PAGE.VALIDATION_EMAIL1 },
          { type: 'email', message:  event.translations.RESET_PASSWORD_PAGE.VALIDATION_EMAIL2 }
        ]
        ,'password': [
          { type: 'required', message: event.translations.RESET_PASSWORD_PAGE.VALIDATION_PASSWORD },
        ],
        'password_confirmation': [
          { type: 'required', message: event.translations.RESET_PASSWORD_PAGE.VALIDATION_PASSWORD_CONFIRM },
        ],
      }
      this.errorToast =  event.translations.RESET_PASSWORD_PAGE.ERROR_TOAST;
      this.succesToast =  event.translations.RESET_PASSWORD_PAGE.SUCCES_TOAST;
      this.credentialsError = event.translations.RESET_PASSWORD_PAGE.ERROR_TOAST;
      this.emailServerError = "";
    });
  }

  ngOnInit(): void {
    const paramsub = this.route.paramMap.subscribe(params => {
      var url_token = params.get('token');
      if(url_token){
        this.token = url_token;
        this.resetpasswordForm.patchValue({
          token: url_token
        })
      }else{
        this.router.navigate(['forbidden']);
      }
    });
  }


  onSubmit(): void {
    console.log(this.resetpasswordForm);
    if(this.resetpasswordForm.invalid){
      this.resetpasswordForm.markAllAsTouched();
      return;
    }else{
      this.isLoading = true;
      this.auth.csrf().subscribe({
        next: data => {
          this.auth.resetpassword(this.resetpasswordForm.value).pipe(first()).subscribe({
            next: data => {
              this.isLoading = false;
              this.toastService.success(this.succesToast, {
                position: 'top-right',
                style: {
                  border: '2px solid #33b188',
                  padding: '16px',
                  color: '#33b188',
                  background: '#fff'
                },
                iconTheme: {
                  primary: '#33b188',
                  secondary: '#fff',
                },
              });
            },
            error: err => {
              this.isLoading = false;
              this.emailServerError = err.credentialsError
              this.responseMessageState = true;
            }
          });
        },
        error: err => {
          this.isLoading = false;
          //this.emailServerError = "Oeps, er is iets mis gegaan."
          //console.log(err);
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
