import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.scss']
})
export class FAQPageComponent implements OnInit {

  questions: any = [
    {title:"vraag1", description:"beschrijving"},
    {title:"vraag2", description:"beschrijving"},
    {title:"vraag3", description:"beschrijving"},
    {title:"vraag4", description:"beschrijving"},
    {title:"vraag5", description:"beschrijving"},
    {title:"vraag6", description:"beschrijving"},
    {title:"vraag7", description:"beschrijving"},
    {title:"vraag8", description:"beschrijving"}
  ]

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0,0);
  }

}
