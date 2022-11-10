import { Component, OnInit } from '@angular/core';
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

  constructor(private authservice: AuthService) { }

  ngOnInit(): void {
  }

  resendVerification(){
    // this.authservice.resendverfiy().subscribe({
    //   next: data => {
    //     console.log(data);
    //     this.responseMessage = "Nieuwe email succesvol verzonden"
    //     this.responseMessageState = false;
    //   },
    //   error: err_res => {
    //     this.responseMessage = "Oeps, er is iets mis gegaan."
    //     this.responseMessageState = false;
    //   }
    // });
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
