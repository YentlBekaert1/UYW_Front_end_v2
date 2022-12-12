import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-email-verfiy-page',
  templateUrl: './email-verfiy-page.component.html',
  styleUrls: ['./email-verfiy-page.component.scss']
})
export class EmailVerfiyPageComponent implements OnInit {
  isLoading = false;
  responseMessage = "";
  responseMessageSuccesfull = "";
  responseMessageError = "";
  responseMessageState = false;

  constructor(
    private authservice: AuthService,
    private router: Router,
    private translate: TranslateService
    ) {
      this.translate.get('EMAIL_VERIFY_PAGE').subscribe((res)=>{
        this.responseMessageError = res.ERROR_RESPONSE;
        this.responseMessageSuccesfull = res.SUCCES_RESPONSE;
      })

      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.responseMessageError =  event.translations.EMAIL_VERIFY_PAGE.ERROR_RESPONSE;
        this.responseMessageSuccesfull = event.translations.EMAIL_VERIFY_PAGE.SUCCES_RESPONSE;
        this.responseMessage = "";
      });
     }

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
            //console.log(data);
            this.responseMessage = this.responseMessageSuccesfull
            this.responseMessageState = true;
          },
          error: err_res => {
            this.responseMessage = this.responseMessageError;
            this.responseMessageState = true;
          }
        });
      },
      error: err => {
        this.isLoading = true;
        this.responseMessage = this.responseMessageError;
      }
    });
  }

  closeClicked(){
    this.responseMessageState = false;
  }

}
