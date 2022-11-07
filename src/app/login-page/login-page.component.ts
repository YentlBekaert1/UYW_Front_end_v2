import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;

  errorMessage = '';

  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router) {
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
      return;
    }
    this.auth.csrf().subscribe({
      next: data => {
        this.auth.login(this.loginForm.value).pipe(first()).subscribe({
          next: data => {
            console.log(data);
            this.router.navigate(['account', 'profile']);
          },
          error: err => {
            console.log(err);
          }
        });
      },
      error: err => {
        console.log(err);
      }
    });
  }

  goToRegister(){
    this.router.navigate(['register']);
  }


}
