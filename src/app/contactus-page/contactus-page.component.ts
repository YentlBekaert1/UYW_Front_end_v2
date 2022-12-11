import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
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

  offer_validation_messages = {
    'email': [
      { type: 'required', message: 'Email moet worden ingevuld' },
      { type: 'email', message: 'Er is geen correct email adres ingegeven' }
    ],
    'question': [
      { type: 'required', message: 'Vraag moet worden ingevuld' },
    ],
  }

  constructor(private router: Router, private fb: FormBuilder, private contactservice: ContactUsService, private toastService: HotToastService) {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      question: ['', Validators.required],
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
      this.contactservice.send_message(this.contactForm.value).subscribe({
        next: data => {
          this.isLoading = false;
          this.toastService.success('Verzenden succesvol', {
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
          this.toastService.error('Oeps er is iets verkeerd gegaan', {
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
