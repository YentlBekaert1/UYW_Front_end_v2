import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;

  errorMessage = '';
  responseMessage = "We hebben de link naar u toegemaild";
  responseMessageState = false;

  offer_validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Er is geen correct email adres ingegeven' }
    ],
  }


  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if(this.forgetPasswordForm.invalid){
      this.forgetPasswordForm.markAllAsTouched();
      return;
    }
    this.auth.csrf().subscribe({
      next: data => {
        this.auth.forgetpassword(this.forgetPasswordForm.value).pipe(first()).subscribe({
          next: data => {
            console.log(data);
            this.responseMessage = data.message
            this.responseMessageState = true;
            // this.router.navigate(['account', 'profile']);
          },
          error: err_res => {
            console.log(err_res);
            if(err_res.error.errors.email){
              this.errorMessage = err_res.error.errors.email;
            }
          }
        });
      },
      error: err => {
        console.log(err);
      }
    });
  }

  closeClicked(){
    this.responseMessageState = false;
  }
}
