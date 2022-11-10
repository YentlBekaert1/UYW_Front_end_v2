import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetpasswordForm: FormGroup;
  token: string;
  errorMessage = '';
  emailServerError:string;
  passwordServerError:string;

  responseMessage = "";
  responseMessageState = false;

  isLoading = false;

  offer_validation_messages = {
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

  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.resetpasswordForm = this.fb.group({
      token: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required]
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
              this.responseMessage = data.message
              this.responseMessageState = true;
            },
            error: err => {
              this.isLoading = false;
              this.emailServerError = err.message
              this.responseMessageState = true;
            }
          });
        },
        error: err => {
          this.isLoading = false;
          this.emailServerError = "Oeps, er is iets mis gegaan."
          console.log(err);
        }
      });
    }

  }

  closeClicked(){
    this.responseMessageState = false;
  }
}
