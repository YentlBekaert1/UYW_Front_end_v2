import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Store } from '@ngrx/store';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
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

  errorToast: string;
  credentialsError:string;
  errorMessage = '';
  isLoading = false;
  url:string = "";

  login_validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Er is geen correct email adres ingegeven' }
    ],
    'password': [
      { type: 'required', message: 'Wachtwoord is required' },
    ]
  }

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
    private route: ActivatedRoute,
    private toastService: HotToastService,
    private translate: TranslateService) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        remember: [false]
      });
      const paramsub = this.route.paramMap.subscribe(params => {
        var url = params.get('url');
        if(url){
          this.url = url;
          //console.log(url)
        }
      });

      this.translate.get('LOGIN_PAGE').subscribe((res)=>{
        this.login_validation_messages = {
          'email': [
            { type: 'required', message: res.VALIDATION_EMAIL1 },
            { type: 'email', message:  res.VALIDATION_EMAIL2 }
          ],
          'password': [
            { type: 'required', message: res.VALIDATION_PASSWORD},
          ]
        }
        this.errorToast = res.ERROR_TOAST;
        this.credentialsError = res.CREDENTIALS_ERROR;
      })

      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.login_validation_messages = {
          'email': [
            { type: 'required', message: event.translations.LOGIN_PAGE.VALIDATION_EMAIL1 },
            { type: 'email', message:  event.translations.LOGIN_PAGE.VALIDATION_EMAIL2 }
          ],
          'password': [
            { type: 'required', message: event.translations.LOGIN_PAGE.VALIDATION_PASSWORD },
          ]
        }
        this.errorToast =  event.translations.LOGIN_PAGE.ERROR_TOAST;
        this.credentialsError = event.translations.LOGIN_PAGE.CREDENTIALS_ERROR;
        this.errorMessage = "";
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
              }else{
                this.router.navigate(['/account', 'profile']);
              }
            },
            error: err_res => {
              this.isLoading = false;
              //console.log(this.credentialsError);
              this.errorMessage = this.credentialsError;
            }
          });
        },
        error: err => {
          this.isLoading = false;
          //this.errorMessage = "Oeps, er is iets mis gegaan";
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

  goToRegister(){
    this.router.navigate(['register']);
  }


}
