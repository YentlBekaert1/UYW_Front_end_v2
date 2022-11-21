import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-email-verfiy-page',
  templateUrl: './email-verfiy-page.component.html',
  styleUrls: ['./email-verfiy-page.component.scss']
})
export class EmailVerfiyPageComponent implements OnInit {
  isLoading = false;
  responseMessage = "";
  responseMessageState = false;

  constructor(private authservice: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  logoutClicked(){
    this.authservice.csrf().subscribe({
      next: data => {
        this.authservice.logout().then((res)=>{
          this.router.navigate(['home']);
        }).catch(err =>{}
          //console.log(err)
        )
      },
      error: err => {
        //console.log(err);
      }
    });
  }

  resendVerification(){
    this.authservice.csrf().subscribe({
      next: data => {
       this.authservice.resendverfiy().subscribe({
          next: data => {
            console.log(data);
            this.responseMessage = "Nieuwe email succesvol verzonden"
            this.responseMessageState = true;
          },
          error: err_res => {
            this.responseMessage = "Oeps, er is iets mis gegaan."
            this.responseMessageState = true;
          }
        });
      },
      error: err => {
        this.isLoading = true;
        this.responseMessage = "Oeps, er is iets mis gegaan."
      }
    });
  }

  closeClicked(){
    this.responseMessageState = false;
  }

}
