import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router, private fb: FormBuilder) {
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
    
  }

}
