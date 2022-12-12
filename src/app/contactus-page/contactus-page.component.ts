import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ContactUsService } from '../_services/contact-us.service';

@Component({
  selector: 'app-contactus-page',
  templateUrl: './contactus-page.component.html',
  styleUrls: ['./contactus-page.component.scss']
})
export class ContactusPageComponent implements OnInit {

  contactForm: FormGroup;

  errorMessage = '';
  isLoading = false;

  contact_validation_messages = {
    'email': [
      { type: 'required', message: 'Email moet worden ingevuld' },
      { type: 'email', message: 'Er is geen correct email adres ingegeven' }
    ],
    'question': [
      { type: 'required', message: 'Vraag moet worden ingevuld' },
    ],
  }

  succesToast: string;
  errorToast: string

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private contactservice: ContactUsService,
    private toastService: HotToastService,
    private translate: TranslateService) {

    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      question: ['', Validators.required],
    });

    this.translate.get('CONTACTUS_PAGE').subscribe((res)=>{
      this.contact_validation_messages = {
        'email': [
          { type: 'required', message: res.VALIDATION_EMAIL1 },
          { type: 'email', message:  res.VALIDATION_EMAIL2 }
        ],
        'question': [
          { type: 'required', message:  res.VALIDATION_QUESTION1},
        ],
      }
      this.errorToast = res.ERROR_TOAST;
      this.succesToast = res.SUCCES_TOAST;
    })

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.contact_validation_messages = {
        'email': [
          { type: 'required', message: event.translations.CONTACTUS_PAGE.VALIDATION_EMAIL1 },
          { type: 'email', message:  event.translations.CONTACTUS_PAGE.VALIDATION_EMAIL2 }
        ],
        'question': [
          { type: 'required', message:  event.translations.CONTACTUS_PAGE.VALIDATION_QUESTION1},
        ],
      }
      this.errorToast =  event.translations.CONTACTUS_PAGE.ERROR_TOAST;
      this.succesToast =  event.translations.CONTACTUS_PAGE.SUCCES_TOAST;
    });
  }

  ngOnInit(): void {
    window.scrollTo(0,0);
  }

  backToHome(){
    this.router.navigate(['home'])
  }

  onSubmit(){
    if(this.contactForm.valid){
      console.log(this.contactForm.value)
      this.isLoading = true;
      this.contactservice.send_message(this.contactForm.value).subscribe({
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
        error: err_res => {
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
    }else{
      this.contactForm.markAllAsTouched();
    }
  }

}
